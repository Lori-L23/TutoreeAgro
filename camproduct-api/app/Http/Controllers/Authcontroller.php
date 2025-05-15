<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Clients;
use App\Models\Entreprises;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = Validator::make($request->all(), [
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string|max:20',
            'user_type' => 'required|in:client,entreprise',

            // Champs spécifiques client
            'nom_complet' => 'required_if:user_type,client|string|max:255',
            'address' => 'nullable|string|max:255',
            'is_wholesaler' => 'nullable|boolean',

            // Champs spécifiques entreprise
            'nom_entreprise' => 'required_if:user_type,entreprise|string|max:255',
            'siret' => 'nullable|string|max:255|unique:entreprises,siret',
            'activity_sector' => 'nullable|string|max:255',
            'documents' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        if ($validated->fails()) {
            return response()->json(['errors' => $validated->errors()], 422);
        }

        $data = $validated->validated();

        // Upload du document entreprise si fourni
        if ($request->hasFile('documents')) {
            $data['documents_path'] = $request->file('documents')->store('documents', 'public');
        }

        // Création de l'utilisateur
        $user = User::create([
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'password' => Hash::make($data['password']),
        ]);

        // Création du profil lié au type d'utilisateur
        if ($data['user_type'] === 'client') {
            Clients::create([
                'user_id' => $user->id,
                'nom_complet' => $data['nom_complet'],
                'address' => $data['address'] ?? null,
                'is_wholesaler' => $data['is_wholesaler'] ?? false,
            ]);
        }

        if ($data['user_type'] === 'entreprise') {
            Entreprises::create([
                'user_id' => $user->id,
                'nom_entreprise' => $data['nom_entreprise'],
                'siret' => $data['siret'] ?? null,
                'activity_sector' => $data['activity_sector'] ?? null,
                'documents_path' => $data['documents_path'] ?? null,
            ]);
        }

        // Chargement éventuel des relations si elles existent
        $user->load(['client', 'entreprise']);

        return response()->json([
            'message' => 'Inscription réussie.',
            'user' => $user,
        ]);
    }

    public function login(Request $request)
    {
        try {
            $credentials = $request->validate([
                'email' => 'required|email',
                'password' => 'required|string'
            ]);

            // Tentative d'authentification
            if (!Auth::attempt($credentials)) {
                throw ValidationException::withMessages([
                    'email' => ['Invalid credentials'],
                ]);
            }


            $user = User::where('email', $request->email)->firstOrFail();

            // Suppression des anciens tokens
            $user->tokens()->delete();

            // Création d'un nouveau token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Login failed',
                'error' => $e->getMessage()
            ], 500);
        }
    } 
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            return response()->json(['message' => 'Logged out successfully']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Logout failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Admin;
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
            'user_type' => 'required|in:client,entreprise,admin',

            // Champs spécifiques client
            'nom_complet' => 'required_if:user_type,client|string|max:255',
            'address' => 'nullable|string|max:255',
            'is_wholesaler' => 'nullable|boolean',

            // Champs spécifiques entreprise
            'nom_entreprise' => 'required_if:user_type,entreprise|string|max:255',
            'siret' => 'nullable|string|max:255|unique:entreprises,siret',
            'logo'=> 'nullable|file|mimes:jpg,jpeg,png|max:5120',
            'region' => 'nullable|string|max:255',
            'ville' => 'nullable|string|max:255',
            'status' => 'nullable|in:en_attente,approuve,rejete',
            'date_verification' => 'nullable|date',
            'activity_sector' => 'nullable|string|max:255',
            'documents' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',

            // Champs spécifiques admin
            'noms' => 'required_if:user_type,admin|string|max:255',
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
                'logo' => $data['logo'] ?? null,
                'region' => $data['region'] ?? null,
                'ville' => $data['ville'] ?? null,
                'status' => $data['status'] ?? 'en_attente',
                'date_verification' => $data['date_verification'] ?? null,
                'activity_sector' => $data['activity_sector'] ?? null,
                'documents_path' => $data['documents_path'] ?? null,
            ]);
        }

        if ($data['user_type'] === 'admin') {
            Admin::create([
                'user_id' => $user->id,
                'noms' => $data['noms'] ?? null,
            ]);
        }

        // Chargement éventuel des relations si elles existent
        $user->load(['client', 'entreprise', 'admin']);

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

    public function getUserWithProfile(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur non authentifié'
            ], 401);
        }

        $profile = null;
        $profileType = null;

        switch ($user->user_type) {
            case 'client':
                $profile = Clients::where('user_id', $user->id)->first();
                $profileType = 'client';
                break;
            case 'entreprise':
                $profile = Entreprises::where('user_id', $user->id)->first();
                $profileType = 'entreprise';
                break;
            case 'admin':
                $profile = Admin::where('user_id', $user->id)->first();
                $profileType = 'admin';
                break;
            default:
                return response()->json([
                    'message' => 'Rôle utilisateur invalide'
                ], 400);
        }

        // Vérification que le profil existe pour le rôle
        if (!$profile) {
            return response()->json([
                'message' => 'Profil utilisateur introuvable pour ce rôle',
                'user' => $user,
                'profile_type' => $profileType
            ], 404);
        }

        return response()->json([
            'user' => $user,
            'profile' => $profile,
            'profile_type' => $profileType
        ]);
    }
}

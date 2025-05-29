<?php

namespace App\Http\Controllers;

use App\Models\Entreprises;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class EntreprisesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Entreprises $entreprises)
    {
        return response()->json($entreprises);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Entreprises $entreprises)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Entreprises $entreprises)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Entreprises $entreprises)
    {
        //
    }

     public function getProfil()
    {
        $user = Auth::user();
        $entreprise = $user->entreprise;
        
        if (!$entreprise) {
            return response()->json([
                'success' => false,
                'message' => 'Entreprise non trouvée'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $entreprise
        ]);
    }
    
    // Mettre à jour le profil
    public function updateProfil(Request $request)
    {
        $user = Auth::user();
        $entreprise = $user->entreprise;
        
        if (!$entreprise) {
            return response()->json([
                'success' => false,
                'message' => 'Entreprise non trouvée'
            ], 404);
        }
        
        $validator = Validator::make($request->all(), [
            'nom_entreprise' => 'required|string|max:255',
            'secteur' => 'required|string|max:255',
            'description' => 'nullable|string',
            'adresse' => 'required|string|max:255',
            'telephone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'site_web' => 'nullable|url|max:255',
            'date_creation' => 'nullable|date',
            'numero_rccm' => 'nullable|string|max:50',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }
        
        $entreprise->update($validator->validated());
        
        return response()->json([
            'success' => true,
            'data' => $entreprise,
            'message' => 'Profil mis à jour avec succès'
        ]);
    }
    
    // Uploader le logo
    public function uploadLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);
        
        $user = Auth::user();
        $entreprise = $user->entreprise;
        
        if (!$entreprise) {
            return response()->json([
                'success' => false,
                'message' => 'Entreprise non trouvée'
            ], 404);
        }
        
        // Supprimer l'ancien logo s'il existe
        if ($entreprise->logo) {
            Storage::delete('public/logos/' . basename($entreprise->logo));
        }
        
        // Stocker le nouveau logo
        $path = $request->file('logo')->store('public/logos');
        $url = Storage::url($path);
        
        $entreprise->update(['logo' => $url]);
        
        return response()->json([
            'success' => true,
            'data' => [
                'logo_url' => $url
            ],
            'message' => 'Logo mis à jour avec succès'
        ]);
    }
    
}

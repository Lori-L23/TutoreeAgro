<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProduitController extends Controller
{
    // Lister tous les produits de l'entreprise
    public function index()
    {
        $user = Auth::user();
        $entreprise = $user->entreprise;
        
        if (!$entreprise) {
            return response()->json([
                'success' => false,
                'message' => 'Entreprise non trouvée'
            ], 404);
        }
        
        $produits = Produit::where('entreprise_id', $entreprise->id)
            ->with(['categorie', 'avis'])
            ->get();
            
        return response()->json([
            'success' => true,
            'data' => $produits
        ]);
    }
    
    // Créer un nouveau produit
    public function store(Request $request)
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
            'nom' => 'required|string|max:255',
            'description' => 'required|string',
            'region' => 'required|string|max:255',
            'prix' => 'required|numeric|min:0',
            'actif' => 'required|boolean',
            'disponible_en_gros' => 'required|boolean',
            'quantite_stock' => 'required|integer|min:0',
            'quantite_min_gros' => 'required|integer|min:0',
            'status' => 'required|in:en_attente,approuve,rejete',
            'date_modification' => 'nullable|date',
            'categorie_id' => 'required|exists:categories,id',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }
        
        $data = $validator->validated();
        $data['entreprise_id'] = $entreprise->id;
        
        // Créer le produit
        $produit = Produit::create($data);
        
        // Gérer l'upload des images
        if ($request->hasFile('images')) {
            $images = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('public/produits');
                $images[] = Storage::url($path);
            }
            $produit->update(['images' => $images]);
        }
        
        return response()->json([
            'success' => true,
            'data' => $produit,
            'message' => 'Produit créé avec succès'
        ], 201);
    }
    
    // Afficher un produit spécifique
    public function show(Produit $produit)
    {
        $user = Auth::user();
        $entreprise = $user->entreprise;
        
        // Vérifier que le produit appartient à l'entreprise
        if ($produit->entreprise_id !== $entreprise->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }
        
        $produit->load(['categorie', 'avis']);
        
        return response()->json([
            'success' => true,
            'data' => $produit
        ]);
    }
    
    // Mettre à jour un produit
    public function update(Request $request, Produit $produit)
    {
        $user = Auth::user();
        $entreprise = $user->entreprise;
        
        // Vérifier que le produit appartient à l'entreprise
        if ($produit->entreprise_id !== $entreprise->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'prix' => 'sometimes|numeric|min:0',
            'actif' => 'sometimes|boolean',
            'disponible_en_gros' => 'sometimes|boolean',
            'quantite_stock' => 'sometimes|integer|min:0',
            'quantite_min_gros' => 'sometimes|integer|min:0',
            'categorie_id' => 'sometimes|exists:categories,id',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }
        
        $data = $validator->validated();
        
        // Gérer l'upload des nouvelles images
        if ($request->hasFile('images')) {
            // Supprimer les anciennes images
            if ($produit->images) {
                foreach ($produit->images as $image) {
                    Storage::delete('public/produits/' . basename($image));
                }
            }
            
            // Ajouter les nouvelles images
            $images = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('public/produits');
                $images[] = Storage::url($path);
            }
            $data['images'] = $images;
        }
        
        $produit->update($data);
        
        return response()->json([
            'success' => true,
            'data' => $produit,
            'message' => 'Produit mis à jour avec succès'
        ]);
    }
    
    // Supprimer un produit
    public function destroy(Produit $produit)
    {
        $user = Auth::user();
        $entreprise = $user->entreprise;
        
        // Vérifier que le produit appartient à l'entreprise
        if ($produit->entreprise_id !== $entreprise->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }
        
        // Supprimer les images associées
        if ($produit->images) {
            foreach ($produit->images as $image) {
                Storage::delete('public/produits/' . basename($image));
            }
        }
        
        $produit->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Produit supprimé avec succès'
        ]);
    }
}

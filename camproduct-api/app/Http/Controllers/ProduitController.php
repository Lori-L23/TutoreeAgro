<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use App\Models\Categories;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProduitController extends Controller
{
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
            ->with(['categorie_id', 'avis'])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $produits
        ]);
    }

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
            'prix' => 'required|numeric|min:0',
            'prix_promo' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'stock_alerte' => 'required|integer|min:0',
            'categorie_id' => 'required|exists:categories,id',
            'image_principale' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:15000',
            'statut' => 'in:actif,inactif,brouillon',
            'poids' => 'nullable|string',
            'origine' => 'nullable|string',
            'certifications' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Gestion de l'image principale
        $imagePrincipalePath = null;
        if ($request->hasFile('image_principale')) {
            $imagePrincipalePath = $request->file('image_principale')->store('produits', 'public');
            $imagePrincipalePath = Storage::url($imagePrincipalePath);
        }

        // Gestion des images supplémentaires
        $imagesPaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('produits', 'public');
                $imagesPaths[] = Storage::url($path);
            }
        }

        // Si aucune image n'est fournie, utiliser une image par défaut
        if (empty($imagePrincipalePath) && empty($imagesPaths)) {
            $imagesPaths = ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop'];
        }

        $produit = Produit::create([
            'entreprise_id' => $entreprise->id,
            'nom' => $request->nom,
            'description' => $request->description,
            'prix' => $request->prix,
            'prix_promo' => $request->prix_promo,
            'stock' => $request->stock,
            'stock_alerte' => $request->stock_alerte,
            'categorie' => $request->categorie,
            'statut' => $request->statut ?? 'actif',
            'image_principale' => $imagePrincipalePath,
            'images' => !empty($imagesPaths) ? $imagesPaths : null,
            'poids' => $request->poids,
            'origine' => $request->origine,
            'certifications' => $request->certifications ?? [],
            'visible' => $request->visible ?? true,
            'en_promotion' => $request->en_promotion ?? false,
        ]);

        return response()->json([
            'success' => true,
            'data' => $produit,
            'message' => 'Produit créé avec succès'
        ], 201);
    }

    public function show(Produit $produit)
    {
        $user = Auth::user();
        $entreprise = $user->entreprise;

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

    public function update(Request $request, Produit $produit)
    {
        $user = Auth::user();
        $entreprise = $user->entreprise;

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
            'prix_promo' => 'nullable|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'stock_alerte' => 'sometimes|integer|min:0',
            'categorie_id' => 'sometimes|exists:categories,id',
            'image_principale' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:15000',
            'statut' => 'in:actif,inactif,brouillon',
            'poids' => 'nullable|string',
            'origine' => 'nullable|string',
            'certifications' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->except(['image_principale', 'images']);

        // Gestion de l'image principale
        if ($request->hasFile('image_principale')) {
            // Supprimer l'ancienne image si elle existe
            if ($produit->image_principale) {
                $oldPath = str_replace('/storage', 'public', $produit->image_principale);
                Storage::delete($oldPath);
            }

            $path = $request->file('image_principale')->store('produits', 'public');
            $data['image_principale'] = Storage::url($path);
        }

        // Gestion des images supplémentaires
        if ($request->hasFile('images')) {
            // Supprimer les anciennes images si elles existent
            if ($produit->images) {
                foreach ($produit->images as $image) {
                    $oldPath = str_replace('/storage', 'public', $image);
                    Storage::delete($oldPath);
                }
            }

            $imagesPaths = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('produits', 'public');
                $imagesPaths[] = Storage::url($path);
            }
            $data['images'] = $imagesPaths;
        }

        $produit->update($data);

        return response()->json([
            'success' => true,
            'data' => $produit,
            'message' => 'Produit mis à jour avec succès'
        ]);
    }

    public function destroy(Produit $produit)
    {
        $user = Auth::user();
        $entreprise = $user->entreprise;

        if ($produit->entreprise_id !== $entreprise->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }

        // Supprimer les images associées
        if ($produit->image_principale) {
            $path = str_replace('/storage', 'public', $produit->image_principale);
            Storage::delete($path);
        }

        if ($produit->images) {
            foreach ($produit->images as $image) {
                $path = str_replace('/storage', 'public', $image);
                Storage::delete($path);
            }
        }

        $produit->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produit supprimé avec succès'
        ]);
    }

    public function bulkUpdate(Request $request)
    {
        $user = Auth::user();
        $entreprise = $user->entreprise;

        $validator = Validator::make($request->all(), [
            'ids' => 'required|array',
            'ids.*' => 'exists:produits,id',
            'updates' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Vérifier que tous les produits appartiennent à l'entreprise
        $foreignProduits = Produit::whereIn('id', $request->ids)
            ->where('entreprise_id', '!=', $entreprise->id)
            ->count();

        if ($foreignProduits > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Action non autorisée sur certains produits'
            ], 403);
        }

        Produit::whereIn('id', $request->ids)->update($request->updates);

        return response()->json([
            'success' => true,
            'message' => 'Produits mis à jour avec succès'
        ]);
    }
    public function toggleVisibility(Produit $produit)
    {
        $user = Auth::user();
        $entreprise = $user->entreprise;

        if ($produit->entreprise_id !== $entreprise->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }

        $produit->visible = !$produit->visible;
        $produit->save();

        return response()->json([
            'success' => true,
            'data' => $produit,
            'message' => 'Visibilité du produit mise à jour avec succès'
        ]);
    }

public function getcategories()
{
    $categories = Categories::select('id', 'nom')
        ->orderBy('nom', 'asc')
        ->get();

    return response()->json([
        'success' => true,
        'data' => $categories
    ]);
}
}

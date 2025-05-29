<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;


class CommandeController extends Controller
{
    // Lister les commandes
    public function index(Request $request)
    {
        $user = Auth::user();
        $entreprise = $user->entreprise;
        
        if (!$entreprise) {
            return response()->json([
                'success' => false,
                'message' => 'Entreprise non trouvée'
            ], 404);
        }
        
        $limit = $request->input('limit', 10);
        $statut = $request->input('statut');
        
        $query = Commande::with(['client', 'produit'])
            ->whereHas('produit', function($query) use ($entreprise) {
                $query->where('entreprise_id', $entreprise->id);
            })
            ->orderBy('created_at', 'desc');
        
        if ($statut) {
            $query->where('statut', $statut);
        }
        
        $commandes = $query->paginate($limit);
        
        return response()->json([
            'success' => true,
            'data' => $commandes->items(),
            'pagination' => [
                'total' => $commandes->total(),
                'per_page' => $commandes->perPage(),
                'current_page' => $commandes->currentPage(),
                'last_page' => $commandes->lastPage()
            ]
        ]);
    }
    
    // Commandes récentes (pour le dashboard)
    public function recentes()
    {
        $user = Auth::user();
        $entreprise = $user->entreprise;
        
        if (!$entreprise) {
            return response()->json([
                'success' => false,
                'message' => 'Entreprise non trouvée'
            ], 404);
        }
        
        $commandes = Commande::with(['client', 'produit'])
            ->whereHas('produit', function($query) use ($entreprise) {
                $query->where('entreprise_id', $entreprise->id);
            })
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $commandes
        ]);
    }
    
    // Mettre à jour le statut d'une commande
    public function updateStatut(Request $request, Commande $commande)
    {
        $user = Auth::user();
        $entreprise = $user->entreprise;
        
        // Vérifier que la commande appartient bien à l'entreprise
        if ($commande->produit->entreprise_id !== $entreprise->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'statut' => 'required|in:en_preparation,en_cours,livre,annule'
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }
        
        $commande->update(['statut' => $request->statut]);
        
        return response()->json([
            'success' => true,
            'data' => $commande,
            'message' => 'Statut de la commande mis à jour'
        ]);
    }
    
    // Supprimer une commande
    public function destroy(Commande $commande)
    {
        $user = Auth::user();
        $entreprise = $user->entreprise;
        
        // Vérifier que la commande appartient bien à l'entreprise
        if ($commande->produit->entreprise_id !== $entreprise->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }
        
        $commande->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Commande supprimée avec succès'
        ]);
    }
}

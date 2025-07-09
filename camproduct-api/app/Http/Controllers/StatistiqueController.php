<?php

namespace App\Http\Controllers;

use App\Models\Statistique;
use Illuminate\Http\Request;
use App\Models\Produit;
use App\Models\Commande;
use App\Models\Avis;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class StatistiqueController extends Controller
{
    public function getStats()
    {
        $user = Auth::user();
        $entreprise = $user->entreprise;
        
        if (!$entreprise) {
            return response()->json([
                'success' => false,
                'message' => 'Entreprise non trouvée'
            ], 404);
        }
        
        // Nombre total de produits
        $totalProduits = Produit::where('entreprise_id', $entreprise->id)->count();
        
        // Commandes reçues (30 derniers jours)
        $commandesRecues = Commande::whereHas('produit', function($query) use ($entreprise) {
                $query->where('entreprise_id', $entreprise->id);
            })
            ->where('created_at', '>=', now()->subDays(30))
            ->count();
        
        // Chiffre d'affaires (30 derniers jours)
        $chiffreAffaires = Commande::whereHas('produit', function($query) use ($entreprise) {
                $query->where('entreprise_id', $entreprise->id);
            })
            ->where('created_at', '>=', now()->subDays(30))
            ->sum('montant');
        
        // Clients actifs (clients uniques ayant commandé dans les 30 derniers jours)
        $clientsActifs = Commande::whereHas('produit', function($query) use ($entreprise) {
                $query->where('entreprise_id', $entreprise->id);
            })
            ->where('created_at', '>=', now()->subDays(30))
            ->distinct('client_id')
            ->count('client_id');
        
        // Note moyenne
        $noteMoyenne = Avis::whereHas('produit', function($query) use ($entreprise) {
                $query->where('entreprise_id', $entreprise->id);
            })
            ->avg('note');
        
        // Taux de satisfaction (% d'avis avec note >= 4)
        $totalAvis = Avis::whereHas('produit', function($query) use ($entreprise) {
                $query->where('entreprise_id', $entreprise->id);
            })
            ->count();
        
        $avisPositifs = Avis::whereHas('produit', function($query) use ($entreprise) {
                $query->where('entreprise_id', $entreprise->id);
            })
            ->where('note', '>=', 4)
            ->count();
        
        $tauxSatisfaction = $totalAvis > 0 ? round(($avisPositifs / $totalAvis) * 100, 2) : 0;
        
        return response()->json([
            'success' => true,
            'data' => [
                'total_produits' => $totalProduits,
                'commandes_recues' => $commandesRecues,
                'chiffre_affaires' => number_format($chiffreAffaires, 2, '.', ''),
                'clients_actifs' => $clientsActifs,
                'note_moyenne' => round($noteMoyenne, 1) ?? 0,
                'taux_satisfaction' => $tauxSatisfaction
            ]
        ]);
    }
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
    public function show(Statistique $statistique)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Statistique $statistique)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Statistique $statistique)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Statistique $statistique)
    {
        //
    }
}

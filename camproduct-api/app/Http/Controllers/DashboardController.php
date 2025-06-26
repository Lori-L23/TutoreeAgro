<?php

namespace App\Http\Controllers;

use App\Models\Dashboard;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
   public function dashboard(Request $request)
   {
      $user = $request->user();
      $entreprise = $user->entreprise;

      if (!$entreprise) {
         return response()->json([
            'success' => false,
            'message' => 'Entreprise non trouvée'
         ], 404);
      }

      $dashboardData = Dashboard::getDashboardData($entreprise->id);

      return response()->json([
         'success' => true,
         'data' => $dashboardData
      ]);
   }
   public function commandes(Request $request)
   {
      $user = $request->user();
      $entreprise = $user->entreprise;

      if (!$entreprise) {
         return response()->json([
            'success' => false,
            'message' => 'Entreprise non trouvée'
         ], 404);
      }

      $commandes = Dashboard::getCommandes($entreprise->id);

      return response()->json([
         'success' => true,
         'data' => $commandes
      ]);
   }
   public function produits(Request $request)
   {
      $user = $request->user();
      $entreprise = $user->entreprise;

      if (!$entreprise) {
         return response()->json([
            'success' => false,
            'message' => 'Entreprise non trouvée'
         ], 404);
      }

      $produits = Dashboard::getProduits($entreprise->id);

      return response()->json([
         'success' => true,
         'data' => $produits
      ]);
   }
   public function dashboardWithPeriode(Request $request, $SelectedPeriode)
   {
      $user = $request->user();
      $entreprise = $user->entreprise;

      if (!$entreprise) {
         return response()->json([
            'success' => false,
            'message' => 'Entreprise non trouvée'
         ], 404);
      }

      $dashboardData = Dashboard::getDashboardDataWithPeriode($entreprise->id, $SelectedPeriode);

      return response()->json([
         'success' => true,
         'data' => $dashboardData
      ]);
   }
    public function entreprises(Request $request)
    {
        $user = $request->user();
        $entreprise = $user->entreprise;
    
        if (!$entreprise) {
            return response()->json([
                'success' => false,
                'message' => 'Entreprise non trouvée'
            ], 404);
        }
    
        $entreprises = Dashboard::getEntreprises($entreprise->id);
    
        return response()->json([
            'success' => true,
            'data' => $entreprises
        ]);
    }
}


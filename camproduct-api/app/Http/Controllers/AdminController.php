<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Clients;
use App\Models\Commande;
use App\Models\Entreprises;
use App\Models\Produit;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
     public function index()
    {
        $users = User::select('id', 'email', 'user_type', 'created_at',)
                    ->orderBy('created_at', 'desc')
                    ->get();

        return response()->json([
            'success' => true,
            'users' => $users
        ]);
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
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'user_type' => 'required|in:entreprise,client',
            // 'status' => 'sometimes|in:actif,inactif'
        ]);

        $user = User::create($validated);

        return response()->json([
            'success' => true,
            'user' => $user,
            'message' => 'Utilisateur créé avec succès'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Admin $admin)
    {
        return response()->json($admin);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Admin $admin)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
   public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,'.$user->id,
            'user_type' => 'sometimes|in:admin,entreprise,client',
            // 'status' => 'sometimes|in:actif,inactif'
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'user' => $user,
            'message' => 'Utilisateur mis à jour avec succès'
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */ public function destroy(User $user)
    {
        $user->update(['status' => 'inactif']);

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur désactivé avec succès'
        ]);
    }
    public function getProfile()
    {
        $user = Auth::user();
        $admin = $user->admin;

        return response()->json([
            'noms' => $admin->noms, // Récupéré depuis la table admin
            'email' => $user->email,
            'phone' => $user->phone, // Assurez-vous que ce champ existe dans votre table users
            'user_type' => 'admin',
            'avatar' => $user->avatar_url // Champ optionnel
        ]);
    }
    private function getPercentageChange($model)
    {
        $currentMonth = $model::whereMonth('created_at', now()->month)->count();
        $lastMonth = $model::whereMonth('created_at', now()->subMonth()->month)->count();

        return $lastMonth > 0
            ? round(($currentMonth - $lastMonth) / $lastMonth * 100)
            : 100;
    }
    public function getStats()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'users' => User::count(),
                'entreprises' => Entreprises::count(),
                'clients' => Clients::count(),
                'produits' => Produit::count(),
                'commandes' => Commande::count(),
                'users_change' => $this->getPercentageChange(User::class),
                'companies_change' => $this->getPercentageChange(Entreprises::class),
                'products_change' => $this->getPercentageChange(Produit::class),
                'orders_change' => $this->getPercentageChange(Commande::class),
            ]
        ]);
    }


    public function getRecentActivities()
    {
        $activities = ActivityLog::latest()
            ->with('user')
            ->take(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $activities
        ]);
    }

    public function getLatestCompanies()
    {
        $activities = Entreprises::latest()->take(5)->get();

        return response()->json([
            'success' => true,
            'data' => $activities
        ]);
    }
    // Dans votre contrôleur AdminController
    public function updateCompanyStatus($entrepriseId)
    {
        $validated = request()->validate([
            'status' => 'required|boolean'
        ]);

        $entreprise = Entreprises::findOrFail($entrepriseId);
        $entreprise->status = $validated['status'];
        $entreprise->save();

        return response()->json([
            'success' => true,
            'message' => 'Statut mis à jour avec succès'
        ]);
    }
    public function getStatus(){
       
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
            'status' => $entreprise->status
        ]);
    }
}

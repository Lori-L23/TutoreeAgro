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

    /**
     * Show the form for creating a new resource.
     */
    public function getall()
    {
        $entreprises = Entreprises::all();

        return response()->json([
            'success' => true,
            'data' => $entreprises
        ]);
    }


    /**
     * Display the specified resource.
     */
    public function show(Entreprises $entreprises)
    {
        return response()->json([
            'success' => true,
            'data' => $entreprises
        ]);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Entreprises $entreprises)
    {
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

        $entreprises->update($validator->validated());

        return response()->json([
            'success' => true,
            'data' => $entreprises,
            'message' => 'Entreprise mise à jour avec succès'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Entreprises $entreprises)
    {
        // Supprimer l'entreprise
        $entreprises->delete();

        return response()->json([
            'success' => true,
            'message' => 'Entreprise supprimée avec succès'
        ]);
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

    public function getregions()
    {
        $regions = Entreprises::distinct()->pluck('region');

        return response()->json([
            'success' => true,
            'data' => $regions
        ]);
    }

    public function getCategories()
    {
        $categories = Entreprises::distinct()->pluck('categorie');

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }
    public function getCertifications()
    {
        $certifications = Entreprises::distinct()->pluck('certification');

        return response()->json([
            'success' => true,
            'data' => $certifications
        ]);
    }
    public function getStatistiques()
    {
        $user = Auth::user();
        $entreprise = $user->entreprise;

        if (!$entreprise) {
            return response()->json([
                'success' => false,
                'message' => 'Entreprise non trouvée'
            ], 404);
        }

        // Exemple de statistiques, à adapter selon vos besoins
        $statistiques = [
            'nombre_produits' => $entreprise->produits()->count(),
            'nombre_commandes' => $entreprise->commandes()->count(),
            'chiffre_affaires' => $entreprise->commandes()->sum('montant'),
        ];

        return response()->json([
            'success' => true,
            'data' => $statistiques
        ]);
    }
    public function getCommandes()
    {
        $user = Auth::user();
        $entreprise = $user->entreprise;

        if (!$entreprise) {
            return response()->json([
                'success' => false,
                'message' => 'Entreprise non trouvée'
            ], 404);
        }

        $commandes = $entreprise->commandes()->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $commandes
        ]);
    }
    public function getVilles()
    {
        $villes = Entreprises::distinct()->pluck('ville');

        return response()->json([
            'success' => true,
            'data' => $villes
        ]);
    }
    public function getsecteursActivite()
    {
        $activity_sector = Entreprises::distinct()->pluck('activity_sector');

        return response()->json([
            'success' => true,
            'data' => $activity_sector
        ]);
    }

    public function getRegionsAll()
    {
        // $regions = Entreprises::distinct()->pluck('ville');
        
        return Entreprises::select('region')
            ->selectRaw('count(*) as count')
            ->where('status', 'approuve')
            ->groupBy('region')
            ->orderBy('region')
            ->get()
            ->map(function ($region) {
                return [
                    'name' => $region->region,
                    'count' => $region->count
                ];
            });
    }

    public function detailsEntreprise($id)
    {
        $entreprise = Entreprises::find($id);

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
    public function getSectors()
    {
        return Entreprises::select('activity_sector as name')
            ->selectRaw('count(*) as count')
            ->where('status', 'approuve')
            ->groupBy('activity_sector')
            ->orderBy('activity_sector')
            ->get();
    
    }
}

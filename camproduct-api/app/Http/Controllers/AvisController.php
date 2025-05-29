<?php

namespace App\Http\Controllers;

use App\Models\Avis;
use Illuminate\Http\Request;

class AvisController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $avis = Avis::all();
        return response()->json($avis);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
        // This method is not typically used in API controllers
        // You can return a view or redirect if needed
        return response()->json(['message' => 'Create method not implemented'], 405);
        

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'user_id' => 'required|exists:users,id',
            'note' => 'required|integer|min:1|max:5',
            'commentaire' => 'nullable|string|max:255',
        ]);

        $avis = Avis::create($request->all());

        return response()->json($avis, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Avis $avis)
    {
        return response()->json($avis);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Avis $avis)
    {
       
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Avis $avis)
    {
        $request->validate([
            'note' => 'sometimes|required|integer|min:1|max:5',
            'commentaire' => 'sometimes|nullable|string|max:255',
        ]);

        $avis->update($request->all());

        return response()->json($avis);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Avis $avis)
    {
        $avis->delete();

        return response()->json(null, 204);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Certification;
use Illuminate\Http\Request;

class CertificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $certifications = Certification::all();
        return response()->json($certifications);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'nom_certification' => 'required|string|max:255',
            // 'description' => 'nullable|string|max:255',
            // 'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $certification = Certification::create($request->all());

        return response()->json($certification, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Certification $certification)
    {
        return response()->json($certification);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Certification $certification)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Certification $certification)
    {
        $request->validate([
            'nom_certification' => 'required|string|max:255',
            // 'description' => 'nullable|string|max:255',
            // 'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $certification->update($request->all());

        return response()->json($certification);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Certification $certification)
    {
        $certification->delete();
        return response()->json(null, 204);
    }
}

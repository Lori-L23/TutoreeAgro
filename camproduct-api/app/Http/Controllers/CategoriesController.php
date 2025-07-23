<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use Illuminate\Http\Request;

class CategoriesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Categories::all();
        return response()->json($categories);
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
        $request->validate([
            'nom' => 'required|string|max:255',
            // 'slug' => 'required|string|unique:categories,slug',
            // 'description' => 'nullable|string',
        ]);

        $category = Categories::create($request->all());

        return response()->json($category, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Categories $categories)
    {
        return response()->json($categories);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Categories $categories)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Categories $categories)
    {
        $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            // 'slug' => 'sometimes|required|string|unique:categories,slug,' . $categories->id,
            // 'description' => 'sometimes|nullable|string',
        ]);

        $categories->update($request->all());

        return response()->json($categories);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Categories $categories)
    {
        $categories->delete();

        return response()->json(['message' => 'Category deleted successfully'], 204);
    }
    public function getRegionsAll()
    {
        $regions = Categories::distinct()->pluck('region');
        return response()->json($regions);
    }
}

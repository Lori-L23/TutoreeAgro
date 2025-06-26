<?php

namespace App\Http\Controllers;

use App\Models\Clients;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClientsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $clients = Clients::all();
        return response()->json($clients);
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
            'email' => 'required|email|unique:clients,email',
            'telephone' => 'nullable|string|max:20',
            // Add other validation rules as necessary
        ]);

        $client = Clients::create($request->all());

        return response()->json($client, 201);
        
    }

    /**
     * Display the specified resource.
     */
    public function show(Clients $clients)
    {
        return response()->json($clients);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Clients $clients)
    {
      
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Clients $clients)
    {
        $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:clients,email,' . $clients->id,
            'telephone' => 'nullable|string|max:20',
            // Add other validation rules as necessary
        ]);

        $clients->update($request->all());

        return response()->json($clients);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Clients $clients)
    {
        $clients->delete();

        return response()->json([
            'message' => 'Client deleted successfully'
        ], 204);

    }
    public function getProfil()
{
    $user = Auth::user();
    
    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'User not authenticated'
        ], 401);
    }

    $client = Clients::where('user_id', $user->id)->first();

    if (!$client) {
        return response()->json([
            'success' => false,
            'message' => 'Client profile not found'
        ], 404);
    }

    return response()->json([
        'success' => true,
        'profile' => $client,
        'user' => [
            'id' => $user->id,
            'email' => $user->email,
            'phone' => $user->phone,
            'user_type' => $user->user_type,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at
        ]
    ]);
}
    public function updateProfil(){

        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $client = Clients::where('user_id', $user->id)->first();

        if (!$client) {
            return response()->json(['message' => 'Client not found'], 404);
        }

        $data = request()->validate([
            'nom' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique',
            'phone' => 'nullable|string|max:20',
        ]);

        $client->update($data);

        return response()->json($client);
    }
    
    public function getorders(){

        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $client = Clients::where('user_id', $user->id)->first();

        if (!$client) {
            return response()->json(['message' => 'Client not found'], 404);
        }

        $orders = $client->orders; // Assuming the relationship is defined in the Clients model

        return response()->json($orders);
    }

    public function getfavorites(){

        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $client = Clients::where('user_id', $user->id)->first();

        if (!$client) {
            return response()->json(['message' => 'Client not found'], 404);
        }

        $favorites = $client->favorites; // Assuming the relationship is defined in the Clients model

        return response()->json($favorites);
    }
    public function getaddresses(){
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $client = Clients::where('user_id', $user->id)->first();

        if (!$client) {
            return response()->json(['message' => 'Client not found'], 404);
        }

        $addresses = $client->addresses; // Assuming the relationship is defined in the Clients model

        return response()->json($addresses);

    }

    public function changepassword(){
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $data = request()->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        if (!password_verify($data['current_password'], $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 403);
        }

        User::where('id', $user->id)->update([
            'password' => bcrypt($data['new_password'])
        ]);

        return response()->json(['message' => 'Password changed successfully']);

    }
}
 
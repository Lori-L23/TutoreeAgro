<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Clients extends Model
{
    protected $fillable = [
        'user_id',
        'nom_complet',
        'address',
        'is_wholesaler',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function commandes()
    {
        return $this->hasMany(Commande::class);
    }
    public function produits()
    {
        return $this->belongsToMany(Produit::class, 'client_produit')
            ->withPivot('quantity', 'price')
            ->withTimestamps(); 
    }
}

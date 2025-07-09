<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    protected $fillable = [
        'produit_id',
        'entreprise_id',
        'client_id',
        'quantite',
        'prix_total',
        'statut',
        'adresse_livraison',

    ];

    protected $casts = [
        'prix_total' => 'decimal:2',
        'date_commande' => 'datetime',
    ];

    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }

    public function entreprise()
    {
        return $this->belongsTo(Entreprises::class);
    }

    public function client()
    {
        return $this->belongsTo(Clients::class);
        // return $this->belongsTo(User::class, 'client_id');
    }
}

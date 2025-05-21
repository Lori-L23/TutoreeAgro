<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
// use App\Models\Entreprises;

class Produit extends Model
{
    protected $fillable = [
        'entreprise_id',
        'nom',
        'categorie',
        'description',
        'prix',
        'ingredients',
        'region',
        'image',
        'actif',
        'disponible_en_gors',
        'quantite_stock',

    ];

    protected $casts = [
        'disponible_en_gros' => 'boolean',
        'actif' => 'boolean',
    ];

    public function entreprise()
    {
        return $this->belongsTo(Entreprises::class);
    }
      public function avis()
    {
        return $this->hasMany(Avis::class);
    }
}

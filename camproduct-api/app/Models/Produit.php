<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
// use App\Models\Entreprises;

class Produit extends Model
{
    protected $fillable = [
        'entreprise_id',
        'nom',
        'categorie_id', // Utilisez l'ID de la catégorie
        'description',
        'prix',
        'prix_promo',
        'stock',
        'stock_alerte',
        'statut',
        'ventes',
        'vues',
        'favoris',
        'notation',
        'nombre_avis',
        'visible',
        'en_promotion',
        'poids',
        'origine',
        'certifications',
        'image_principale', // Champ pour l'image principale

    ];

    protected $casts = [
        'disponible_en_gros' => 'boolean',
        'actif' => 'boolean',
        'prix' => 'decimal:2',
    ];

    public function entreprise()
    {
        return $this->belongsTo(Entreprises::class);
    }
      public function avis()
    {
        return $this->hasMany(Avis::class);
    }
    public function certifications()
    {
        return $this->hasMany(Certification::class);
    }
    public function categorie()
    {
        return $this->belongsTo(Categories::class);
    }
    public function commandes()
    {
        return $this->hasMany(Commande::class);
    }
}

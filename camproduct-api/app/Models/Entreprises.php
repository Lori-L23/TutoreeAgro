<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Entreprises extends Model
{
    protected $fillable = [
        'user_id',
        'nom_entreprise',
        'siret',
        'logo',
        'ville',
        'region',
        // 'site_web',
        // 'adresse',
        // 'code_postal',
        // 'date_verification',
        'status',
        'activity_sector',
        'documents_path',
    ];

    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function produits(){

        return $this->hasMany(Produit::class);
    }

      public function isApproved()
    {
        return $this->status === 'approuve';
    }
}

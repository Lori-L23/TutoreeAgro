<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Avis extends Model
{
       protected $fillable = [
        'user_id',
        'produit_id',
        'note',
        'commentaire',
        'verifie',
    ];

        protected $casts = [
        'verifie' => 'boolean',
    ];

    /**
     * Get the user that owns the avis.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the produit that owns the avis.
     */
    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }

}

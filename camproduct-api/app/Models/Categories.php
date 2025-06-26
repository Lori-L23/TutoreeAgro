<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categories extends Model
{
    protected $fillable = [
        'nom',
        // 'slug',
        // 'description',
    ];

    /**
     * Get the produits for the category.
     */
    public function produits()
    {
        return $this->hasMany(Produit::class);
    }
    /**
     * Get the certifications for the category.
     */
    public function certifications()
    {
        return $this->hasMany(Certification::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Entreprises extends Model
{
    protected $fillable = [
        'user_id',
        'nom_entreprise',
        'siret',
        'activity_sector',
        'documents_path',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

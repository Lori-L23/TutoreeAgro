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
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certification extends Model
{
   protected $fillable =[
    'produit_id',
    'nom_certification',
    'description',
    // 'logo'
   ];
    public function produit()
    {
         return $this->belongsTo(Produit::class);
    }

}

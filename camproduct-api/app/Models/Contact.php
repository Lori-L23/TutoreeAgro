<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Contact extends Model
{
     use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'subject',
        'message',
        'type',
        'status'
    ];

    protected $casts = [
        'read_at' => 'datetime',
    ];

    // Scopes pour filtrer les messages
    public function scopeNew($query)
    {
        return $query->where('status', 'new');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    // Marquer comme lu
    public function markAsRead()
    {
        $this->update([
            'status' => 'read',
            'read_at' => now()
        ]);
    }
}

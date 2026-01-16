<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FixedAsset extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'value',
        'category', // Tambahkan ini
        'purchased_at',
        'note',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'purchased_at' => 'date:Y-m-d',
    ];
}

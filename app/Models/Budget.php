<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Budget extends Model
{
    protected $fillable = [
        'user_id',
        'month', // YYYY-MM
        'group', // needs|wants|saving
        'category_id',
        'amount',
    ];

    protected $casts = [
        'amount' => 'float',
    ];

    // FIX: Menambahkan relasi ke model Category
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}

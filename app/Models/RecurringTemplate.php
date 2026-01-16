<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecurringTemplate extends Model
{
    protected $fillable = [
        'user_id',
        'wallet_id',
        'category_id',
        'name',
        'amount',
        'type',
        'frequency',
        'last_applied_at',
        'next_due_date'
    ];

    protected $casts = [
        'next_due_date' => 'date',
        'last_applied_at' => 'date',
    ];
}

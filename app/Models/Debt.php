<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Debt extends Model
{
    protected $fillable = [
        'user_id',
        'person_name',
        'type',             // 'debt' atau 'credit'
        'amount',
        'remaining_amount',
        'due_date',
        'note',
        'status'            // 'unpaid' atau 'paid'
    ];

    protected $casts = [
        'amount' => 'float',
        'remaining_amount' => 'float',
        'due_date' => 'date:Y-m-d',
    ];
}

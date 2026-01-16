<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'target_amount',
        'current_amount',
        'due_date',
        'note',
    ];

    protected $casts = [
        'target_amount' => 'float',
        'current_amount' => 'float',
        'due_date' => 'date:Y-m-d',
    ];
}

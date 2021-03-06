<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'player1',
        'player2',
        'player3',
        'player4',
        'gamestate',
        'scorelimit',
        'scoreteam1',
        'scoreteam2'
    ];

}

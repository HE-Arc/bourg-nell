<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public static function create(Request $request)
    {
        $player1 = $request->input("player1");
        $player2 = $request->input("player2");
        $player3 = $request->input("player3");
        $player4 = $request->input("player4");
        $scoreLimit = $request->input("scoreLimit");

        if (empty($player1)) {
            //TODO Error
        } else if (empty($player2)) {
            //TODO Error
        } else if (empty($player3)) {
            //TODO Error
        } else if (empty($player4)) {
            //TODO Error
        } else if (empty($scoreLimit)) {
            //TODO Error
        } else {
            $game = new Game();
            $game->player1 = $player1;
            $game->player2 = $player2;
            $game->player3 = $player3;
            $game->player4 = $player4;
            $game->scoreLimit = $scoreLimit;
            $game->scoreteam1 = 0;
            $game->scoreteam2 = 0;
            $game->save();
        }
    }

    public static function getByUser($id)
    {
    }

    public static function read($id)
    {
    }

    public static function update($id)
    {
    }

    public static function delete($id)
    {
    }
}

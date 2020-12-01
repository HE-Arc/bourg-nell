<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
            return response()->json(["player1" => "string"], 400);
        } else if (empty($player2)) {
            return response()->json(["player2" => "string"], 400);
        } else if (empty($player3)) {
            return response()->json(["player3" => "string"], 400);
        } else if (empty($player4)) {
            return response()->json(["player4" => "string"], 400);
        } else if (empty($scoreLimit)) {
            return response()->json(["scoreLimite" => "int"], 400);
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
            return response()->json(['gameId' => 1234], 200);
        }
    }

    public static function getByUser($id)
    {
        $games = DB::select('SELECT * FROM games WHERE player1 = ? OR player2 = ? OR player3=? OR player4=?', [$id, $id, $id, $id]);

        return response($games, 200);
    }

    public static function read($id)
    {
        $game = Game::find($id);
        if(empty($game)){
            return response()->json(['id' => 'Game '.$id.' does not exist'], 400);  
        }else{
            return response($game, 200);
        }
    }

    public static function update($id)
    {
    }

    public static function delete($id)
    {
        $resDelete = DB::delete('DELETE FROM games WHERE id = ?', [$id]);
        if ($resDelete == 0) {
            return response()->json(['id' => 'game ' . $id . ' does not exist'], 400);
        } else {
            
            return response()->json(['deleted' => 'game ' . $id], 200);
        }
    }
}

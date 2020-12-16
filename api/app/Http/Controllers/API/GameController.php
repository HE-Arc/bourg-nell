<?php

namespace App\Http\Controllers\API;

use App\Models\Game;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class GameController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $id = auth()->user()->id;
        return GameController::getByUser($id);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $inputs  = $request->only(['player1', 'player2', 'player3', 'player4', 'scorelimit']);

        if (sizeof($inputs) < 5) {
            return response()->json(['error' => 'missing parameter'], 400);
        } else {
            $game = Game::create($inputs);
            return response()->json(['game' => $game], 200);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        /*
        $games = GameController::getGamesJoinUser()->where('gameid', '=', $id)->get();
        $tmp = collect($games);
        print_r($tmp);
        $processedGame = GameController::processGames($games);
        */

        $game = Game::find($id);
        if (empty($game)) {
            return response()->json(['id' => 'game ' . $id . ' does not exist'], 400);
        } else {
            return response()->json(['game' => $game], 200);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $inputs  = $request->only(['scorelimit', 'gamestate', 'scoreteam1', 'scoreteam2']);

        $validator = Validator::make($inputs, [
            'gamestate' => 'between:0,4'
        ]);

        if (!$validator->fails()) {
            $game = Game::find($id);

            if (!empty($inputs) && $game != null) {
                $game->update($inputs);
                return $this->show($id);
            }
        }
        return response()->json(['message' => 'bad request'], 400);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $game = Game::find($id);
        if (!empty($game)) {
            $game->delete();
            return response()->json(['message' => 'game ' . $id . 'deleted'], 200);
        } else {
            return response()->json(['message' => 'game ' . $id . ' does not exist'], 400);
        }
    }

    public static function getByUser($id)
    {
        $games = GameController::getGamesJoinUser()->where('player1', '=', $id)
            ->orWhere('player2', '=', $id)
            ->orWhere('player3', '=', $id)
            ->orWhere('player4', '=', $id)
            ->get();
        
        $processedGames = GameController::processGames($games);
    
        return response()->json(["games" => $processedGames], 200);
    }

    public static function getGamesJoinUser(){
        return DB::table('games')
            ->join('users', function ($join) {
                $join->on('games.player1', '=', 'users.id')
                    ->orOn('games.player2', '=', 'users.id')
                    ->orOn('games.player3', '=', 'users.id')
                    ->orOn('games.player4', '=', 'users.id');
            })->select(
                'games.id as gameid',
                'player1',
                'player2',
                'player3',
                'player4',
                'gamestate',
                'scorelimit',
                'scoreteam1',
                'scoreteam2',
                'users.name',
                'users.id as userid',
                'users.profilpicturepath',
                'games.created_at',
                'games.updated_at'
            );
    }

    public static function processGames($games){
        $processedGames = $games->groupBy('gameid')->values()->map(function ($groupedGames) {
            return collect($groupedGames->reduce(function ($carry, $item) {
                if ($carry == null) {
                    $carry = $item;
                }

                $userObj = [
                    'id' => $item->userid,
                    'name' => $item->name,
                    'profilpicturepath' => $item->profilpicturepath
                ];

                if ($item->userid == $item->player1) {
                    $carry->player1 = $userObj;
                } else if ($item->userid == $item->player2) {
                    $carry->player2 = $userObj;
                } else if ($item->userid == $item->player3) {
                    $carry->player3 = $userObj;
                } else if ($item->userid == $item->player4) {
                    $carry->player4 = $userObj;
                }
                return $carry;
            }))->except(['name', 'userid', 'profilpicturepath']);
        });
        return $processedGames;
    }
}

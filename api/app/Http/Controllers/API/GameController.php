<?php

namespace App\Http\Controllers\API;

use App\Models\Game;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
        return Game::all();
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
        $game = Game::find($id);
        if (empty($game)) {
            return response()->json(['id' => 'Game ' . $id . ' does not exist'], 400);
        } else {
            return response($game, 200);
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

        $inputs  = $request->only(['player1', 'player2', 'player3', 'player4', 'scorelimit', 'gamestate', 'scoreteam1', 'scoreteam2']);

        $validator = Validator::make($inputs, [
            'player1' => 'exists:games',
            'player2' => 'exists:games',
            'player3' => 'exists:games',
            'player4' => 'exists:games',
            'gamestate' => 'between:0,4'
        ]);

        if (!$validator->fails()) {

            $game = Game::find($id);
            /**
             * Test if users exists and if users are duplicate in the request
             */
            $usersId = array();
            foreach ($inputs as $key => $value) {
                if (strpos($key, 'player') !== false) {
                    if (in_array($value, $usersId)) {
                        return response()->json(['success' => 'false', 'message' => 'duplicate user in game'], 400);
                    } else {
                        array_push($usersId, $value);
                    }
                }
            }

            if (!empty($inputs) && $game != null) {
                $game->update($inputs);
                return $this->show($id);
            }
        }
        return response()->json(['success' => 'false', 'message' => 'bad request'], 400);
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
            return response()->json(['success' => true, 'message' => 'game ' . $id . 'deleted'], 200);
        } else {
            return response()->json(['success' => false, 'message' => 'game ' . $id . ' does not exist'], 400);
        }
    }

    public static function getByUser($id)
    {
        $games = Game::where('player1', '=', $id)
            ->orWhere('player2', '=', $id)
            ->orWhere('player3', '=', $id)
            ->orWhere('player4', '=', $id)
            ->get();

        return response()->json(['success' => true, $games], 200);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\Game;

class GameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $gameStateValues = ["CREATED", "ABORTED", "PLAYING", "WONTEAM1", "WONTEAM2"];

        $g = new Game();


        $g->player1 = 1;
        $g->player2 = 2;
        $g->player3 = 3;
        $g->player4 = 4;

        $g->scorelimit = 1000;
        $gameState = $gameStateValues[rand(0, 4)];
        $g->gamestate = $gameState;

        switch ($gameState) {
            case "WONTEAM1":
                $g->scoreteam1 = 1000;
                $g->scoreteam2 = rand(100, 999);
                break;
            case "WONTEAM2":
                $g->scoreteam1 = rand(100, 999);
                $g->scoreteam2 = 1000;
                break;
            case "CREATED":
                $g->scoreteam1 = 0;
                $g->scoreteam2 = 0;
                break;
            default: #case ABORTED et PLAYING
                $g->scoreteam1 = rand(100, 999);
                $g->scoreteam2 = rand(100, 999);
                break;
        }
        $g->save();
    }
}

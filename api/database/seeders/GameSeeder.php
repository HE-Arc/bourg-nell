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
        // ["CREATED" => 0, "ABORTED" => 1, "PLAYING" => 2, "WONTEAM1" => 3, "WONTEAM2" => 4];

        $g = new Game();


        $g->player1 = 1;
        $g->player2 = 2;
        $g->player3 = 3;
        $g->player4 = 4;

        $g->scorelimit = 1000;
        $gameState = rand(0, 4);
        $g->gamestate = $gameState;

        switch ($gameState) {
            case 0:
                $g->scoreteam1 = 0;
                $g->scoreteam2 = 0;
                break;
            case 3:
                $g->scoreteam1 = 1000;
                $g->scoreteam2 = rand(100, 999);
                break;
            case 4:
                $g->scoreteam1 = rand(100, 999);
                $g->scoreteam2 = 1000;
                break;
            
            default: #case ABORTED et PLAYING
                $g->scoreteam1 = rand(100, 999);
                $g->scoreteam2 = rand(100, 999);
                break;
        }
        $g->save();
    }
}

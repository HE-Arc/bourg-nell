<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $user = new UserSeeder();
        $user->run();

        $game = new GameSeeder();
        for($i = 0; $i < 5; $i++){
            $game->run();
        }
    }
}

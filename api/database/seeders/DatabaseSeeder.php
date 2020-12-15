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
        for($i = 0; $i <= 60; $i++){
            $user->run();
        }

        $game = new GameSeeder();
        for($i = 0; $i < 15; $i++){
            $game->run();
        }

        /*
        $friend = new FriendSeeder();
        for($i = 0; $i < 15; $i++){
            $friend->run();
        }

        $friendInvitation = new FriendinvitationSeeder();
        for($i = 0; $i < 5; $i++){
            $friendInvitation->run();
        }
        */
    }
}

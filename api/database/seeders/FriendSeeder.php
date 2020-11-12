<?php

namespace Database\Seeders;

use App\Models\Friend;
use App\Models\Friendinvitation;
use Illuminate\Database\Seeder;

class FriendSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $friend = new Friend();
        $friendInvitation = new Friendinvitation();
        $randVal = rand(1, 60);

        $friendInvitation->requester = $randVal;
        $friendInvitation->requested = 60 - $randVal;
        
        $friend->user1 = $randVal;
        $friend->user2 = 60 - $randVal;
        
        $friend->save();
        $friendInvitation->save();
    }
}

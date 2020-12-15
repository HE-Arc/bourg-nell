<?php

namespace Database\Seeders;

use App\Models\Friendinvitation;
use Illuminate\Database\Seeder;

class FriendinvitationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        
        $friendInvitation = new Friendinvitation();

        $randVal = rand(1, 60);
        $friendInvitation->requester = $randVal;
        $friendInvitation->requested = 60 - $randVal;

        $friendInvitation->save();
        
    }
}

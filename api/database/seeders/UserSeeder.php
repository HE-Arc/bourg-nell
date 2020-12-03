<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $u = new User();
        $u->username = Str::random(10);
        $u->password = Hash::make("password");
        $u->email = Str::random(10) . "@gmail.com";
        $u->profilpicturepath = "/pictures/" . Str::random(5) . ".png";
        $u->save();
    }
}

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
        $u->name = Str::random(10);
        $u->password = "1234";
        $u->email = "test" . Str::random(5) . "@gmail.com";
        $u->profilpicturepath = "/pictures/" . Str::random(5) . ".png";
        $u->save();
    }
}

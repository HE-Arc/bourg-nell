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
        $u->password = Hash::make("1234");
        $u->email = "test" . Str::random(5) . "@gmail.com";
        $u->gravatar = md5($u->email);
        $u->save();
    }

    public function createAdminUser(){
        $adminUser = new User();
        $adminUser->name = "admin";
        $adminUser->password = Hash::make("adminpassword");
        $adminUser->email = "test@gmail.com";
        $adminUser->gravatar = md5($adminUser->email);
        $adminUser->isadmin = true;
        $adminUser->save();
    }
}

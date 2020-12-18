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
        $this->createAdminUser();
        $this->createUsers();

    }

    private function createAdminUser(){
        $adminUser = new User();
        $adminUser->name = "admin";
        $adminUser->password = Hash::make("adminpassword");
        $adminUser->email = "test@gmail.com";
        $adminUser->gravatar = md5($adminUser->email);
        $adminUser->isadmin = true;
        $adminUser->save();
    }

    private function createUsers(){
        $nameArray = ['Bob', 'Jean', 'Hector', 'Marc', 'Benoit', 'Antoine'];

        foreach($nameArray as $name){
            $u = new User();
            $u->name = $name;
            $u->password = Hash::make('1234');
            $u->email = strtolower($name) . '@gmail.com';
            $u->gravatar = md5($u->email);
            $u->save();
        }
    }
}

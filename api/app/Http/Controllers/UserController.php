<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public static function read($id)
    {
        return User::findOrFail($id);
    }

    public static function create(Request $request)
    {
        $username = $request->input("username");
        $email = $request->input("email");
        $password = $request->input("password");

        if (empty($username)) {
            //TODO Error
        } else if (empty($email)) {
            //TODO Error
        } else if (empty($password)) {
            //TODO Error
        } else {
            $u = new User();
            $u->username = $username;
            $u->email = $email;
            $u->hashpassword = Hash::make($password);
            $u->profilpicturepath = "/pictures/default.png";

            $u->save();

            //TODO Debug
            UserController::getUserByName($username);
        }
    }

    public static function update(Request $request, $id)
    {
        print($id);
        print($request->input("username"));
    }

    public static function delete($id)
    {
        return DB::delete('DELETE FROM users WHERE id = ?', [$id]);
    }

    public static function getUserByName($username)
    {
        $user = DB::select('SELECT * FROM users WHERE username = ?', [$username]);
        print_r($user);
    }
}

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

        $user =  User::find($id);
        if (empty($user)) {
            return response()->json(['id' => 'user ' . $id . ' does not exist'], 400);
        } else {
            return response($user, 200);
        }
    }

    public static function create(Request $request)
    {
        $username = $request->input("username");
        $email = $request->input("email");
        $password = $request->input("password");

        $userAlreadyExist = UserController::getUserByName($username);


        if (empty($username)) {
            return response()->json(["username" => "string"], 400);
        } else if (empty($email)) {
            return response()->json(["email" => "string"], 400);
        } else if (empty($password)) {
            return response()->json(["password" => "string"], 400);
        } else if (empty($userAlreadyExist)) {
            return response()->json(["username" => "user " . $username . " already exists"], 400);
        } else {
            $u = new User();
            $u->username = $username;
            $u->email = $email;
            $u->hashpassword = Hash::make($password);
            $u->profilpicturepath = "/pictures/default.png";

            $u->save();

            //TODO Debug
            $user = UserController::getUserByName($username);
            return response($user, 400);
        }
    }

    public static function update(Request $request, $id)
    {
        //TODO
        $test = $request->all();
        print($id);
        print($request->input("username"));
        print_r($test);
        
    }

    public static function delete($id)
    {
        $resDelete = DB::delete('DELETE FROM users WHERE id = ?', [$id]);
        if ($resDelete == 0) {
            return response()->json(['id' => 'user ' . $id . ' does not exist'], 400);
        } else {
            
            return response()->json(['deleted' => "user" . $id], 200);
        }
        
    }

    public static function getUserByName($username)
    {
        $user = DB::select('SELECT * FROM users WHERE username = ?', [$username]);
        print_r($user);
    }
}

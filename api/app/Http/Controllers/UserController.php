<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public static function index($id)
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

        $user = User::where('username', '=', $username)->exists();

        if ($user == null) {
            if (empty($username)) {
                return response()->json(["username" => "string"], 400);
            } else if (empty($email)) {
                return response()->json(["email" => "string"], 400);
            } else if (empty($password)) {
                return response()->json(["password" => "string"], 400);
            } else {
                $u = new User();
                $u->username = $username;
                $u->email = $email;
                $u->hashpassword = Hash::make($password);
                $u->profilpicturepath = '/pictures/default.png';

                $u->save();

                //TODO Debug
                $user =  User::where('username', '=', $username)->first();
                return response($user, 200);
            }
        } else {
            return response()->json(['username' => 'user ' . $username . ' already exists'], 400);
        }
    }

    public static function update(Request $request, $id)
    {
        $username = $request->input('username');
        $email = $request->input('email');
        $password = $request->input('password');
        $updateField = array();

        if (!empty($username)) {
            $updateField["username"] = $username;
        }

        if (!empty($email)) {
            $updateField["email"] = $email;
        }

        if (!empty($password)) {
            $updateField["hashpassword"] = $password;
        }

        if (!empty($updateField)) {
            User::where('id', '=', $id)->update($updateField);
            return UserController::index($id);
        }

        return response()->json([], 400);
        
    }

    public static function delete($id)
    {
        $resDelete = User::where('id', '=', $id)->delete();
        if ($resDelete == 0) {
            return response()->json(['id' => 'user ' . $id . ' does not exist'], 400);
        } else {

            return response()->json(['deleted' => 'user ' . $id], 200);
        }
    }

    public static function getUserByName($username)
    {
        //TODO
    }
}

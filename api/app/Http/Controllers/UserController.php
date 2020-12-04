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

    public static function create($inputs)
    {
        $user = User::where('name', '=', $inputs['name'])->exists();

        if ($user == null) {
            if (sizeof($inputs) < 3) {
                return response()->json(['error' => 'missing parameter'], 400);
            } else {
                $user = User::create([
                    'name' => $inputs['name'],
                    'email' => $inputs['email'],
                    'password' => Hash::make($inputs['password']),
                ]);
                return response()->json(['user' => $user]);
            }
        } else {
            return response()->json(['error' => 'user exists'], 400);
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

    public static function login($credentials)
    {
        $token = auth()->attempt($credentials);

        return response()->json(['token' => $token], 200);
        
    }
}

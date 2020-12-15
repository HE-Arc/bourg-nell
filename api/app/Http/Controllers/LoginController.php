<?php

namespace App\Http\Controllers;

use App\Http\Controllers\API\UserController;
use Illuminate\Http\Request;

class LoginController extends Controller
{   
    public static function create(Request $request)
    {   
        return UserController::store($request);
    }

    public static function login($credentials)
    {
        $token = auth()->attempt($credentials);

        if($token){
            return response()->json(['success' => true, 'token' => $token], 200);
        }
        
        return response()->json(['success' => false, 'error' => 'invalid credentials'], 400);
    }

    public static function logout(){
        auth()->logout();
        return response()->json(['success' => true, 'message' => 'logout'], 200);
    }
}



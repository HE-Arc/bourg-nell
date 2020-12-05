<?php

namespace App\Http\Controllers;

use App\Http\Controllers\API\UserController;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

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
            return response()->json(['token' => $token], 200);
        }
        
        return response()->json(['error' => 'invalid credentials'], 200);
    }

    //TODO Debug, ne marche pas
    public static function logout(Request $request){
        JWTAuth::invalidate($request->input('token'));
        try {
            
            return response()->json(['success' => true, 'message' => 'logout'], 200);
        } catch (JWTException $e) {
            return response()->json(['success' => false, 'message' => 'logout error'], 400);
        }
    }
}

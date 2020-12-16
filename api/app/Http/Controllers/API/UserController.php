<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(['users' => User::all()]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public static function store(Request $request)
    {
        $inputs = $request->only(['name', 'password', 'email']);

        $validator = Validator::make($inputs, [
            'name' => 'size:20',
            'email' => 'unique:users',
        ]);

        if (!$validator->fails()) {
            if (sizeof($inputs) < 3) {
                return response()->json(['error' => 'missing parameters'], 400);
            } else {
                $user = User::create([
                    'name' => $inputs['name'],
                    'email' => $inputs['email'],
                    'password' => Hash::make($inputs['password']),
                    'gravatar' => md5($inputs['email'])
                ]);
                return response()->json(['user' => $user]);
            }
        } else {
            return response()->json(['error' => 'user exists or name to long. max: 20 characters'], 400);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user =  User::find($id);
        if (empty($user)) {
            return response()->json(['id' => 'user ' . $id . ' does not exist'], 400);
        } else {
            return response()->json(['user' => $user], 200);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $inputs = $request->only(['name', 'password', 'email']);

        $validator = Validator::make($inputs, [
            'name' => 'size:20',
            'email' => 'unique:users',
        ]);

        $user = User::find($id);

        if(array_key_exists('password', $inputs)){
            $hash = Hash::make($inputs['password']);
            $inputs['password'] = $hash;
        }

        if(array_key_exists('email', $inputs)){
            $hash = md5($inputs['email']);
            $inputs['gravatar'] = $hash;
        }
        
        print_r($inputs);

        if (!$validator->fails() && !empty($inputs) && $user != null) {
            
            $user->update($inputs);
            return response()->json(['user' => User::find($id)], 200);
        }else{
            return response()->json(['message' => 'duplicate username or email or name to long. max: 20 characters'], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = User::find($id);
        if (!empty($user)) {
            $user->delete();
            return response()->json(['message' => 'user ' . $id . 'deleted'], 200);
        } else {
            return response()->json(['message' => 'user ' . $id . ' does not exist'], 400);
        }
    }
}

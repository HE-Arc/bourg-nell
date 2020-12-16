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
        return response()->json(['success' => true, 'users' => User::all()]);
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
            'name' => 'unique:users',
            'email' => 'unique:users',
        ]);

        if (!$validator->fails()) {
            if (sizeof($inputs) < 3) {
                return response()->json(['success' => false, 'error' => 'missing parameter'], 400);
            } else {
                $user = User::create([
                    'name' => $inputs['name'],
                    'email' => $inputs['email'],
                    'password' => Hash::make($inputs['password']),
                ]);
                return response()->json(['success' => true, 'user' => $user]);
            }
        } else {
            return response()->json(['success' => false, 'error' => 'user exists'], 400);
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
            return response()->json(['success' => false, 'id' => 'user ' . $id . ' does not exist'], 400);
        } else {
            return response()->json(['success' => true, 'user' => $user], 200);
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
            'name' => 'unique:users',
            'email' => 'unique:users',
        ]);

        $user = User::find($id);

        if(array_key_exists("password", $inputs)){
            $hash = Hash::make($inputs['password']);
            $inputs['password'] = $hash;
        }
        
    
        if (!$validator->fails()) {
            if (!empty($inputs) && $user != null) {
                $user->update($inputs);
                return response()->json(['success' => true, 'user' => User::find($id)], 200);
            }
        }else{
            return response()->json(['success' => false, 'message' => 'duplicate username or email'], 400);
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
            return response()->json(['success' => false, 'message' => 'user ' . $id . ' does not exist'], 400);
        } else {
            return response()->json(['success' => true, 'message' => 'user ' . $id . 'deleted'], 200);
        }
    }
}

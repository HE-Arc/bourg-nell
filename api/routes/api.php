<?php

use App\Http\Controllers\API\TestController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\GameController;
use App\Http\Controllers\LoginController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*
User admin route
*/
Route::middleware('auth')->apiResource('users-admin', UserController::class);

Route::middleware('auth')->apiResource('games', GameController::class);

//Error
Route::any('error', function () {
    return response()->json(["error" => "invalid token"], 400);
})->name('error');

/*
Route relative to the user
*/
//create a user 
Route::post('users/create', function (Request $request) {
    return LoginController::create($request);
});

//login a user (get token)
Route::post('users/login', function (Request $request) {
    $credentials = $request->only(["email", "password"]);
    return LoginController::login($credentials);
});

//get current user
Route::middleware('auth')->get('users/me', function () {
    $user = auth()->user();

    return $user;
});

//logout
Route::middleware('auth')->post('users/logout', function (Request $request) {
    return LoginController::logout($request);
});

/*
Route relative to the game
*/

/*
Route::post('/games/', function (Request $request) {
    return GameController::create($request);
});

Route::get('/games/by-user/{id}/', function ($id) {
    return GameController::getByUser($id);
});

Route::get('/games/{id}/', function ($id) {
    return GameController::index($id);
});

Route::patch('/games/{id}/', function (Request $request, $id) {
    return GameController::update($request, $id);
});

Route::delete('/games/{id}/', function ($id) {
    return GameController::delete($id);
});
*/
/*
Route relative to the friend invitation
*/

/*
Route::post('/invites', function(){
});

Route::get('/invites', function(){

});

Route::get('/invites/{id}', function(){

});

Route::delete('/invites/{id}', function($id){
    
});
*/
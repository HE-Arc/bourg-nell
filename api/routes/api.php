<?php

use App\Http\Controllers\GameController;
use App\Http\Controllers\UserController;
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
Route relative to the user
*/
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/users/{id}', function($id){
    return UserController::read($id);
});

Route::post('/users', function(Request $request) {
    UserController::create($request);
});

//TODO Bug
Route::patch('/users/{id}', function(Request $request, $id) {
    UserController::update($request, $id);
});

Route::delete('/users/{id}', function($id){
    return UserController::delete($id);
});

/*
Route relative to the game
*/
Route::post('/games', function(Request $request){
    GameController::create($request);
});

Route::get('/games/by-user/{id}', function(Request $request, $id){
    GameController::getByUser($id);
});

Route::get('/games/{id}', function($id){
    GameController::read($id);
});

Route::patch('/games/{id}', function($id){
    GameController::update($id);
});

Route::delete('/games/{id}', function($id){
    GameController::delete($id);
});

/*
Route relative to the friend invitation
*/
Route::post('/invites', function(){

});

Route::get('/invites', function(){

});

Route::get('/invites/{id}', function(){

});

Route::delete('/invites/{id}', function($id){
    
});
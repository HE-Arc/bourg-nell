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

Route::get('/users/{id}/', function($id){
    return UserController::index($id);
});

Route::post('/users/', function(Request $request) {
    return UserController::create($request);
});

//TODO Bug
//Methode patch ne prend que des arguments en parametre d'URL
//https://laravel.io/forum/02-13-2014-i-can-not-get-inputs-from-a-putpatch-request
Route::patch('/users/{id}/', function(Request $request, $id) {
    return UserController::update($request, $id);
});

Route::delete('/users/{id}/', function($id){
    return UserController::delete($id);
});

/*
Route relative to the game
*/
Route::post('/games/', function(Request $request){
    return GameController::create($request);
});

Route::get('/games/by-user/{id}/', function($id){
    return GameController::getByUser($id);
});

Route::get('/games/{id}/', function($id){
    return GameController::index($id);
});

Route::patch('/games/{id}/', function(Request $request, $id){
    return GameController::update($request, $id);
});

Route::delete('/games/{id}/', function($id){
    return GameController::delete($id);
});

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
<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\TodosController;
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

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) 
    
    {
        return $request->user();
    });

    Route::apiResource('/users', UserController::class);
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/todos',[App\Http\Controllers\TodosController::class, 'index']);
Route::post('/addtodos',[App\Http\Controllers\TodosController::class, 'store']);  
Route::put('/update/{id}',[App\Http\Controllers\TodosController::class, 'update']);
Route::delete('/delete/{id}',[App\Http\Controllers\TodosController::class, 'softDeletetodos']);
Route::get('/soft-deleted', [App\Http\Controllers\TodosController::class, 'showSoftDeletedtodos'])->name('todos.softDeleted');
Route::post('/restore/{id}', [App\Http\Controllers\TodosController::class, 'restoretodo'])->name('todos.restore');
Route::delete('/force-delete/{id}', [App\Http\Controllers\TodosController::class, 'forceDeletetodes'])->name('todos.forceDelete');

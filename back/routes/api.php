<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\NoteController;
use Illuminate\Support\Facades\Route;

// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Routes protégées par Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout',        [AuthController::class, 'logout']);

    Route::get('/notes',          [NoteController::class, 'index']);
    Route::post('/notes',         [NoteController::class, 'store']);
    Route::get('/notes/{id}',     [NoteController::class, 'show']);
    Route::put('/notes/{id}',     [NoteController::class, 'update']);
    Route::delete('/notes/{id}',  [NoteController::class, 'destroy']);
});

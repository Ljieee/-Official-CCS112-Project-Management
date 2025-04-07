<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Route::apiResource('posts', PostController::class);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    // Auth Routes
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Project Routes
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::put('/projects/{id}', [ProjectController::class, 'update']);
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);
    
    // Task Routes
    Route::get('/projects/{id}/tasks', [TaskController::class, 'index']);    
    Route::post('/projects/{id}/tasks', [TaskController::class, 'store']);  
    Route::put('/projects/{id}/tasks/{taskId}', [TaskController::class, 'update']);   
    Route::delete('/projects/{id}/tasks/{taskId}', [TaskController::class, 'destroy']);
    Route::apiResource('projects', ProjectController::class);

    // routes/api.php
Route::get('/projects/{projectId}/task-summary', [ProjectController::class, 'taskSummary']);

});
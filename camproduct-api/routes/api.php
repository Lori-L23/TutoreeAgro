<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\EntreprisesController;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\CommandeController;

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

// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/validate-email', [AuthController::class, 'validateEmail']);
Route::post('/resend-validation-email', [AuthController::class, 'resendEmailValidation']);

// Routes de contact (partie publique)
Route::prefix('contact')->group(function () {
    Route::post('/', [ContactController::class, 'store']);
});

// Routes protégées par Sanctum
Route::middleware(['auth:sanctum'])->group(function () {
    // Authentification
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/user-with-profile', [AuthController::class, 'getUserWithProfile']);
    
    // Gestion du profil entreprise
    Route::prefix('entreprise')->group(function () {
        Route::get('/profil', [EntreprisesController::class, 'getProfil']);
        Route::put('/profil', [EntreprisesController::class, 'updateProfil']);
        Route::get('/statistiques', [EntreprisesController::class, 'getStatistiques']);
        Route::get('/commandes', [EntreprisesController::class, 'getCommandes']);
        Route::post('/upload-logo',[EntreprisesController::class,'uploadLogo']);
    });
    // Produits
    Route::resource('produits', ProduitController::class);

    // Gestion des messages de contact (admin)
    Route::prefix('contact')->group(function () {
        Route::get('/', [ContactController::class, 'index']);
        Route::get('/{contactMessage}', [ContactController::class, 'show']);
        Route::patch('/{contactMessage}/status', [ContactController::class, 'updateStatus']);
    });
    
    // Commandes
    Route::prefix('commandes')->group(function () {
        Route::get('/', [CommandeController::class, 'index']);
        Route::put('/{commande}/statut', [CommandeController::class, 'updateStatut']);
        Route::delete('/{commande}', [CommandeController::class, 'destroy']);
        Route::get('/recentes', [CommandeController::class, 'recentes']);
    });
});
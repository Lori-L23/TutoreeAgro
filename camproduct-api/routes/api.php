<?php

use App\Http\Controllers\AdminController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientsController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\EntreprisesController;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\CommandeController;
use App\Http\Controllers\DashboardController;

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
        Route::post('/upload-logo', [EntreprisesController::class, 'uploadLogo']);
        Route::get('/', [EntreprisesController::class, 'show']);
        Route::get('/', [EntreprisesController::class, 'index']);
        Route::put('/{id}', [EntreprisesController::class, 'update']);
        Route::delete('/{id}', [EntreprisesController::class, 'destroy']);
        Route::get('/regions', [EntreprisesController::class, 'getregions']);
        Route::get('/categories', [EntreprisesController::class, 'getCategories']);
        Route::get('/certifications', [EntreprisesController::class, 'getCertifications']);
        Route::get('/villes', [EntreprisesController::class, 'getVilles']);
    });
    //Dashboard
    Route::get('/dashboard', [DashboardController::class, 'dashboard']);
    Route::get('/dashboard/commandes', [DashboardController::class, 'commandes']);
    Route::get('/dashboard/produits', [DashboardController::class, 'produits']);
    Route::get('/dashboard/entreprises', [DashboardController::class, 'entreprises']);
    Route::get('/dashboard/commandes/recentes', [DashboardController::class, 'commandesRecentes']);
    Route::get('/dashboard?periode={SelectedPeriode}', [DashboardController::class, 'dashboardWithPeriode']);
    // Produits
    Route::prefix('produits')->group(function () {
        Route::get('/', [ProduitController::class, 'index']);
        Route::post('/', [ProduitController::class, 'store']);
        Route::get('/{id}', [ProduitController::class, 'show']);
        Route::put('/{id}', [ProduitController::class, 'update']);
        Route::delete('/{produit}', [ProduitController::class, 'destroy']);
        Route::post('/{produit}', [ProduitController::class, 'toggleVisibility']);
    });
    Route::post('produits/bulk-update', [ProduitController::class, 'bulkUpdate']);

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
    //Clients
    Route::prefix('clients')->group(function () {
        Route::get('/', [ClientsController::class, 'index']);
        Route::post('/', [ClientsController::class, 'store']);
        Route::post('/', [ClientsController::class, 'show']);
        // Route::get('/{id}', [ClientsController::class, 'getClientById']);
        Route::put('/{id}', [ClientsController::class, 'update']);
        Route::delete('/{id}', [ClientsController::class, 'destroy']);
        Route::get('/profile', [ClientsController::class, 'getProfil']);
        Route::put('/profile', [ClientsController::class, 'updateProfil']);
        Route::get('/orders', [ClientsController::class, 'getorders']);
        Route::get('/favorites', [ClientsController::class, 'getfavorites']);
        Route::get('/addresses', [ClientsController::class, 'getaddresses']);
        Route::post('/addresses', [ClientsController::class, 'changepassword']);
    });
    //admin
    Route::prefix('admin')->group(function () {
        Route::get('/users', [AdminController::class, 'index']);
        Route::post('/users', [AdminController::class, 'store']);
        Route::put('/users/{user}', [AdminController::class, 'update']);
        Route::delete('/users/{user}', [AdminController::class, 'destroy']);
        Route::put('/{id}', [AdminController::class, 'update']);
        Route::get('/profile', [AdminController::class, 'getProfile']);
        Route::get('/stats', [AdminController::class, 'getStats']);
        Route::get('/recent-activities', [AdminController::class, 'getRecentActivities']);
        Route::get('/latest-companies', [AdminController::class, 'getLatestCompanies']);
        Route::put('/companies/{company}/status', [AdminController::class, 'updateCompanyStatus']);
        Route::get('/company-statuses', [AdminController::class, 'getStatus']);
    });
});

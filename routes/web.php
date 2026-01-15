<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\WalletTransferController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\FixedAssetController;
use App\Http\Controllers\ReportController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    // Wallet Transfer (letakkan sebelum resource biar jelas, walau except show sudah aman)
    Route::get('/wallets/transfer', [WalletTransferController::class, 'create'])
        ->name('wallets.transfer.create');
    Route::post('/wallets/transfer', [WalletTransferController::class, 'store'])
        ->name('wallets.transfer.store');

    // Wallets CRUD
    Route::resource('wallets', WalletController::class)->except(['show']);

    // Categories (dipakai transaksi/budget)
    Route::resource('categories', CategoryController::class)->except(['show']);

    // Transactions CRUD + search/filter via query params
    Route::resource('transactions', TransactionController::class)->except(['show']);

    // Budgets CRUD
    Route::resource('budgets', BudgetController::class)->except(['show']);

    // Goals CRUD
    Route::resource('goals', GoalController::class)->except(['show']);

    // Assets CRUD
    Route::resource('assets', FixedAssetController::class)->except(['show']);

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports');
});

require __DIR__ . '/settings.php';

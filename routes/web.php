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
use App\Http\Controllers\DebtController;
use App\Http\Controllers\RecurringTemplateController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard (Pastikan class DashboardController memiliki __invoke)
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    // Wallets
    Route::post('/wallets/transfer', [WalletTransferController::class, 'store'])->name('wallets.transfer.store');
    Route::resource('wallets', WalletController::class)->except(['show', 'create', 'edit']);

    // Transactions
    Route::resource('transactions', TransactionController::class)->except(['show', 'create', 'edit']);

    // Categories
    Route::resource('categories', CategoryController::class)->except(['show', 'create', 'edit']);

    // Budgets
    Route::resource('budgets', BudgetController::class)->except(['show', 'create', 'edit']);

    // Goals
    Route::resource('goals', GoalController::class)->except(['show', 'create', 'edit']);

    // Assets
    Route::resource('assets', FixedAssetController::class)->except(['show', 'create', 'edit']);

    // Debts (Hutang & Piutang)
    Route::post('/debts/{id}/pay', [DebtController::class, 'pay'])->name('debts.pay');
    Route::resource('debts', DebtController::class)->except(['show', 'create', 'edit']);

    // Recurring (Tagihan Rutin)
    Route::resource('recurring', RecurringTemplateController::class)->except(['show', 'create', 'edit']);

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports');
});

require __DIR__ . '/settings.php';

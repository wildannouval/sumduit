<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Transaction;
use App\Models\Wallet;
use App\Models\FixedAsset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $userId = Auth::id();
        $today = now()->format('Y-m-d');
        $thisMonth = now()->format('Y-m');
        $startOfMonth = now()->startOfMonth();

        // 1. Perhitungan Net Worth (Kekayaan Bersih)
        $totalWalletBalance = (float) Wallet::where('user_id', $userId)->sum('balance');
        $totalAssetValue = (float) FixedAsset::where('user_id', $userId)->sum('value');
        $netWorth = $totalWalletBalance + $totalAssetValue;

        // 2. Perhitungan Pertumbuhan (vs Awal Bulan)
        $incomeThisMonth = (float) Transaction::where('user_id', $userId)->where('type', 'income')->where('occurred_at', '>=', $startOfMonth)->sum('amount');
        $expenseThisMonth = (float) Transaction::where('user_id', $userId)->where('type', 'expense')->where('occurred_at', '>=', $startOfMonth)->sum('amount');
        $netFlowThisMonth = $incomeThisMonth - $expenseThisMonth;
        $newAssetsThisMonth = (float) FixedAsset::where('user_id', $userId)->where('created_at', '>=', $startOfMonth)->sum('value');

        $prevNetWorth = $netWorth - ($netFlowThisMonth + $newAssetsThisMonth);
        $growthPct = $prevNetWorth > 0 ? (($netWorth - $prevNetWorth) / $prevNetWorth) * 100 : 0;

        // 3. Arus Kas Hari Ini
        $incomeToday = (float) Transaction::where('user_id', $userId)->where('type', 'income')->whereDate('occurred_at', $today)->sum('amount');
        $expenseToday = (float) Transaction::where('user_id', $userId)->where('type', 'expense')->whereDate('occurred_at', $today)->sum('amount');

        // 4. Info Bulanan & Runway
        $totalIncomeMonth = (float) Transaction::where('user_id', $userId)->where('type', 'income')->whereRaw("DATE_FORMAT(occurred_at, '%Y-%m') = ?", [$thisMonth])->sum('amount');
        $totalExpenseMonth = (float) Transaction::where('user_id', $userId)->where('type', 'expense')->whereRaw("DATE_FORMAT(occurred_at, '%Y-%m') = ?", [$thisMonth])->sum('amount');

        $emergencyBalance = (float) Wallet::where('user_id', $userId)->where('type', 'emergency')->sum('balance');
        $avgExpense3m = (float) Transaction::where('user_id', $userId)->where('type', 'expense')
            ->whereBetween('occurred_at', [now()->subMonths(3), now()])->sum('amount') / 3;
        $runway = $avgExpense3m > 0 ? ($emergencyBalance / $avgExpense3m) : 0;

        // 5. Top Spending
        $topSpending = Transaction::query()
            ->where('user_id', $userId)
            ->where('type', 'expense')
            ->whereRaw("DATE_FORMAT(occurred_at, '%Y-%m') = ?", [$thisMonth])
            ->select('category_id', DB::raw('SUM(amount) as total'))
            ->groupBy('category_id')
            ->orderByDesc('total')
            ->with('category')
            ->take(5)
            ->get()
            ->map(fn($item) => [
                'name' => $item->category->name ?? 'Lainnya',
                'amount' => (float) $item->total
            ]);

        // 6. Transaksi Terbaru
        $recentTransactions = Transaction::where('user_id', $userId)
            ->with(['category', 'wallet'])
            ->latest('occurred_at')
            ->take(6) // Naikkan sedikit itemnya agar padat
            ->get();

        return Inertia::render('dashboard', [
            'netWorth' => [
                'total' => $netWorth,
                'liquid' => $totalWalletBalance,
                'fixed' => $totalAssetValue,
                'growth_pct' => round($growthPct, 1),
            ],
            'statsToday' => [
                'income' => $incomeToday,
                'spent' => $expenseToday,
            ],
            'totals' => [
                'income' => $totalIncomeMonth,
                'expense' => $totalExpenseMonth,
                'net' => $totalIncomeMonth - $totalExpenseMonth,
            ],
            'runway' => round($runway, 1),
            'topSpending' => $topSpending,
            'recentTransactions' => $recentTransactions
        ]);
    }
}

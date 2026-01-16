<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Transaction;
use App\Models\Wallet;
use App\Models\Category;
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

        // 1. Info Hari Ini
        $incomeToday = (float) Transaction::where('user_id', $userId)->where('type', 'income')->whereDate('occurred_at', $today)->sum('amount');
        $expenseToday = (float) Transaction::where('user_id', $userId)->where('type', 'expense')->whereDate('occurred_at', $today)->sum('amount');

        // Estimasi budget harian (Total budget bulan ini / jumlah hari bulan ini)
        $totalBudgetMonth = (float) Budget::where('user_id', $userId)->where('month', $thisMonth)->sum('amount');
        $budgetToday = $totalBudgetMonth > 0 ? $totalBudgetMonth / now()->daysInMonth : 0;

        // 2 & 3. Card Total Bulanan
        $totalIncomeMonth = (float) Transaction::where('user_id', $userId)->where('type', 'income')->whereRaw("DATE_FORMAT(occurred_at, '%Y-%m') = ?", [$thisMonth])->sum('amount');
        $totalExpenseMonth = (float) Transaction::where('user_id', $userId)->where('type', 'expense')->whereRaw("DATE_FORMAT(occurred_at, '%Y-%m') = ?", [$thisMonth])->sum('amount');

        // 4. Runway Dana Darurat
        $emergencyBalance = (float) Wallet::where('user_id', $userId)->where('type', 'emergency')->sum('balance');
        $avgExpense3m = (float) Transaction::where('user_id', $userId)->where('type', 'expense')
            ->whereBetween('occurred_at', [now()->subMonths(3), now()])->sum('amount') / 3;
        $runway = $avgExpense3m > 0 ? ($emergencyBalance / $avgExpense3m) : 0;

        // 5. Pengeluaran Terbesar (Top 5 Kategori)
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

        // 7. Tagihan Mendatang (Hanya simulasi: ambil goal atau budget yang sisa saldonya besar)
        $upcomingBills = Budget::where('user_id', $userId)
            ->where('month', $thisMonth)
            ->with('category')
            ->get()
            ->map(fn($b) => [
                'name' => $b->category->name ?? 'Budget',
                'amount' => (float) $b->amount,
                'group' => $b->group
            ])->take(3);

        // 8. Transaksi Terbaru
        $recentTransactions = Transaction::where('user_id', $userId)
            ->with(['category', 'wallet'])
            ->latest('occurred_at')
            ->take(5)
            ->get();

        return Inertia::render('dashboard', [
            'statsToday' => [
                'budget' => $budgetToday,
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
            'budgetRealization' => [
                'budgeted' => $totalBudgetMonth,
                'spent' => $totalExpenseMonth,
                'pct' => $totalBudgetMonth > 0 ? round(($totalExpenseMonth / $totalBudgetMonth) * 100) : 0
            ],
            'upcomingBills' => $upcomingBills,
            'recentTransactions' => $recentTransactions
        ]);
        $insights = [];

        // Cek jika pengeluaran > 90% dari total budget
        if ($totalBudgetMonth > 0 && ($totalExpenseMonth / $totalBudgetMonth) > 0.9) {
            $insights[] = [
                'title' => 'Budget Kritis!',
                'body' => 'Pengeluaran Anda sudah mencapai 90% dari budget bulan ini.',
                'level' => 'bad'
            ];
        }

        // Cek saldo dompet cash rendah
        $lowCash = Wallet::where('user_id', $userId)->where('type', 'cash')->where('balance', '<', 50000)->first();
        if ($lowCash) {
            $insights[] = [
                'title' => 'Saldo Cash Tipis',
                'body' => 'Uang tunai di dompet ' . $lowCash->name . ' tersisa kurang dari 50rb.',
                'level' => 'warn'
            ];
        }
    }
}

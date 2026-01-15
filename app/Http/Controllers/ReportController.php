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

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $userId = Auth::id();
        // Menangani input bulan dan tahun
        $monthQuery = $request->query('month', now()->format('m'));
        $yearQuery = $request->query('year', now()->format('Y'));

        // Memastikan format YYYY-MM untuk query database
        $monthFull = $yearQuery . '-' . str_pad($monthQuery, 2, '0', STR_PAD_LEFT);

        // 1. Hitung Income & Expense
        $income = (float) Transaction::where('user_id', $userId)
            ->where('type', 'income')
            ->whereRaw("DATE_FORMAT(occurred_at, '%Y-%m') = ?", [$monthFull])
            ->sum('amount');

        $expense = (float) Transaction::where('user_id', $userId)
            ->where('type', 'expense')
            ->whereRaw("DATE_FORMAT(occurred_at, '%Y-%m') = ?", [$monthFull])
            ->sum('amount');

        // 2. Hitung Top Categories
        $topCategories = Transaction::query()
            ->where('user_id', $userId)
            ->where('type', 'expense')
            ->whereRaw("DATE_FORMAT(occurred_at, '%Y-%m') = ?", [$monthFull])
            ->select('category_id', DB::raw('SUM(amount) as total'))
            ->groupBy('category_id')
            ->orderByDesc('total')
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => Category::find($item->category_id)->name ?? 'Lainnya',
                    'amount' => (float) $item->total
                ];
            });

        // 3. Health Score & Runway
        $emergencyBalance = (float) Wallet::where('user_id', $userId)
            ->where('type', 'emergency')
            ->sum('balance');

        $avgExpense = (float) Transaction::where('user_id', $userId)
            ->where('type', 'expense')
            ->whereBetween('occurred_at', [now()->subMonths(3), now()])
            ->sum('amount') / 3;

        $runwayMonths = $avgExpense > 0 ? ($emergencyBalance / $avgExpense) : 0;
        $savingsRate = $income > 0 ? ($income - $expense) / $income : 0;

        // 4. Struktur Insights (Harus berupa Object untuk React)
        $insights = [];
        if ($income < $expense) {
            $insights[] = ['title' => 'Defisit', 'body' => 'Pengeluaran melebihi pemasukan bulan ini.', 'level' => 'bad'];
        }
        if ($runwayMonths < 3) {
            $insights[] = ['title' => 'Dana Darurat', 'body' => 'Simpanan Anda cukup untuk < 3 bulan.', 'level' => 'warn'];
        }
        if (empty($insights)) {
            $insights[] = ['title' => 'Kondisi Baik', 'body' => 'Keuangan Anda bulan ini terlihat sehat.', 'level' => 'good'];
        }

        return Inertia::render('reports/index', [
            'period' => [
                'month' => (int) $monthQuery,
                'year' => (int) $yearQuery
            ],
            'summary' => [
                'income' => $income,
                'expense' => $expense,
                'net' => $income - $expense,
                'savings_rate' => $savingsRate,
                'cash_balance' => (float) Wallet::where('user_id', $userId)->sum('balance'),
                'runway_months' => (float) $runwayMonths,
            ],
            'health' => [
                'total_score' => (int) max(0, min(100, $savingsRate * 100))
            ],
            'insights' => $insights,
            'topCategories' => $topCategories,
            'budgetPerformance' => [] // Bisa Anda isi dengan query Budget jika perlu
        ]);
    }
}

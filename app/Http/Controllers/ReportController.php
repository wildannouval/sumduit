<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Wallet;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Number; // Tambahkan ini

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $userId = Auth::id();

        // Input bulan dan tahun
        $monthQuery = $request->query('month', now()->format('m'));
        $yearQuery = $request->query('year', now()->format('Y'));
        $monthFull = $yearQuery . '-' . str_pad($monthQuery, 2, '0', STR_PAD_LEFT);

        // 1. Kalkulasi Utama
        $income = (float) Transaction::where('user_id', $userId)
            ->where('type', 'income')
            ->whereRaw("DATE_FORMAT(occurred_at, '%Y-%m') = ?", [$monthFull])
            ->sum('amount');

        $expense = (float) Transaction::where('user_id', $userId)
            ->where('type', 'expense')
            ->whereRaw("DATE_FORMAT(occurred_at, '%Y-%m') = ?", [$monthFull])
            ->sum('amount');

        // 2. Data Grafik Harian (Daily Cashflow)
        $dailyData = Transaction::query()
            ->where('user_id', $userId)
            ->whereRaw("DATE_FORMAT(occurred_at, '%Y-%m') = ?", [$monthFull])
            ->select(
                DB::raw('DAY(occurred_at) as day'),
                DB::raw("SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income"),
                DB::raw("SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense")
            )
            ->groupBy('day')
            ->orderBy('day')
            ->get();

        // 3. Kategori Terboros (Top 5)
        $topCategories = Transaction::query()
            ->where('user_id', $userId)
            ->where('type', 'expense')
            ->whereRaw("DATE_FORMAT(occurred_at, '%Y-%m') = ?", [$monthFull])
            ->select('category_id', DB::raw('SUM(amount) as total'))
            ->groupBy('category_id')
            ->orderByDesc('total')
            ->take(5)
            ->get()
            ->map(fn($item) => [
                'name' => Category::find($item->category_id)->name ?? 'Lainnya',
                'amount' => (float) $item->total
            ]);

        // 4. Skor Kesehatan & Keamanan (Runway)
        $emergencyBalance = (float) Wallet::where('user_id', $userId)->where('type', 'emergency')->sum('balance');
        $avgExpense = (float) Transaction::where('user_id', $userId)
            ->where('type', 'expense')
            ->whereBetween('occurred_at', [now()->subMonths(3), now()])
            ->sum('amount') / 3;

        $runwayMonths = $avgExpense > 0 ? ($emergencyBalance / $avgExpense) : 0;
        $savingsRate = $income > 0 ? ($income - $expense) / $income : 0;

        // 5. Wawasan Otomatis (Insights)
        $insights = [];
        if ($income < $expense) {
            // Gunakan Number::currency sebagai pengganti formatIDR di PHP
            $deficit = Number::currency($expense - $income, 'IDR', 'id');
            $insights[] = ['title' => 'Defisit Arus Kas', 'body' => "Pengeluaran Anda $deficit lebih tinggi dari pemasukan.", 'level' => 'bad'];
        }

        if ($runwayMonths < 3) {
            $insights[] = ['title' => 'Dana Darurat Tipis', 'body' => 'Simpanan Anda hanya cukup untuk < 3 bulan ke depan.', 'level' => 'warn'];
        }

        if ($savingsRate > 0.2) {
            $insights[] = ['title' => 'Penabung Hebat', 'body' => 'Anda berhasil menyisihkan lebih dari 20% pemasukan.', 'level' => 'good'];
        }

        if (empty($insights)) {
            $insights[] = ['title' => 'Kondisi Stabil', 'body' => 'Arus kas Anda terpantau aman dan terkendali.', 'level' => 'good'];
        }

        return Inertia::render('reports/index', [
            'period' => ['month' => (int) $monthQuery, 'year' => (int) $yearQuery],
            'summary' => [
                'income' => $income,
                'expense' => $expense,
                'net' => $income - $expense,
                'runway_months' => (float) $runwayMonths,
                'savings_rate' => round($savingsRate * 100),
            ],
            'dailyData' => $dailyData,
            'topCategories' => $topCategories,
            'insights' => $insights,
            'transactions' => Transaction::where('user_id', $userId)
                ->whereRaw("DATE_FORMAT(occurred_at, '%Y-%m') = ?", [$monthFull])
                ->with(['category', 'wallet'])
                ->orderByDesc('occurred_at')->get(),
        ]);
    }
}

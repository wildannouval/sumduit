<?php

namespace App\Http\Controllers;

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

        // 2. Kategori Terboros (Top 5)
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

        // 3. Skor Kesehatan & Keamanan (Runway)
        $emergencyBalance = (float) Wallet::where('user_id', $userId)->where('type', 'emergency')->sum('balance');

        // Rata-rata pengeluaran 3 bulan terakhir untuk runway yang akurat
        $avgExpense = (float) Transaction::where('user_id', $userId)
            ->where('type', 'expense')
            ->whereBetween('occurred_at', [now()->subMonths(3), now()])
            ->sum('amount') / 3;

        $runwayMonths = $avgExpense > 0 ? ($emergencyBalance / $avgExpense) : 0;
        $savingsRate = $income > 0 ? ($income - $expense) / $income : 0;

        // 4. Wawasan Otomatis (Insights)
        $insights = [];
        if ($income < $expense) {
            $insights[] = ['title' => 'Defisit Arus Kas', 'body' => 'Pengeluaran Anda lebih besar dari pemasukan bulan ini.', 'level' => 'bad'];
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

        // 5. Daftar Transaksi untuk Tabel
        $transactions = Transaction::where('user_id', $userId)
            ->whereRaw("DATE_FORMAT(occurred_at, '%Y-%m') = ?", [$monthFull])
            ->with(['category', 'wallet'])
            ->orderByDesc('occurred_at')
            ->get();

        return Inertia::render('reports/index', [
            'period' => ['month' => (int) $monthQuery, 'year' => (int) $yearQuery],
            'summary' => [
                'income' => $income,
                'expense' => $expense,
                'net' => $income - $expense,
                'runway_months' => (float) $runwayMonths,
            ],
            'health' => ['total_score' => (int) max(0, min(100, $savingsRate * 100))],
            'insights' => $insights,
            'topCategories' => $topCategories,
            'transactions' => $transactions,
        ]);
    }
}

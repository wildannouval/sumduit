<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BudgetController extends Controller
{
    public function index(Request $request)
    {
        $month = (string) $request->query('month', now()->format('Y-m'));
        $search = $request->query('search', '');

        // Ambil data budget dengan filter pencarian jika ada
        $budgetsQuery = Budget::query()
            ->where('user_id', Auth::id())
            ->where('month', $month);

        if ($search) {
            $budgetsQuery->whereHas('category', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $budgets = $budgetsQuery->orderBy('group')
            ->orderByDesc('amount')
            ->get();

        // Hitung total pengeluaran bulan tersebut
        $totalSpent = Transaction::query()
            ->where('user_id', Auth::id())
            ->where('type', 'expense')
            ->whereRaw("DATE_FORMAT(occurred_at, '%Y-%m') = ?", [$month])
            ->sum('amount') ?? 0;

        $totalBudget = $budgets->sum('amount');

        $categories = Category::query()
            ->where('user_id', Auth::id())
            ->where('type', 'expense')
            ->orderBy('group')->orderBy('name')
            ->get(['id', 'name', 'group', 'type']);

        return Inertia::render('budgets/index', [
            'budgets' => [
                'data' => $budgets,
                // Tambahkan link kosong jika tidak pakai pagination asli Laravel
                'links' => []
            ],
            'summary' => [
                'month' => $month,
                'total_budget' => (float) $totalBudget,
                'total_spent' => (float) $totalSpent,
                'total_remaining' => (float) ($totalBudget - $totalSpent),
                'utilization_pct' => $totalBudget > 0 ? ($totalSpent / $totalBudget) * 100 : 0,
            ],
            'categories' => $categories,
            // BAGIAN INI WAJIB ADA UNTUK MEMPERBAIKI ERROR 'search'
            'filters' => [
                'search' => $search,
                'month' => $month,
            ],
            'wallets' => [] // Tambahkan jika memang ada data wallet yang dikirim
        ]);
    }

    // Method store, edit, update, destroy tetap sama seperti kode Anda sebelumnya...
    public function create()
    {
        $categories = Category::query()
            ->where('user_id', Auth::id())
            ->where('type', 'expense')
            ->orderBy('group')->orderBy('name')
            ->get(['id', 'name', 'group']);

        return Inertia::render('budgets/create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'month' => ['required', 'regex:/^\d{4}-\d{2}$/'],
            'group' => ['required', 'in:needs,wants,saving'],
            'category_id' => ['nullable', 'integer'],
            'amount' => ['required', 'numeric', 'min:0'],
        ]);

        Budget::create([
            'user_id' => Auth::id(),
            ...$data,
        ]);

        return redirect('/budgets?month=' . $data['month']);
    }

    public function edit(string $id)
    {
        $b = Budget::where('user_id', Auth::id())->findOrFail($id);
        $categories = Category::where('user_id', Auth::id())->where('type', 'expense')->get();

        return Inertia::render('budgets/edit', [
            'budget' => $b,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $b = Budget::where('user_id', Auth::id())->findOrFail($id);
        $data = $request->validate([
            'month' => ['required', 'regex:/^\d{4}-\d{2}$/'],
            'group' => ['required', 'in:needs,wants,saving'],
            'category_id' => ['nullable', 'integer'],
            'amount' => ['required', 'numeric', 'min:0'],
        ]);

        $b->update($data);
        return redirect('/budgets?month=' . $data['month']);
    }

    public function destroy(string $id)
    {
        $b = Budget::where('user_id', Auth::id())->findOrFail($id);
        $month = $b->month;
        $b->delete();
        return redirect('/budgets?month=' . $month);
    }
}

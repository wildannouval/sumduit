<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class BudgetController extends Controller
{
    public function index(Request $request)
    {
        $userId = Auth::id();
        $month = (string) $request->query('month', now()->format('Y-m'));
        $search = $request->query('search', '');

        $budgetsQuery = Budget::query()
            ->where('user_id', $userId)
            ->where('month', $month)
            ->with('category:id,name,group');

        if ($search) {
            $budgetsQuery->whereHas('category', fn($q) => $q->where('name', 'like', "%{$search}%"));
        }

        $budgets = $budgetsQuery->get()->map(function ($budget) use ($userId, $month) {
            $spent = Transaction::where('user_id', $userId)
                ->where('category_id', $budget->category_id)
                ->whereRaw("DATE_FORMAT(occurred_at, '%Y-%m') = ?", [$month])
                ->where('type', 'expense')
                ->sum('amount');

            $budget->spent = (float) $spent;
            $budget->remaining = (float) ($budget->amount - $spent);
            return $budget;
        });

        $totalBudget = $budgets->sum('amount');
        $totalSpent = $budgets->sum('spent');

        return Inertia::render('budgets/index', [
            'budgets' => $budgets,
            'categories' => Category::where('user_id', $userId)->where('type', 'expense')->get(),
            'summary' => [
                'month' => $month,
                'total_budget' => (float) $totalBudget,
                'total_spent' => (float) $totalSpent,
                'total_remaining' => (float) ($totalBudget - $totalSpent),
                'utilization_pct' => $totalBudget > 0 ? ($totalSpent / $totalBudget) * 100 : 0,
            ],
            'filters' => [
                'search' => $search,
                'month' => $month,
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'month' => ['required', 'regex:/^\d{4}-\d{2}$/'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string', 'max:255'],
        ]);

        $category = Category::findOrFail($data['category_id']);

        Budget::create([
            'user_id' => Auth::id(),
            'group' => $category->group,
            ...$data,
        ]);

        return back()->with('success', 'Anggaran berhasil dibuat!');
    }

    public function update(Request $request, Budget $budget)
    {
        $data = $request->validate([
            'month' => ['required', 'regex:/^\d{4}-\d{2}$/'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string', 'max:255'],
        ]);

        $category = Category::findOrFail($data['category_id']);
        $data['group'] = $category->group;

        $budget->update($data);

        return back()->with('success', 'Anggaran berhasil diperbarui!');
    }

    public function destroy(Budget $budget)
    {
        $budget->delete();
        return back()->with('success', 'Anggaran berhasil dihapus!');
    }
}

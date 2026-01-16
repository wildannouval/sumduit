<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GoalController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $goals = Goal::query()
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($goal) {
                $goal->progress_pct = $goal->target_amount > 0
                    ? round(($goal->current_amount / $goal->target_amount) * 100)
                    : 0;
                $goal->remaining = max(0, $goal->target_amount - $goal->current_amount);
                return $goal;
            });

        return Inertia::render('goals/index', [
            'goals' => $goals,
            'wallets' => Wallet::where('user_id', $userId)->get(['id', 'name']),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'target_amount' => ['required', 'numeric', 'min:0'],
            'current_amount' => ['required', 'numeric', 'min:0'],
            'due_date' => ['nullable', 'date'],
            'note' => ['nullable', 'string', 'max:200'],
        ]);

        Goal::create([
            'user_id' => Auth::id(),
            ...$data,
        ]);

        return redirect('/goals')->with('success', 'Target tabungan berhasil dibuat!');
    }

    public function update(Request $request, Goal $goal)
    {
        if ($goal->user_id !== Auth::id()) abort(403);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'target_amount' => ['required', 'numeric', 'min:0'],
            'current_amount' => ['required', 'numeric', 'min:0'],
            'due_date' => ['nullable', 'date'],
            'note' => ['nullable', 'string', 'max:200'],
        ]);

        $goal->update($data);

        return redirect('/goals')->with('success', 'Target tabungan diperbarui!');
    }

    public function destroy(Goal $goal)
    {
        if ($goal->user_id !== Auth::id()) abort(403);
        $goal->delete();

        return redirect('/goals')->with('success', 'Target tabungan telah dihapus.');
    }
}

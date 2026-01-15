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
        $goals = Goal::query()
            ->where('user_id', Auth::id())
            ->orderByDesc('created_at')
            ->get(['id', 'name', 'target_amount', 'current_amount', 'due_date', 'note']);

        return Inertia::render('goals/index', [
            'goals' => [
                'data' => $goals // Memastikan struktur .data tersedia untuk React
            ],
        ]);
    }

    public function create()
    {
        $wallets = Wallet::where('user_id', Auth::id())->get(['id', 'name']);
        return Inertia::render('goals/create', [
            'wallets' => $wallets // Kirim wallets agar select option tidak error
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'target_amount' => ['required', 'numeric', 'min:0'],
            'current_amount' => ['required', 'numeric', 'min:0'],
            'due_date' => ['nullable', 'date'],
            'wallet_id' => ['nullable', 'integer'],
            'status' => ['required', 'in:active,paused,done'],
            'note' => ['nullable', 'string', 'max:200'],
        ]);

        Goal::create([
            'user_id' => Auth::id(),
            ...$data,
        ]);

        return redirect('/goals');
    }

    public function edit(string $id)
    {
        $g = Goal::where('user_id', Auth::id())->findOrFail($id);
        $wallets = Wallet::where('user_id', Auth::id())->get(['id', 'name']);

        return Inertia::render('goals/edit', [
            'goal' => $g,
            'wallets' => $wallets
        ]);
    }

    public function update(Request $request, string $id)
    {
        $g = Goal::where('user_id', Auth::id())->findOrFail($id);
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'target_amount' => ['required', 'numeric', 'min:0'],
            'current_amount' => ['required', 'numeric', 'min:0'],
            'due_date' => ['nullable', 'date'],
            'wallet_id' => ['nullable', 'integer'],
            'status' => ['required', 'in:active,paused,done'],
            'note' => ['nullable', 'string', 'max:200'],
        ]);

        $g->update($data);
        return redirect('/goals');
    }

    public function destroy(string $id)
    {
        Goal::where('user_id', Auth::id())->findOrFail($id)->delete();
        return redirect('/goals');
    }
}

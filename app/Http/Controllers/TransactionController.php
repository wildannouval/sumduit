<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\Wallet;
use App\Models\Goal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $userId = Auth::id();
        $q = Transaction::query()
            ->where('user_id', $userId)
            ->with(['wallet:id,name', 'category:id,name', 'goal:id,name'])
            ->orderByDesc('occurred_at')
            ->orderByDesc('id');

        return Inertia::render('transactions/index', [
            'transactions' => $q->paginate(10)->withQueryString(),
            'wallets'      => Wallet::where('user_id', $userId)->get(['id', 'name']),
            'categories'   => Category::where('user_id', $userId)->get(['id', 'name', 'type']),
            'goals'        => Goal::where('user_id', $userId)->get(['id', 'name']),
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'wallet_id'   => 'required|exists:wallets,id',
            'category_id' => 'nullable|exists:categories,id',
            'goal_id'     => 'nullable|exists:goals,id',
            'type'        => 'required|in:income,expense',
            'amount'      => 'required|numeric|min:1',
            'occurred_at' => 'required|date',
            'note'        => 'nullable|string|max:200',
        ]);

        Transaction::create(['user_id' => Auth::id(), ...$data]);

        return redirect('/transactions')->with('success', 'Transaksi berhasil disimpan!');
    }

    public function update(Request $request, Transaction $transaction)
    {
        $data = $request->validate([
            'wallet_id'   => 'required|exists:wallets,id',
            'category_id' => 'nullable|exists:categories,id',
            'goal_id'     => 'nullable|exists:goals,id',
            'type'        => 'required|in:income,expense',
            'amount'      => 'required|numeric|min:1',
            'occurred_at' => 'required|date',
            'note'        => 'nullable|string|max:200',
        ]);

        $transaction->update($data);

        return redirect('/transactions')->with('success', 'Transaksi diperbarui!');
    }

    public function destroy(Transaction $transaction)
    {
        $transaction->delete();
        return redirect('/transactions')->with('success', 'Transaksi dihapus!');
    }
}

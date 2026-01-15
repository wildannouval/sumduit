<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $search = (string) $request->query('search', '');
        $type = (string) $request->query('type', 'all'); // all|income|expense
        $walletId = (string) $request->query('wallet_id', 'all');
        $from = (string) $request->query('from', '');
        $to = (string) $request->query('to', '');

        $q = Transaction::query()
            ->where('user_id', Auth::id())
            ->with([
                'wallet:id,name',
                'category:id,name',
            ])
            ->orderByDesc('occurred_at')
            ->orderByDesc('id');

        if ($search !== '') {
            $q->where(function ($sub) use ($search) {
                $sub->where('note', 'like', "%{$search}%");
            });
        }

        if (in_array($type, ['income', 'expense'], true)) {
            $q->where('type', $type);
        }

        if ($walletId !== 'all' && ctype_digit($walletId)) {
            $q->where('wallet_id', (int) $walletId);
        }

        if ($from !== '') {
            $q->whereDate('occurred_at', '>=', $from);
        }
        if ($to !== '') {
            $q->whereDate('occurred_at', '<=', $to);
        }

        $transactions = $q->paginate(10)->withQueryString();

        $wallets = Wallet::query()
            ->where('user_id', Auth::id())
            ->orderBy('name')
            ->get(['id', 'name']);

        $categories = Category::query()
            ->where('user_id', Auth::id())
            ->orderBy('type')->orderBy('group')->orderBy('name')
            ->get(['id', 'name', 'type', 'group']);

        return Inertia::render('transactions/index', [
            'transactions' => $transactions,
            'filters' => [
                'search' => $search,
                'type' => $type,
                'wallet_id' => $walletId,
                'from' => $from,
                'to' => $to,
            ],
            'wallets' => $wallets,
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        $wallets = Wallet::query()
            ->where('user_id', Auth::id())
            ->orderBy('name')
            ->get(['id', 'name', 'balance']);

        $categories = Category::query()
            ->where('user_id', Auth::id())
            ->orderBy('type')->orderBy('group')->orderBy('name')
            ->get(['id', 'name', 'type', 'group']);

        return Inertia::render('transactions/create', [
            'wallets' => $wallets,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'wallet_id' => ['required', 'integer'],
            'category_id' => ['nullable', 'integer'],
            'type' => ['required', 'in:income,expense'],
            'amount' => ['required', 'numeric', 'min:1'],
            'occurred_at' => ['required', 'date'],
            'note' => ['nullable', 'string', 'max:200'],
        ]);

        $userId = Auth::id();

        // update saldo wallet
        $wallet = Wallet::query()->where('user_id', $userId)->findOrFail($data['wallet_id']);
        $amount = (float) $data['amount'];

        if ($data['type'] === 'expense' && (float) $wallet->balance < $amount) {
            abort(422, 'Saldo wallet tidak cukup untuk pengeluaran.');
        }

        $wallet->balance = $data['type'] === 'income'
            ? (float) $wallet->balance + $amount
            : (float) $wallet->balance - $amount;
        $wallet->save();

        Transaction::create([
            'user_id' => $userId,
            ...$data,
        ]);

        return redirect()->route('transactions.index');
    }

    public function edit(string $transaction)
    {
        $t = Transaction::query()
            ->where('user_id', Auth::id())
            ->findOrFail($transaction);

        $wallets = Wallet::query()
            ->where('user_id', Auth::id())
            ->orderBy('name')
            ->get(['id', 'name', 'balance']);

        $categories = Category::query()
            ->where('user_id', Auth::id())
            ->orderBy('type')->orderBy('group')->orderBy('name')
            ->get(['id', 'name', 'type', 'group']);

        return Inertia::render('transactions/edit', [
            'transaction' => $t->only(['id', 'wallet_id', 'category_id', 'type', 'amount', 'occurred_at', 'note']),
            'wallets' => $wallets,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, string $transaction)
    {
        $t = Transaction::query()
            ->where('user_id', Auth::id())
            ->findOrFail($transaction);

        $data = $request->validate([
            'wallet_id' => ['required', 'integer'],
            'category_id' => ['nullable', 'integer'],
            'type' => ['required', 'in:income,expense'],
            'amount' => ['required', 'numeric', 'min:1'],
            'occurred_at' => ['required', 'date'],
            'note' => ['nullable', 'string', 'max:200'],
        ]);

        $userId = Auth::id();

        // rollback saldo lama
        $oldWallet = Wallet::query()->where('user_id', $userId)->findOrFail($t->wallet_id);
        $oldAmount = (float) $t->amount;
        $oldWallet->balance = $t->type === 'income'
            ? (float) $oldWallet->balance - $oldAmount
            : (float) $oldWallet->balance + $oldAmount;
        $oldWallet->save();

        // apply saldo baru
        $newWallet = Wallet::query()->where('user_id', $userId)->findOrFail($data['wallet_id']);
        $newAmount = (float) $data['amount'];

        if ($data['type'] === 'expense' && (float) $newWallet->balance < $newAmount) {
            abort(422, 'Saldo wallet tidak cukup untuk pengeluaran.');
        }

        $newWallet->balance = $data['type'] === 'income'
            ? (float) $newWallet->balance + $newAmount
            : (float) $newWallet->balance - $newAmount;
        $newWallet->save();

        $t->update($data);

        return redirect()->route('transactions.index');
    }

    public function destroy(string $transaction)
    {
        $t = Transaction::query()
            ->where('user_id', Auth::id())
            ->findOrFail($transaction);

        // rollback saldo
        $wallet = Wallet::query()->where('user_id', Auth::id())->findOrFail($t->wallet_id);
        $amount = (float) $t->amount;

        $wallet->balance = $t->type === 'income'
            ? (float) $wallet->balance - $amount
            : (float) $wallet->balance + $amount;
        $wallet->save();

        $t->delete();

        return redirect()->route('transactions.index');
    }
}

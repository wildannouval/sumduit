<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WalletController extends Controller
{
    public function index()
    {
        $wallets = Wallet::query()
            ->where('user_id', Auth::id())
            ->orderBy('name')
            ->get(['id', 'type', 'name', 'account_number', 'balance', 'created_at']);

        return Inertia::render('wallets/index', [
            'wallets' => $wallets,
        ]);
    }

    public function create()
    {
        return Inertia::render('wallets/create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => ['required', 'string', 'max:50'],
            'name' => ['required', 'string', 'max:100'],
            'account_number' => ['nullable', 'string', 'max:100'],
            'balance' => ['required', 'numeric', 'min:0'],
        ]);

        Wallet::create([
            'user_id' => Auth::id(),
            ...$data,
        ]);

        return redirect()->route('wallets.index');
    }

    public function edit(string $wallet)
    {
        $w = Wallet::query()
            ->where('user_id', Auth::id())
            ->findOrFail($wallet);

        return Inertia::render('wallets/edit', [
            'wallet' => $w->only(['id', 'type', 'name', 'account_number', 'balance']),
        ]);
    }

    public function update(Request $request, string $wallet)
    {
        $w = Wallet::query()
            ->where('user_id', Auth::id())
            ->findOrFail($wallet);

        $data = $request->validate([
            'type' => ['required', 'string', 'max:50'],
            'name' => ['required', 'string', 'max:100'],
            'account_number' => ['nullable', 'string', 'max:100'],
            'balance' => ['required', 'numeric', 'min:0'],
        ]);

        $w->update($data);

        return redirect()->route('wallets.index');
    }

    public function destroy(string $wallet)
    {
        $w = Wallet::query()
            ->where('user_id', Auth::id())
            ->findOrFail($wallet);

        $w->delete();

        return redirect()->route('wallets.index');
    }
}

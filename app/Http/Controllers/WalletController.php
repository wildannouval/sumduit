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
            ->get();

        return Inertia::render('wallets/index', [
            'wallets' => $wallets,
            // Mengambil flash message dari session untuk Alert keberhasilan
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => ['required', 'string'],
            'name' => ['required', 'string', 'max:100'],
            'account_number' => ['nullable', 'string', 'max:100'],
            'balance' => ['required', 'numeric'],
        ]);

        Wallet::create([
            'user_id' => Auth::id(),
            ...$data,
        ]);

        return redirect('/wallets')->with('success', 'Wallet berhasil ditambahkan!');
    }

    public function update(Request $request, Wallet $wallet)
    {
        $this->authorizeUser($wallet);

        $data = $request->validate([
            'type' => ['required', 'string'],
            'name' => ['required', 'string', 'max:100'],
            'account_number' => ['nullable', 'string', 'max:100'],
            'balance' => ['required', 'numeric'],
        ]);

        $wallet->update($data);

        return redirect('/wallets')->with('success', 'Wallet berhasil diperbarui!');
    }

    public function destroy(Wallet $wallet)
    {
        $this->authorizeUser($wallet);
        $wallet->delete();

        return redirect('/wallets')->with('success', 'Wallet berhasil dihapus!');
    }

    private function authorizeUser(Wallet $wallet)
    {
        if ($wallet->user_id !== Auth::id()) {
            abort(403);
        }
    }
}

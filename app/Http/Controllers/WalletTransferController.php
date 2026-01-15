<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use App\Models\WalletTransfer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class WalletTransferController extends Controller
{
    public function create()
    {
        $wallets = Wallet::query()
            ->where('user_id', Auth::id())
            ->orderBy('name')
            ->get(['id', 'name', 'type', 'balance']);

        return Inertia::render('wallets/transfer', [
            'wallets' => $wallets,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'from_wallet_id' => ['required', 'integer'],
            'to_wallet_id' => ['required', 'integer', 'different:from_wallet_id'],
            'amount' => ['required', 'numeric', 'min:1'],
            'note' => ['nullable', 'string', 'max:150'],
            'transferred_at' => ['required', 'date'],
        ]);

        $userId = Auth::id();

        DB::transaction(function () use ($data, $userId) {
            /** @var Wallet $from */
            $from = Wallet::query()->where('user_id', $userId)->lockForUpdate()->findOrFail($data['from_wallet_id']);
            /** @var Wallet $to */
            $to = Wallet::query()->where('user_id', $userId)->lockForUpdate()->findOrFail($data['to_wallet_id']);

            $amount = (float) $data['amount'];

            if ((float) $from->balance < $amount) {
                abort(422, 'Saldo wallet sumber tidak cukup.');
            }

            $from->balance = (float) $from->balance - $amount;
            $to->balance = (float) $to->balance + $amount;

            $from->save();
            $to->save();

            WalletTransfer::create([
                'user_id' => $userId,
                'from_wallet_id' => $from->id,
                'to_wallet_id' => $to->id,
                'amount' => $amount,
                'note' => $data['note'] ?? null,
                'transferred_at' => $data['transferred_at'],
            ]);
        });

        return redirect()->route('wallets.index');
    }
}

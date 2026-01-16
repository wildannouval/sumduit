<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use App\Models\WalletTransfer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class WalletTransferController extends Controller
{
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

        try {
            DB::transaction(function () use ($data, $userId) {
                $from = Wallet::query()->where('user_id', $userId)->lockForUpdate()->findOrFail($data['from_wallet_id']);
                $to = Wallet::query()->where('user_id', $userId)->lockForUpdate()->findOrFail($data['to_wallet_id']);

                $amount = (float) $data['amount'];

                if ((float) $from->balance < $amount) {
                    throw new \Exception('Saldo dompet sumber tidak mencukupi.');
                }

                // Saldo diupdate otomatis oleh WalletTransferObserver,
                // jadi kita hanya perlu membuat record transfer saja.
                WalletTransfer::create([
                    'user_id' => $userId,
                    'from_wallet_id' => $from->id,
                    'to_wallet_id' => $to->id,
                    'amount' => $amount,
                    'note' => $data['note'] ?? null,
                    'transferred_at' => $data['transferred_at'],
                ]);
            });

            return redirect('/wallets')->with('success', 'Transfer saldo berhasil dilakukan!');
        } catch (\Exception $e) {
            return redirect('/wallets')->with('error', $e->getMessage());
        }
    }
}

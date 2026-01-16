<?php

namespace App\Observers;

use App\Models\WalletTransfer;
use App\Models\Wallet;

class WalletTransferObserver
{
    /**
     * Menangani saat transfer baru dibuat.
     */
    public function created(WalletTransfer $transfer): void
    {
        $fromWallet = Wallet::find($transfer->from_wallet_id);
        $toWallet = Wallet::find($transfer->to_wallet_id);

        if ($fromWallet) {
            $fromWallet->decrement('balance', $transfer->amount);
        }

        if ($toWallet) {
            $toWallet->increment('balance', $transfer->amount);
        }
    }

    /**
     * Menangani saat data transfer dihapus.
     */
    public function deleted(WalletTransfer $transfer): void
    {
        $fromWallet = Wallet::find($transfer->from_wallet_id);
        $toWallet = Wallet::find($transfer->to_wallet_id);

        if ($fromWallet) {
            // Kembalikan saldo ke dompet asal
            $fromWallet->increment('balance', $transfer->amount);
        }

        if ($toWallet) {
            // Tarik kembali saldo dari dompet tujuan
            $toWallet->decrement('balance', $transfer->amount);
        }
    }

    /**
     * Menangani saat transfer diperbarui (ubah nominal atau ganti dompet).
     */
    public function updated(WalletTransfer $transfer): void
    {
        // 1. Ambil data asli sebelum diubah
        $oldAmount = $transfer->getOriginal('amount');
        $oldFromId = $transfer->getOriginal('from_wallet_id');
        $oldToId = $transfer->getOriginal('to_wallet_id');

        // 2. Batalkan efek transfer lama pada dompet lama
        $oldFromWallet = Wallet::find($oldFromId);
        if ($oldFromWallet) {
            $oldFromWallet->increment('balance', $oldAmount);
        }

        $oldToWallet = Wallet::find($oldToId);
        if ($oldToWallet) {
            $oldToWallet->decrement('balance', $oldAmount);
        }

        // 3. Terapkan efek transfer baru pada dompet saat ini
        $currentFromWallet = Wallet::find($transfer->from_wallet_id);
        if ($currentFromWallet) {
            $currentFromWallet->decrement('balance', $transfer->amount);
        }

        $currentToWallet = Wallet::find($transfer->to_wallet_id);
        if ($currentToWallet) {
            $currentToWallet->increment('balance', $transfer->amount);
        }
    }
}

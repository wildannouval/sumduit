<?php

namespace App\Observers;

use App\Models\WalletTransfer;
use App\Models\Wallet;

class WalletTransferObserver
{
    public function created(WalletTransfer $transfer): void
    {
        /** @var Wallet $fromWallet */
        $fromWallet = Wallet::find($transfer->from_wallet_id);
        /** @var Wallet $toWallet */
        $toWallet = Wallet::find($transfer->to_wallet_id);

        if ($fromWallet) {
            $fromWallet->decrement('balance', $transfer->amount);
        }

        if ($toWallet) {
            $toWallet->increment('balance', $transfer->amount);
        }
    }

    public function deleted(WalletTransfer $transfer): void
    {
        /** @var Wallet $fromWallet */
        $fromWallet = Wallet::find($transfer->from_wallet_id);
        /** @var Wallet $toWallet */
        $toWallet = Wallet::find($transfer->to_wallet_id);

        if ($fromWallet) {
            $fromWallet->increment('balance', $transfer->amount);
        }

        if ($toWallet) {
            $toWallet->decrement('balance', $transfer->amount);
        }
    }

    public function updated(WalletTransfer $transfer): void
    {
        $oldAmount = $transfer->getOriginal('amount');
        $oldFromId = $transfer->getOriginal('from_wallet_id');
        $oldToId = $transfer->getOriginal('to_wallet_id');

        /** @var Wallet $oldFromWallet */
        $oldFromWallet = Wallet::find($oldFromId);
        if ($oldFromWallet) {
            $oldFromWallet->increment('balance', $oldAmount);
        }

        /** @var Wallet $oldToWallet */
        $oldToWallet = Wallet::find($oldToId);
        if ($oldToWallet) {
            $oldToWallet->decrement('balance', $oldAmount);
        }

        /** @var Wallet $currentFromWallet */
        $currentFromWallet = Wallet::find($transfer->from_wallet_id);
        if ($currentFromWallet) {
            $currentFromWallet->decrement('balance', $transfer->amount);
        }

        /** @var Wallet $currentToWallet */
        $currentToWallet = Wallet::find($transfer->to_wallet_id);
        if ($currentToWallet) {
            $currentToWallet->increment('balance', $transfer->amount);
        }
    }
}

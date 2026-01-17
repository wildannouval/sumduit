<?php

namespace App\Observers;

use App\Models\Transaction;
use App\Models\Wallet;
use App\Models\Goal;

class TransactionObserver
{
    public function created(Transaction $transaction): void
    {
        /** @var Wallet $wallet */
        $wallet = Wallet::find($transaction->wallet_id);
        if ($wallet) {
            if ($transaction->type === 'income') {
                $wallet->increment('balance', $transaction->amount);
            } else {
                $wallet->decrement('balance', $transaction->amount);
            }
        }

        if ($transaction->goal_id) {
            /** @var Goal $goal */
            $goal = Goal::find($transaction->goal_id);
            if ($goal) {
                $goal->increment('current_amount', $transaction->amount);
            }
        }
    }

    public function deleted(Transaction $transaction): void
    {
        /** @var Wallet $wallet */
        $wallet = Wallet::find($transaction->wallet_id);
        if ($wallet) {
            if ($transaction->type === 'income') {
                $wallet->decrement('balance', $transaction->amount);
            } else {
                $wallet->increment('balance', $transaction->amount);
            }
        }

        if ($transaction->goal_id) {
            /** @var Goal $goal */
            $goal = Goal::find($transaction->goal_id);
            if ($goal) {
                $goal->decrement('current_amount', $transaction->amount);
            }
        }
    }

    public function updated(Transaction $transaction): void
    {
        $oldAmount = $transaction->getOriginal('amount');
        $oldType = $transaction->getOriginal('type');
        $oldWalletId = $transaction->getOriginal('wallet_id');
        $oldGoalId = $transaction->getOriginal('goal_id');

        /** @var Wallet $oldWallet */
        $oldWallet = Wallet::find($oldWalletId);
        if ($oldWallet) {
            if ($oldType === 'income') {
                $oldWallet->decrement('balance', $oldAmount);
            } else {
                $oldWallet->increment('balance', $oldAmount);
            }
        }

        if ($oldGoalId) {
            /** @var Goal $oldGoal */
            $oldGoal = Goal::find($oldGoalId);
            if ($oldGoal) {
                $oldGoal->decrement('current_amount', $oldAmount);
            }
        }

        $this->created($transaction);
    }
}

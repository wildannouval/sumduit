<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\RecurringTemplate;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProcessRecurringTransactions extends Command
{
    protected $signature = 'sumduit:process-recurring';
    protected $description = 'Proses otomatis tagihan rutin yang sudah jatuh tempo';

    public function handle()
    {
        $today = Carbon::today();

        // Cari template yang next_due_date-nya hari ini atau sudah lewat
        $templates = RecurringTemplate::where('next_due_date', '<=', $today->toDateString())->get();

        $count = 0;
        foreach ($templates as $temp) {
            DB::transaction(function () use ($temp, $today) {
                // 1. Buat Transaksi
                Transaction::create([
                    'user_id'     => $temp->user_id,
                    'wallet_id'   => $temp->wallet_id,
                    'category_id' => $temp->category_id,
                    'type'        => $temp->type,
                    'amount'      => $temp->amount,
                    'occurred_at' => $today,
                    'note'        => "Automatis: " . $temp->name,
                ]);

                // 2. Hitung tanggal berikutnya
                $nextDate = Carbon::parse($temp->next_due_date);
                if ($temp->frequency === 'monthly') {
                    $nextDate = $nextDate->addMonth();
                } elseif ($temp->frequency === 'weekly') {
                    $nextDate = $nextDate->addWeek();
                }

                // 3. Update Template
                $temp->update([
                    'last_applied_at' => $today,
                    'next_due_date'   => $nextDate,
                ]);
            });
            $count++;
        }

        $this->info("Berhasil memproses {$count} tagihan rutin.");
    }
}

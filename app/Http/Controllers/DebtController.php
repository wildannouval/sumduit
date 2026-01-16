<?php

namespace App\Http\Controllers;

use App\Models\Debt;
use App\Models\Transaction;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DebtController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        // Mengambil data hutang, mengurutkan yang belum lunas (unpaid) di atas
        $debts = Debt::where('user_id', $userId)
            ->orderBy('status', 'desc') // 'unpaid' (u) vs 'paid' (p), unpaid akan muncul dulu secara abjad desc
            ->latest()
            ->get();

        return Inertia::render('debts/index', [
            'debts' => $debts,
            // Pastikan mengirim data wallets untuk keperluan bayar cicilan
            'wallets' => Wallet::where('user_id', $userId)->get(['id', 'name', 'balance']),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'person_name' => 'required|string|max:100',
            'type' => 'required|in:debt,credit',
            'amount' => 'required|numeric|min:1',
            'due_date' => 'nullable|date',
            'note' => 'nullable|string|max:200',
        ]);

        Debt::create([
            'user_id' => Auth::id(),
            'remaining_amount' => $data['amount'],
            'status' => 'unpaid',
            ...$data
        ]);

        return back()->with('success', 'Catatan pinjaman berhasil disimpan!');
    }

    public function pay(Request $request, $id)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'wallet_id' => 'required|exists:wallets,id'
        ]);

        try {
            DB::transaction(function () use ($request, $id) {
                $debt = Debt::where('user_id', Auth::id())->findOrFail($id);
                $payAmount = (float) $request->amount;

                if ($payAmount > $debt->remaining_amount) {
                    throw new \Exception('Nominal bayar melebihi sisa pinjaman.');
                }

                // 1. Buat record transaksi otomatis
                Transaction::create([
                    'user_id' => Auth::id(),
                    'wallet_id' => $request->wallet_id,
                    'category_id' => null, // Pembayaran hutang biasanya tidak masuk kategori pengeluaran rutin
                    'type' => $debt->type === 'debt' ? 'expense' : 'income',
                    'amount' => $payAmount,
                    'occurred_at' => now(),
                    'note' => "Bayar " . ($debt->type === 'debt' ? 'Hutang' : 'Piutang') . ": " . $debt->person_name,
                ]);

                // 2. Kurangi sisa hutang
                $debt->remaining_amount -= $payAmount;

                if ($debt->remaining_amount <= 0) {
                    $debt->status = 'paid';
                    $debt->remaining_amount = 0;
                }

                $debt->save();
            });

            return back()->with('success', 'Pembayaran berhasil dicatat!');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroy(Debt $debt)
    {
        if ($debt->user_id !== Auth::id()) abort(403);
        $debt->delete();
        return back()->with('success', 'Catatan berhasil dihapus.');
    }
}

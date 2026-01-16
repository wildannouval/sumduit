<?php

namespace App\Http\Controllers;

use App\Models\RecurringTemplate;
use App\Models\Category;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RecurringTemplateController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        return Inertia::render('recurring/index', [
            'templates' => RecurringTemplate::where('user_id', $userId)->with(['category', 'wallet'])->get(),
            'wallets' => Wallet::where('user_id', $userId)->get(['id', 'name']),
            'categories' => Category::where('user_id', $userId)->get(['id', 'name', 'type']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'amount' => 'required|numeric',
            'wallet_id' => 'required',
            'category_id' => 'required',
            'type' => 'required|in:income,expense',
            'frequency' => 'required|in:monthly,weekly',
            'next_due_date' => 'required|date',
        ]);

        RecurringTemplate::create(['user_id' => Auth::id(), ...$data]);
        return back()->with('success', 'Tagihan rutin berhasil dijadwalkan!');
    }

    public function destroy($id)
    {
        RecurringTemplate::where('user_id', Auth::id())->findOrFail($id)->delete();
        return back()->with('success', 'Jadwal dihapus.');
    }
}

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
            'templates' => RecurringTemplate::where('user_id', $userId)
                ->with(['category:id,name', 'wallet:id,name'])
                ->latest()
                ->get(),
            'wallets' => Wallet::where('user_id', $userId)->get(['id', 'name']),
            'categories' => Category::where('user_id', $userId)->where('type', 'expense')->get(['id', 'name', 'type']),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'amount' => 'required|numeric|min:1',
            'wallet_id' => 'required|exists:wallets,id',
            'category_id' => 'required|exists:categories,id',
            'type' => 'required|in:income,expense',
            'frequency' => 'required|in:monthly,weekly',
            'next_due_date' => 'required|date',
        ]);

        RecurringTemplate::create([
            'user_id' => Auth::id(),
            ...$data
        ]);

        return redirect('/recurring')->with('success', 'Tagihan rutin berhasil dijadwalkan!');
    }

    public function destroy($id)
    {
        $template = RecurringTemplate::where('user_id', Auth::id())->findOrFail($id);
        $template->delete();

        return redirect('/recurring')->with('success', 'Jadwal automasi berhasil dihapus.');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\FixedAsset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FixedAssetController extends Controller
{
    public function index(Request $request)
    {
        $userId = Auth::id();
        $search = $request->query('search', '');
        $category = $request->query('category', '');

        $query = FixedAsset::query()->where('user_id', $userId);

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }
        if ($category) {
            $query->where('category', 'like', "%{$category}%");
        }

        $assets = $query->orderByDesc('created_at')->get();

        return Inertia::render('assets/index', [
            'assets' => $assets,
            'summary' => [
                'total_assets' => $assets->count(),
                'total_value' => (float) $assets->sum('value'),
            ],
            'filters' => [
                'search' => $search,
                'category' => $category,
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'value' => ['required', 'numeric', 'min:0'],
            'category' => ['nullable', 'string', 'max:50'],
            'purchased_at' => ['nullable', 'date'],
            'note' => ['nullable', 'string', 'max:200'],
        ]);

        FixedAsset::create([
            'user_id' => Auth::id(),
            ...$data,
        ]);

        return redirect('/assets')->with('success', 'Aset berhasil ditambahkan!');
    }

    public function update(Request $request, FixedAsset $asset)
    {
        if ($asset->user_id !== Auth::id()) abort(403);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'value' => ['required', 'numeric', 'min:0'],
            'category' => ['nullable', 'string', 'max:50'],
            'purchased_at' => ['nullable', 'date'],
            'note' => ['nullable', 'string', 'max:200'],
        ]);

        $asset->update($data);

        return redirect('/assets')->with('success', 'Aset berhasil diperbarui!');
    }

    public function destroy(FixedAsset $asset)
    {
        if ($asset->user_id !== Auth::id()) abort(403);
        $asset->delete();

        return redirect('/assets')->with('success', 'Aset berhasil dihapus!');
    }
}

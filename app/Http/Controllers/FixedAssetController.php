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
        $search = $request->query('search', '');
        $category = $request->query('category', '');

        $query = FixedAsset::query()->where('user_id', Auth::id());

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }
        if ($category) {
            $query->where('category', 'like', "%{$category}%");
        }

        $assets = $query->orderByDesc('created_at')->get();

        return Inertia::render('assets/index', [
            'assets' => [
                'data' => $assets // Dibungkus agar .data.map() tidak error
            ],
            'summary' => [
                'total_assets' => $assets->count(),
                'total_value' => (float) $assets->sum('value'),
            ],
            'filters' => [
                'search' => $search,
                'category' => $category,
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('assets/create');
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

        return redirect('/assets');
    }

    public function edit(string $id)
    {
        $asset = FixedAsset::where('user_id', Auth::id())->findOrFail($id);
        return Inertia::render('assets/edit', ['asset' => $asset]);
    }

    public function update(Request $request, string $id)
    {
        $asset = FixedAsset::where('user_id', Auth::id())->findOrFail($id);
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'value' => ['required', 'numeric', 'min:0'],
            'category' => ['nullable', 'string', 'max:50'],
            'purchased_at' => ['nullable', 'date'],
            'note' => ['nullable', 'string', 'max:200'],
        ]);

        $asset->update($data);
        return redirect('/assets');
    }

    public function destroy(string $id)
    {
        FixedAsset::where('user_id', Auth::id())->findOrFail($id)->delete();
        return redirect('/assets');
    }
}

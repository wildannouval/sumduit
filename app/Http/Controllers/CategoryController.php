<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('categories/index', [
            'categories' => Category::where('user_id', Auth::id())
                ->orderBy('type')
                ->orderBy('name')
                ->get(),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:50',
            'type' => 'required|in:income,expense',
            'group' => 'required|in:needs,wants,saving',
        ]);

        Category::create([
            'user_id' => Auth::id(),
            ...$data
        ]);

        return redirect('/categories')->with('success', 'Kategori baru berhasil ditambahkan!');
    }

    public function update(Request $request, Category $category)
    {
        if ($category->user_id !== Auth::id()) abort(403);

        $data = $request->validate([
            'name' => 'required|string|max:50',
            'type' => 'required|in:income,expense',
            'group' => 'required|in:needs,wants,saving',
        ]);

        $category->update($data);

        return redirect('/categories')->with('success', 'Perubahan kategori disimpan!');
    }

    public function destroy(Category $category)
    {
        if ($category->user_id !== Auth::id()) abort(403);

        $category->delete();

        return redirect('/categories')->with('success', 'Kategori telah dihapus.');
    }
}

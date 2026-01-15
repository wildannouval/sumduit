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
        $categories = Category::query()
            ->where('user_id', Auth::id())
            ->orderBy('type')
            ->orderBy('group')
            ->orderBy('name')
            ->get(['id', 'name', 'group', 'type']);

        return Inertia::render('categories/index', [
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        return Inertia::render('categories/create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:80'],
            'group' => ['required', 'in:needs,wants,saving'],
            'type' => ['required', 'in:income,expense'],
        ]);

        Category::create([
            'user_id' => Auth::id(),
            ...$data,
        ]);

        return redirect()->route('categories.index');
    }

    public function edit(string $category)
    {
        $c = Category::query()
            ->where('user_id', Auth::id())
            ->findOrFail($category);

        return Inertia::render('categories/edit', [
            'category' => $c->only(['id', 'name', 'group', 'type']),
        ]);
    }

    public function update(Request $request, string $category)
    {
        $c = Category::query()
            ->where('user_id', Auth::id())
            ->findOrFail($category);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:80'],
            'group' => ['required', 'in:needs,wants,saving'],
            'type' => ['required', 'in:income,expense'],
        ]);

        $c->update($data);

        return redirect()->route('categories.index');
    }

    public function destroy(string $category)
    {
        $c = Category::query()
            ->where('user_id', Auth::id())
            ->findOrFail($category);

        $c->delete();

        return redirect()->route('categories.index');
    }
}

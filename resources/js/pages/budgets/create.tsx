import { Head, Link, useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

type Wallet = { id: number; name: string };
type Category = {
    id: number;
    name: string;
    type: 'income' | 'expense';
    group: 'needs' | 'wants' | 'saving';
};

export default function BudgetCreate(props: {
    wallets: Wallet[];
    categories: Category[];
    defaults?: { month?: string };
}) {
    const { wallets, categories, defaults } = props;
    const expenseCategories = categories.filter((c) => c.type === 'expense');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Budgets', href: '/budgets' },
        { title: 'Tambah', href: '/budgets/create' },
    ];

    const form = useForm({
        month: defaults?.month ?? new Date().toISOString().slice(0, 7),
        category_id: expenseCategories[0]?.id ?? '',
        group: 'needs', // Default group sesuai enum/kebutuhan
        wallet_id: '' as '' | string,
        amount: 0,
        notes: '',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Budget" />

            <div className="p-4">
                <div className="mb-4">
                    <h1 className="text-xl font-semibold">Tambah Budget</h1>
                    <p className="text-sm text-muted-foreground">
                        Tentukan alokasi budget bulananmu.
                    </p>
                </div>

                <form
                    className="max-w-2xl space-y-4 rounded-xl border p-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.post('/budgets'); // Rute manual
                    }}
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Bulan</label>
                            <Input
                                type="month"
                                value={form.data.month}
                                onChange={(e) =>
                                    form.setData('month', e.target.value)
                                }
                            />
                            {form.errors.month && (
                                <p className="text-xs text-red-600">
                                    {form.errors.month}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Kategori (expense)
                            </label>
                            <select
                                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                                value={String(form.data.category_id)}
                                onChange={(e) => {
                                    const catId = Number(e.target.value);
                                    const selectedCat = expenseCategories.find(
                                        (c) => c.id === catId,
                                    );
                                    form.setData({
                                        ...form.data,
                                        category_id: catId,
                                        group: selectedCat?.group ?? 'needs',
                                    });
                                }}
                            >
                                <option value="" disabled>
                                    Pilih Kategori
                                </option>
                                {expenseCategories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} ({c.group})
                                    </option>
                                ))}
                            </select>
                            {form.errors.category_id && (
                                <p className="text-xs text-red-600">
                                    {form.errors.category_id}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Nominal Budget
                            </label>
                            <Input
                                type="number"
                                value={form.data.amount}
                                onChange={(e) =>
                                    form.setData(
                                        'amount',
                                        Number(e.target.value),
                                    )
                                }
                            />
                            {form.errors.amount && (
                                <p className="text-xs text-red-600">
                                    {form.errors.amount}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">
                                Catatan (opsional)
                            </label>
                            <Input
                                value={form.data.notes}
                                onChange={(e) =>
                                    form.setData('notes', e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={form.processing}>
                            Simpan Budget
                        </Button>
                        <Button asChild type="button" variant="outline">
                            <Link href="/budgets">Batal</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

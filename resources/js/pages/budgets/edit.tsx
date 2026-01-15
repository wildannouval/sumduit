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

type Budget = {
    id: number;
    month: string;
    category_id: number;
    wallet_id: number | null;
    amount: number;
    notes: string | null;
};

export default function BudgetEdit(props: {
    budget: Budget;
    wallets: Wallet[];
    categories: Category[];
}) {
    const { budget, wallets, categories } = props;
    const expenseCategories = categories.filter((c) => c.type === 'expense');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Budgets', href: '/budgets' },
        { title: 'Edit', href: `/budgets/${budget.id}/edit` },
    ];

    const form = useForm({
        month: budget.month,
        category_id: budget.category_id,
        group: 'needs', // Akan diupdate di logic atau dikirim dari backend
        wallet_id: budget.wallet_id ? String(budget.wallet_id) : '',
        amount: Number(budget.amount),
        notes: budget.notes ?? '',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Budget" />

            <div className="p-4">
                <div className="mb-4">
                    <h1 className="text-xl font-semibold">Edit Budget</h1>
                    <p className="text-sm text-muted-foreground">
                        Perbarui rincian budget bulananmu.
                    </p>
                </div>

                <form
                    className="max-w-2xl space-y-4 rounded-xl border p-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.put(`/budgets/${budget.id}`); // Rute manual dengan ID
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
                                Kategori
                            </label>
                            <select
                                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                                value={String(form.data.category_id)}
                                onChange={(e) =>
                                    form.setData(
                                        'category_id',
                                        Number(e.target.value),
                                    )
                                }
                            >
                                {expenseCategories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} ({c.group})
                                    </option>
                                ))}
                            </select>
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
                            Simpan Perubahan
                        </Button>
                        <Button asChild type="button" variant="outline">
                            <Link href="/budgets">Kembali</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

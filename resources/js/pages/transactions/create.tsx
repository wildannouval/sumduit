import { Head, Link, useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

type Wallet = { id: number; name: string; balance: number };
type Category = {
    id: number;
    name: string;
    type: 'income' | 'expense';
    group: 'needs' | 'wants' | 'saving';
};

export default function TransactionCreate(props: {
    wallets: Wallet[];
    categories: Category[];
}) {
    const { wallets, categories } = props;

    const form = useForm({
        wallet_id: wallets[0]?.id ?? 0,
        category_id: null as number | null,
        type: 'expense' as 'income' | 'expense',
        amount: 0,
        occurred_at: new Date().toISOString().slice(0, 10),
        note: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Transactions', href: '/transactions' },
        { title: 'Tambah', href: '/transactions/create' },
    ];

    const filteredCategories = categories.filter(
        (c) => c.type === form.data.type,
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Transaksi" />

            <div className="p-4">
                <div className="mb-4">
                    <h1 className="text-xl font-semibold">Tambah Transaksi</h1>
                    <p className="text-sm text-muted-foreground">
                        Isi transaksi pemasukan/pengeluaran. Saldo wallet akan
                        otomatis disesuaikan.
                    </p>
                </div>

                <form
                    className="max-w-2xl space-y-4 rounded-xl border p-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.post('/transactions');
                    }}
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tipe</label>
                            <select
                                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                                value={form.data.type}
                                onChange={(e) => {
                                    const nextType = e.target.value as
                                        | 'income'
                                        | 'expense';
                                    form.setData((prev) => ({
                                        ...prev,
                                        type: nextType,
                                        category_id: null,
                                    }));
                                }}
                            >
                                <option value="expense">expense</option>
                                <option value="income">income</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Tanggal
                            </label>
                            <Input
                                type="date"
                                value={form.data.occurred_at}
                                onChange={(e) =>
                                    form.setData('occurred_at', e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Wallet
                            </label>
                            <select
                                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                                value={form.data.wallet_id}
                                onChange={(e) =>
                                    form.setData(
                                        'wallet_id',
                                        Number(e.target.value),
                                    )
                                }
                            >
                                {wallets.map((w) => (
                                    <option key={w.id} value={w.id}>
                                        {w.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Kategori (opsional)
                            </label>
                            <select
                                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                                value={form.data.category_id ?? ''}
                                onChange={(e) =>
                                    form.setData(
                                        'category_id',
                                        e.target.value
                                            ? Number(e.target.value)
                                            : null,
                                    )
                                }
                            >
                                <option value="">-</option>
                                {filteredCategories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} ({c.group})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">
                                Jumlah
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
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">
                                Catatan (opsional)
                            </label>
                            <Input
                                value={form.data.note}
                                onChange={(e) =>
                                    form.setData('note', e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={form.processing}>
                            Simpan
                        </Button>
                        <Button asChild type="button" variant="outline">
                            <Link href="/transactions">Batal</Link>
                        </Button>
                    </div>
                </form>

                {wallets.length === 0 && (
                    <p className="mt-4 text-sm text-red-600">
                        Kamu belum punya wallet. Buat wallet dulu di menu
                        Wallets.
                    </p>
                )}
            </div>
        </AppLayout>
    );
}

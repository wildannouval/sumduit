import { Head, Link, router } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { formatIDR } from '@/lib/money';
import { type BreadcrumbItem } from '@/types';

type Wallet = { id: number; name: string };
type Category = {
    id: number;
    name: string;
    type: 'income' | 'expense';
    group: 'needs' | 'wants' | 'saving';
};

type Tx = {
    id: number;
    wallet_id: number;
    category_id: number | null;
    type: 'income' | 'expense';
    amount: number;
    occurred_at: string;
    note: string | null;
    wallet?: { id: number; name: string };
    category?: { id: number; name: string };
};

type Pagination<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transactions',
        href: '/transactions',
    },
];

export default function TransactionIndex(props: {
    transactions: Pagination<Tx>;
    filters: {
        search: string;
        type: 'all' | 'income' | 'expense';
        wallet_id: string; // "all" | id
        from: string;
        to: string;
    };
    wallets: Wallet[];
    categories: Category[];
}) {
    const { transactions, filters, wallets } = props;

    function applyFilters(next: Partial<typeof filters>) {
        const q = { ...filters, ...next };
        // Menggunakan path manual '/transactions'
        router.get('/transactions', q, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transactions" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h1 className="text-xl font-semibold">Transaksi</h1>
                        <p className="text-sm text-muted-foreground">
                            Catat pemasukan & pengeluaran. Gunakan search dan
                            filter untuk menemukan transaksi.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/transactions/create">
                            Tambah Transaksi
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <div className="rounded-xl border p-4">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm font-medium">
                                Search (catatan)
                            </label>
                            <Input
                                value={filters.search}
                                placeholder="mis. bensin, makan..."
                                onChange={(e) =>
                                    applyFilters({ search: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Tipe
                            </label>
                            <select
                                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                                value={filters.type}
                                onChange={(e) =>
                                    applyFilters({
                                        type: e.target.value as any,
                                    })
                                }
                            >
                                <option value="all">Semua</option>
                                <option value="income">Pemasukan</option>
                                <option value="expense">Pengeluaran</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Wallet
                            </label>
                            <select
                                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                                value={filters.wallet_id}
                                onChange={(e) =>
                                    applyFilters({ wallet_id: e.target.value })
                                }
                            >
                                <option value="all">Semua Wallet</option>
                                {wallets.map((w) => (
                                    <option key={w.id} value={String(w.id)}>
                                        {w.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Dari
                                </label>
                                <Input
                                    type="date"
                                    value={filters.from}
                                    onChange={(e) =>
                                        applyFilters({ from: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Sampai
                                </label>
                                <Input
                                    type="date"
                                    value={filters.to}
                                    onChange={(e) =>
                                        applyFilters({ to: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            onClick={() =>
                                applyFilters({
                                    search: '',
                                    type: 'all',
                                    wallet_id: 'all',
                                    from: '',
                                    to: '',
                                })
                            }
                        >
                            Reset Filter
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-xl border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/40">
                                <tr>
                                    <th className="p-3 text-left">Tanggal</th>
                                    <th className="p-3 text-left">Wallet</th>
                                    <th className="p-3 text-left">Kategori</th>
                                    <th className="p-3 text-left">Tipe</th>
                                    <th className="p-3 text-right">Jumlah</th>
                                    <th className="p-3 text-left">Catatan</th>
                                    <th className="p-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.data.length === 0 ? (
                                    <tr>
                                        <td
                                            className="p-4 text-muted-foreground"
                                            colSpan={7}
                                        >
                                            Tidak ada transaksi.
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.data.map((t) => (
                                        <tr
                                            key={t.id}
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="p-3">
                                                {t.occurred_at}
                                            </td>
                                            <td className="p-3">
                                                {t.wallet?.name ?? '-'}
                                            </td>
                                            <td className="p-3">
                                                {t.category?.name ?? '-'}
                                            </td>
                                            <td className="p-3">
                                                {t.type === 'income' ? (
                                                    <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-emerald-700">
                                                        income
                                                    </span>
                                                ) : (
                                                    <span className="rounded-md bg-rose-500/10 px-2 py-1 text-rose-700">
                                                        expense
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-3 text-right font-medium">
                                                {formatIDR(Number(t.amount))}
                                            </td>
                                            <td className="p-3">
                                                {t.note ?? '-'}
                                            </td>
                                            <td className="p-3">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        <Link
                                                            href={`/transactions/${t.id}/edit`}
                                                        >
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => {
                                                            if (
                                                                confirm(
                                                                    'Hapus transaksi ini? Saldo wallet akan disesuaikan.',
                                                                )
                                                            ) {
                                                                router.delete(
                                                                    `/transactions/${t.id}`,
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        Hapus
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t p-3 text-sm">
                        <div className="text-muted-foreground">
                            Halaman {transactions.current_page} dari{' '}
                            {transactions.last_page} • Total{' '}
                            {transactions.total}
                        </div>

                        <div className="flex flex-wrap gap-1">
                            {transactions.links.map((l, idx) => (
                                <button
                                    key={idx}
                                    disabled={!l.url}
                                    onClick={() =>
                                        l.url &&
                                        router.visit(l.url, {
                                            preserveScroll: true,
                                            preserveState: true,
                                        })
                                    }
                                    className={[
                                        'rounded-md border px-3 py-1',
                                        l.active ? 'bg-muted' : 'bg-background',
                                        !l.url
                                            ? 'opacity-50'
                                            : 'hover:bg-muted/60',
                                    ].join(' ')}
                                    dangerouslySetInnerHTML={{
                                        __html: l.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { formatIDR } from '@/lib/money';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

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
    category?: { id: number; name: string; group: string };
    wallet?: { id: number; name: string } | null;
    spent: number;
    remaining: number;
};

type Pagination<T> = {
    data: T[];
    current_page?: number;
    last_page?: number;
    links?: { url: string | null; label: string; active: boolean }[];
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Budgets', href: '/budgets' }];

function pct(n: number) {
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(100, Math.round(n)));
}

export default function BudgetIndex(props: {
    budgets: Pagination<Budget>;
    summary: {
        month: string;
        total_budget: number;
        total_spent: number;
        total_remaining: number;
        utilization_pct: number;
    };
    filters: {
        search: string;
        month: string;
    };
    wallets?: Wallet[];
    categories?: Category[];
}) {
    // MEMBERIKAN DEFAULT VALUE AGAR TIDAK ERROR "UNDEFINED"
    const {
        budgets = { data: [] },
        summary = {
            month: '',
            total_budget: 0,
            total_spent: 0,
            total_remaining: 0,
            utilization_pct: 0,
        },
        filters = { search: '', month: '' },
        wallets = [],
    } = props;

    function applyFilters(next: Partial<typeof filters>) {
        const q = { ...filters, ...next };
        router.get('/budgets', q, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Budgets" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h1 className="text-xl font-semibold">Budgets</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola budget bulanan per kategori.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/budgets/create">Tambah Budget</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="rounded-xl border p-4">
                        <div className="text-sm text-muted-foreground">
                            Total Budget ({summary.month})
                        </div>
                        <div className="mt-1 text-2xl font-semibold">
                            {formatIDR(summary.total_budget || 0)}
                        </div>
                    </div>
                    <div className="rounded-xl border p-4">
                        <div className="text-sm text-muted-foreground">
                            Terpakai
                        </div>
                        <div className="mt-1 text-2xl font-semibold">
                            {formatIDR(summary.total_spent || 0)}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                            {pct(summary.utilization_pct || 0)}% terpakai
                        </div>
                    </div>
                    <div className="rounded-xl border p-4">
                        <div className="text-sm text-muted-foreground">
                            Sisa
                        </div>
                        <div className="mt-1 text-2xl font-semibold">
                            {formatIDR(summary.total_remaining || 0)}
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border p-4">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm font-medium">
                                Search
                            </label>
                            <Input
                                value={filters.search || ''}
                                onChange={(e) =>
                                    applyFilters({ search: e.target.value })
                                }
                                placeholder="Cari budget..."
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Bulan
                            </label>
                            <Input
                                type="month"
                                value={filters.month || ''}
                                onChange={(e) =>
                                    applyFilters({ month: e.target.value })
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/40">
                                <tr>
                                    <th className="p-3 text-left">Bulan</th>
                                    <th className="p-3 text-left">Kategori</th>
                                    <th className="p-3 text-right">Budget</th>
                                    <th className="p-3 text-right">Spent</th>
                                    <th className="p-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {budgets.data.length === 0 ? (
                                    <tr>
                                        <td
                                            className="p-4 text-center"
                                            colSpan={5}
                                        >
                                            Tidak ada data.
                                        </td>
                                    </tr>
                                ) : (
                                    budgets.data.map((b) => (
                                        <tr
                                            key={b.id}
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="p-3">{b.month}</td>
                                            <td className="p-3">
                                                {b.category?.name || '-'}
                                            </td>
                                            <td className="p-3 text-right font-medium">
                                                {formatIDR(Number(b.amount))}
                                            </td>
                                            <td className="p-3 text-right">
                                                {formatIDR(
                                                    Number(b.spent || 0),
                                                )}
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        <Link
                                                            href={`/budgets/${b.id}/edit`}
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
                                                                    'Hapus budget?',
                                                                )
                                                            ) {
                                                                router.delete(
                                                                    `/budgets/${b.id}`,
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
                </div>
            </div>
        </AppLayout>
    );
}

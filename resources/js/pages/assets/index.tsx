import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { formatIDR } from '@/lib/money';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

type Asset = {
    id: number;
    name: string;
    value: number;
    category: string | null;
    purchased_at: string | null;
    note: string | null;
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Assets', href: '/assets' }];

export default function AssetIndex(props: {
    assets?: { data: Asset[] };
    summary?: { total_assets: number; total_value: number };
    filters?: { search: string; category: string };
}) {
    const {
        assets = { data: [] },
        summary = { total_assets: 0, total_value: 0 },
        filters = { search: '', category: '' },
    } = props;

    function applyFilters(next: any) {
        router.get(
            '/assets',
            { ...filters, ...next },
            { preserveState: true, replace: true },
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Assets" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Daftar Aset</h1>
                    <Button asChild>
                        <Link href="/assets/create">Tambah Asset</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-xl border p-4">
                        <div className="text-sm text-muted-foreground">
                            Total Aset
                        </div>
                        <div className="text-2xl font-bold">
                            {summary.total_assets}
                        </div>
                    </div>
                    <div className="rounded-xl border p-4">
                        <div className="text-sm text-muted-foreground">
                            Total Nilai Aset
                        </div>
                        <div className="text-2xl font-bold text-emerald-600">
                            {formatIDR(summary.total_value)}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 rounded-xl border p-4">
                    <Input
                        placeholder="Cari aset..."
                        value={filters.search}
                        onChange={(e) =>
                            applyFilters({ search: e.target.value })
                        }
                    />
                </div>

                <div className="overflow-hidden rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="p-3 text-left">Nama</th>
                                <th className="p-3 text-left">Kategori</th>
                                <th className="p-3 text-right">Nilai Aset</th>
                                <th className="p-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assets.data.length > 0 ? (
                                assets.data.map((a) => (
                                    <tr
                                        key={a.id}
                                        className="border-b last:border-b-0"
                                    >
                                        <td className="p-3">
                                            <div className="font-medium">
                                                {a.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {a.purchased_at}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            {a.category || '-'}
                                        </td>
                                        <td className="p-3 text-right font-medium">
                                            {formatIDR(Number(a.value))}
                                        </td>
                                        <td className="p-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Link
                                                        href={`/assets/${a.id}/edit`}
                                                    >
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (
                                                            confirm(
                                                                'Hapus aset ini?',
                                                            )
                                                        )
                                                            router.delete(
                                                                `/assets/${a.id}`,
                                                            );
                                                    }}
                                                >
                                                    Hapus
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="p-4 text-center text-muted-foreground"
                                    >
                                        Belum ada aset.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

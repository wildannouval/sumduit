import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { formatIDR } from '@/lib/money';
import { Head, Link, router } from '@inertiajs/react';

export default function AssetShow({ asset }: { asset: any }) {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Assets', href: '/assets' },
                { title: asset.name, href: `/assets/${asset.id}` },
            ]}
        >
            <Head title={`Aset: ${asset.name}`} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{asset.name}</h1>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href={`/assets/${asset.id}/edit`}>Edit</Link>
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (confirm('Hapus?'))
                                    router.delete(`/assets/${asset.id}`);
                            }}
                        >
                            Hapus
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-xl border bg-muted/20 p-4">
                        <div className="text-sm text-muted-foreground">
                            Kategori
                        </div>
                        <div className="text-lg font-medium">
                            {asset.category || '-'}
                        </div>
                    </div>
                    <div className="rounded-xl border bg-muted/20 p-4">
                        <div className="text-sm text-muted-foreground">
                            Nilai Aset
                        </div>
                        <div className="text-lg font-bold text-emerald-600">
                            {formatIDR(asset.value)}
                        </div>
                    </div>
                    <div className="rounded-xl border bg-muted/20 p-4">
                        <div className="text-sm text-muted-foreground">
                            Tanggal Beli
                        </div>
                        <div className="text-lg font-medium">
                            {asset.purchased_at || '-'}
                        </div>
                    </div>
                </div>

                {asset.note && (
                    <div className="rounded-xl border p-4">
                        <div className="mb-2 font-medium">Catatan</div>
                        <p className="text-sm text-muted-foreground">
                            {asset.note}
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

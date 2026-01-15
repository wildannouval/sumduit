import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function AssetCreate() {
    const form = useForm({
        name: '',
        value: 0,
        category: '',
        purchased_at: '',
        note: '',
    });

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Assets', href: '/assets' },
                { title: 'Tambah', href: '/assets/create' },
            ]}
        >
            <Head title="Tambah Asset" />
            <div className="p-4">
                <h1 className="mb-4 text-xl font-semibold">
                    Tambah Asset Baru
                </h1>
                <form
                    className="max-w-2xl space-y-4 rounded-xl border p-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.post('/assets');
                    }}
                >
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Nama Asset
                        </label>
                        <Input
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                        />
                        {form.errors.name && (
                            <p className="text-xs text-red-600">
                                {form.errors.name}
                            </p>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Nilai/Harga
                            </label>
                            <Input
                                type="number"
                                value={form.data.value}
                                onChange={(e) =>
                                    form.setData(
                                        'value',
                                        Number(e.target.value),
                                    )
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Kategori
                            </label>
                            <Input
                                value={form.data.category}
                                onChange={(e) =>
                                    form.setData('category', e.target.value)
                                }
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Tanggal Pembelian
                        </label>
                        <Input
                            type="date"
                            value={form.data.purchased_at}
                            onChange={(e) =>
                                form.setData('purchased_at', e.target.value)
                            }
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" disabled={form.processing}>
                            Simpan
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/assets">Batal</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

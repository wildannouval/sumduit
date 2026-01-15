import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function AssetEdit({ asset }: { asset: any }) {
    const form = useForm({
        name: asset.name,
        value: Number(asset.value),
        category: asset.category ?? '',
        purchased_at: asset.purchased_at ?? '',
        note: asset.note ?? '',
    });

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Assets', href: '/assets' },
                { title: 'Edit', href: `/assets/${asset.id}/edit` },
            ]}
        >
            <Head title="Edit Asset" />
            <div className="p-4">
                <h1 className="mb-4 text-xl font-semibold">Edit Asset</h1>
                <form
                    className="max-w-2xl space-y-4 rounded-xl border p-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.put(`/assets/${asset.id}`);
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
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nilai</label>
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
                    <div className="flex gap-2">
                        <Button type="submit" disabled={form.processing}>
                            Simpan Perubahan
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/assets">Kembali</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

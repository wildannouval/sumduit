import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

type Wallet = { id: number; name: string };

export default function GoalCreate({ wallets = [] }: { wallets: Wallet[] }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Goals', href: '/goals' },
        { title: 'Tambah', href: '/goals/create' },
    ];

    const form = useForm({
        name: '',
        target_amount: 0,
        current_amount: 0,
        due_date: '',
        wallet_id: '',
        status: 'active',
        note: '',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Goal" />
            <div className="p-4">
                <h1 className="mb-4 text-xl font-semibold">Tambah Goal Baru</h1>
                <form
                    className="max-w-2xl space-y-4 rounded-xl border p-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.post('/goals');
                    }}
                >
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nama Goal</label>
                        <Input
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                            placeholder="mis. Dana Darurat"
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
                                Target Nominal
                            </label>
                            <Input
                                type="number"
                                value={form.data.target_amount}
                                onChange={(e) =>
                                    form.setData(
                                        'target_amount',
                                        Number(e.target.value),
                                    )
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Sudah Terkumpul
                            </label>
                            <Input
                                type="number"
                                value={form.data.current_amount}
                                onChange={(e) =>
                                    form.setData(
                                        'current_amount',
                                        Number(e.target.value),
                                    )
                                }
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Due Date
                            </label>
                            <Input
                                type="date"
                                value={form.data.due_date}
                                onChange={(e) =>
                                    form.setData('due_date', e.target.value)
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
                                    form.setData('wallet_id', e.target.value)
                                }
                            >
                                <option value="">Pilih Wallet</option>
                                {wallets.map((w) => (
                                    <option key={w.id} value={w.id}>
                                        {w.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Catatan</label>
                        <Input
                            value={form.data.note}
                            onChange={(e) =>
                                form.setData('note', e.target.value)
                            }
                        />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Button type="submit" disabled={form.processing}>
                            Simpan
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/goals">Batal</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

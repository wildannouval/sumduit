import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

export default function GoalEdit({
    goal,
    wallets = [],
}: {
    goal: any;
    wallets: any[];
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Goals', href: '/goals' },
        { title: 'Edit', href: `/goals/${goal.id}/edit` },
    ];

    const form = useForm({
        name: goal.name,
        target_amount: Number(goal.target_amount),
        current_amount: Number(goal.current_amount),
        due_date: goal.due_date ?? '',
        wallet_id: goal.wallet_id ?? '',
        status: goal.status ?? 'active',
        note: goal.note ?? '',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Goal" />
            <div className="p-4">
                <h1 className="mb-4 text-xl font-semibold">Edit Goal</h1>
                <form
                    className="max-w-2xl space-y-4 rounded-xl border p-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.put(`/goals/${goal.id}`);
                    }}
                >
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nama Goal</label>
                        <Input
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                        />
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
                                Status
                            </label>
                            <select
                                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                                value={form.data.status}
                                onChange={(e) =>
                                    form.setData('status', e.target.value)
                                }
                            >
                                <option value="active">Active</option>
                                <option value="paused">Paused</option>
                                <option value="done">Done</option>
                            </select>
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
                                <option value="">Semua Wallet</option>
                                {wallets.map((w) => (
                                    <option key={w.id} value={w.id}>
                                        {w.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Button type="submit" disabled={form.processing}>
                            Simpan Perubahan
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/goals">Kembali</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

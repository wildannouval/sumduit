import { Head, Link, useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Wallets', href: '/wallets' },
    { title: 'Tambah', href: '/wallets/create' },
];

export default function WalletCreate() {
    const form = useForm({
        type: 'bank',
        name: '',
        account_number: '',
        balance: 0,
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Wallet" />

            <div className="p-4">
                <div className="mb-4">
                    <h1 className="text-xl font-semibold">Tambah Wallet</h1>
                    <p className="text-sm text-muted-foreground">
                        Isi data wallet kamu.
                    </p>
                </div>

                <form
                    className="max-w-xl space-y-4 rounded-xl border p-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.post('/wallets');
                    }}
                >
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Tipe Wallet
                        </label>
                        <select
                            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                            value={form.data.type}
                            onChange={(e) =>
                                form.setData('type', e.target.value)
                            }
                        >
                            <option value="cash">cash</option>
                            <option value="bank">bank</option>
                            <option value="ewallet">ewallet</option>
                            <option value="savings">savings</option>
                            <option value="emergency">emergency</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nama</label>
                        <Input
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Nomor Rekening (opsional)
                        </label>
                        <Input
                            value={form.data.account_number}
                            onChange={(e) =>
                                form.setData('account_number', e.target.value)
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Saldo Saat Ini
                        </label>
                        <Input
                            type="number"
                            value={form.data.balance}
                            onChange={(e) =>
                                form.setData('balance', Number(e.target.value))
                            }
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={form.processing}>
                            Simpan
                        </Button>
                        <Button asChild type="button" variant="outline">
                            <Link href="/wallets">Batal</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

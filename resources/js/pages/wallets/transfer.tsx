import { Head, Link, useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { formatIDR } from '@/lib/money';
import { type BreadcrumbItem } from '@/types';

type Wallet = { id: number; name: string; type: string; balance: number };

export default function WalletTransfer(props: { wallets: Wallet[] }) {
    const { wallets } = props;

    const form = useForm({
        from_wallet_id: wallets[0]?.id ?? 0,
        to_wallet_id: wallets[1]?.id ?? wallets[0]?.id ?? 0,
        amount: 0,
        note: '',
        transferred_at: new Date().toISOString().slice(0, 10),
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Wallets', href: '/wallets' },
        { title: 'Transfer', href: '/wallets/transfer' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transfer Wallet" />

            <div className="p-4">
                <div className="mb-4">
                    <h1 className="text-xl font-semibold">
                        Transfer Antar Wallet
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Pindahkan saldo dari satu wallet ke wallet lain.
                    </p>
                </div>

                <form
                    className="max-w-xl space-y-4 rounded-xl border p-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.post('/wallets/transfer');
                    }}
                >
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Dari Wallet
                        </label>
                        <select
                            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                            value={form.data.from_wallet_id}
                            onChange={(e) =>
                                form.setData(
                                    'from_wallet_id',
                                    Number(e.target.value),
                                )
                            }
                        >
                            {wallets.map((w) => (
                                <option key={w.id} value={w.id}>
                                    {w.name} ({w.type}) -{' '}
                                    {formatIDR(Number(w.balance))}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Ke Wallet</label>
                        <select
                            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                            value={form.data.to_wallet_id}
                            onChange={(e) =>
                                form.setData(
                                    'to_wallet_id',
                                    Number(e.target.value),
                                )
                            }
                        >
                            {wallets.map((w) => (
                                <option key={w.id} value={w.id}>
                                    {w.name} ({w.type}) -{' '}
                                    {formatIDR(Number(w.balance))}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Jumlah</label>
                        <Input
                            type="number"
                            value={form.data.amount}
                            onChange={(e) =>
                                form.setData('amount', Number(e.target.value))
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Tanggal Transfer
                        </label>
                        <Input
                            type="date"
                            value={form.data.transferred_at}
                            onChange={(e) =>
                                form.setData('transferred_at', e.target.value)
                            }
                        />
                    </div>

                    <div className="space-y-2">
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

                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            disabled={form.processing || wallets.length < 2}
                        >
                            Transfer
                        </Button>
                        <Button asChild type="button" variant="outline">
                            <Link href="/wallets">Kembali</Link>
                        </Button>
                    </div>

                    {wallets.length < 2 && (
                        <p className="text-sm text-red-600">
                            Minimal butuh 2 wallet untuk transfer.
                        </p>
                    )}
                </form>
            </div>
        </AppLayout>
    );
}

import { Head, Link, router } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { formatIDR } from '@/lib/money';
import { type BreadcrumbItem } from '@/types';

type Wallet = {
    id: number;
    type: string;
    name: string;
    account_number: string | null;
    balance: number;
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Wallets', href: '/wallets' }];

export default function WalletIndex(props: { wallets: Wallet[] }) {
    const { wallets } = props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Wallets" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h1 className="text-xl font-semibold">Dompet</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola saldo & tabungan, serta transfer antar
                            wallet.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href="/wallets/transfer">Transfer</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/wallets/create">Tambah Wallet</Link>
                        </Button>
                    </div>
                </div>

                <div className="rounded-xl border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/40">
                                <tr>
                                    <th className="p-3 text-left">Nama</th>
                                    <th className="p-3 text-left">Tipe</th>
                                    <th className="p-3 text-left">
                                        No Rekening
                                    </th>
                                    <th className="p-3 text-right">Saldo</th>
                                    <th className="p-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {wallets.length === 0 ? (
                                    <tr>
                                        <td
                                            className="p-4 text-muted-foreground"
                                            colSpan={5}
                                        >
                                            Belum ada wallet.
                                        </td>
                                    </tr>
                                ) : (
                                    wallets.map((w) => (
                                        <tr
                                            key={w.id}
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="p-3 font-medium">
                                                {w.name}
                                            </td>
                                            <td className="p-3">{w.type}</td>
                                            <td className="p-3">
                                                {w.account_number ?? '-'}
                                            </td>
                                            <td className="p-3 text-right">
                                                {formatIDR(Number(w.balance))}
                                            </td>
                                            <td className="p-3">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        <Link
                                                            href={`/wallets/${w.id}/edit`}
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
                                                                    'Hapus wallet ini?',
                                                                )
                                                            ) {
                                                                router.delete(
                                                                    `/wallets/${w.id}`,
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

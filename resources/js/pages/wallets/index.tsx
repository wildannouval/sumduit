import AppLayout from '@/layouts/app-layout';
import { formatIDR } from '@/lib/money';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

// Shadcn UI Components
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    AlertCircle,
    ArrowRightLeft,
    CheckCircle2,
    Edit2,
    Plus,
    Trash2,
} from 'lucide-react';

type Wallet = {
    id: number;
    type: string;
    name: string;
    account_number: string | null;
    balance: number;
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Wallets', href: '/wallets' }];

export default function WalletIndex({
    wallets,
    flash,
}: {
    wallets: Wallet[];
    flash: any;
}) {
    // State Management Modals
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

    // Form Hook untuk Create & Edit Wallet
    const walletForm = useForm({
        name: '',
        type: 'bank',
        account_number: '',
        balance: 0,
    });

    // Form Hook untuk Transfer
    const transferForm = useForm({
        from_wallet_id: wallets[0]?.id || 0,
        to_wallet_id: wallets[1]?.id || wallets[0]?.id || 0,
        amount: 0,
        note: '',
        transferred_at: new Date().toISOString().slice(0, 10),
    });

    // Reset forms saat modal tutup
    useEffect(() => {
        if (!isAddOpen && !isEditOpen) walletForm.reset();
    }, [isAddOpen, isEditOpen]);

    useEffect(() => {
        if (!isTransferOpen) transferForm.reset();
    }, [isTransferOpen]);

    // Handlers
    const openEdit = (wallet: Wallet) => {
        setSelectedWallet(wallet);
        walletForm.setData({
            name: wallet.name,
            type: wallet.type,
            account_number: wallet.account_number ?? '',
            balance: Number(wallet.balance),
        });
        setIsEditOpen(true);
    };

    const submitWallet = (e: React.FormEvent) => {
        e.preventDefault();
        if (isAddOpen) {
            walletForm.post('/wallets', {
                onSuccess: () => setIsAddOpen(false),
            });
        } else {
            walletForm.put(`/wallets/${selectedWallet?.id}`, {
                onSuccess: () => setIsEditOpen(false),
            });
        }
    };

    const submitTransfer = (e: React.FormEvent) => {
        e.preventDefault();
        transferForm.post('/wallets/transfer', {
            onSuccess: () => setIsTransferOpen(false),
        });
    };

    const confirmDelete = () => {
        if (selectedWallet) {
            router.delete(`/wallets/${selectedWallet.id}`, {
                onSuccess: () => setIsDeleteOpen(false),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Wallets" />

            <div className="flex flex-col gap-6 p-6">
                {/* Section Alert Notification */}
                <div className="space-y-3">
                    {flash.success && (
                        <Alert className="animate-in border-emerald-200 bg-emerald-50 text-emerald-800 shadow-sm fade-in slide-in-from-top-2">
                            <CheckCircle2 className="h-4 w-4 stroke-emerald-600" />
                            <AlertTitle className="font-bold">
                                Berhasil
                            </AlertTitle>
                            <AlertDescription>{flash.success}</AlertDescription>
                        </Alert>
                    )}
                    {flash.error && (
                        <Alert
                            variant="destructive"
                            className="animate-in shadow-sm fade-in slide-in-from-top-2"
                        >
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle className="font-bold">Gagal</AlertTitle>
                            <AlertDescription>{flash.error}</AlertDescription>
                        </Alert>
                    )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Daftar Dompet
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola aset likuid dan tabungan Anda.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsTransferOpen(true)}
                            disabled={wallets.length < 2}
                        >
                            <ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer
                        </Button>
                        <Button onClick={() => setIsAddOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Tambah Wallet
                        </Button>
                    </div>
                </div>

                {/* Table Data Wallet */}
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50 text-left">
                            <tr className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                <th className="p-4">Nama Dompet</th>
                                <th className="p-4 text-center">Tipe</th>
                                <th className="p-4 text-right">Saldo</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {wallets.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="p-12 text-center text-muted-foreground italic"
                                    >
                                        Belum ada wallet.
                                    </td>
                                </tr>
                            ) : (
                                wallets.map((w) => (
                                    <tr
                                        key={w.id}
                                        className="transition-colors hover:bg-muted/20"
                                    >
                                        <td className="p-4 font-semibold">
                                            <div>{w.name}</div>
                                            <div className="text-[10px] font-normal text-muted-foreground">
                                                {w.account_number ??
                                                    'No Rekening -'}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold tracking-tight text-secondary-foreground uppercase">
                                                {w.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-black tracking-tight text-blue-600">
                                            {formatIDR(Number(w.balance))}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8"
                                                    onClick={() => openEdit(w)}
                                                >
                                                    <Edit2 className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-red-500 hover:text-red-600"
                                                    onClick={() => {
                                                        setSelectedWallet(w);
                                                        setIsDeleteOpen(true);
                                                    }}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
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

            {/* MODAL: ADD & EDIT WALLET */}
            <Dialog
                open={isAddOpen || isEditOpen}
                onOpenChange={(val) => {
                    if (!val) {
                        setIsAddOpen(false);
                        setIsEditOpen(false);
                    }
                }}
            >
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>
                            {isAddOpen ? 'Tambah Dompet' : 'Ubah Dompet'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitWallet} className="space-y-4 pt-2">
                        <div className="grid gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black tracking-widest uppercase opacity-60">
                                    Tipe
                                </label>
                                <select
                                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
                                    value={walletForm.data.type}
                                    onChange={(e) =>
                                        walletForm.setData(
                                            'type',
                                            e.target.value,
                                        )
                                    }
                                >
                                    <option value="cash">Cash</option>
                                    <option value="bank">Bank</option>
                                    <option value="ewallet">E-Wallet</option>
                                    <option value="savings">Savings</option>
                                    <option value="emergency">Emergency</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black tracking-widest uppercase opacity-60">
                                    Nama Dompet
                                </label>
                                <Input
                                    placeholder="Contoh: BCA Utama"
                                    value={walletForm.data.name}
                                    onChange={(e) =>
                                        walletForm.setData(
                                            'name',
                                            e.target.value,
                                        )
                                    }
                                />
                                {walletForm.errors.name && (
                                    <p className="text-[10px] font-bold text-red-500">
                                        {walletForm.errors.name}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black tracking-widest uppercase opacity-60">
                                    Saldo Awal
                                </label>
                                <Input
                                    type="number"
                                    value={walletForm.data.balance}
                                    onChange={(e) =>
                                        walletForm.setData(
                                            'balance',
                                            Number(e.target.value),
                                        )
                                    }
                                />
                                {walletForm.errors.balance && (
                                    <p className="text-[10px] font-bold text-red-500">
                                        {walletForm.errors.balance}
                                    </p>
                                )}
                            </div>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button
                                type="submit"
                                disabled={walletForm.processing}
                                className="w-full"
                            >
                                Simpan Perubahan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* MODAL: TRANSFER SALDO */}
            <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Transfer Antar Dompet</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitTransfer} className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black tracking-widest uppercase opacity-60">
                                    Dari
                                </label>
                                <select
                                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                    value={transferForm.data.from_wallet_id}
                                    onChange={(e) =>
                                        transferForm.setData(
                                            'from_wallet_id',
                                            Number(e.target.value),
                                        )
                                    }
                                >
                                    {wallets.map((w) => (
                                        <option key={w.id} value={w.id}>
                                            {w.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black tracking-widest uppercase opacity-60">
                                    Ke
                                </label>
                                <select
                                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                    value={transferForm.data.to_wallet_id}
                                    onChange={(e) =>
                                        transferForm.setData(
                                            'to_wallet_id',
                                            Number(e.target.value),
                                        )
                                    }
                                >
                                    {wallets.map((w) => (
                                        <option key={w.id} value={w.id}>
                                            {w.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black tracking-widest uppercase opacity-60">
                                Jumlah
                            </label>
                            <Input
                                type="number"
                                value={transferForm.data.amount}
                                onChange={(e) =>
                                    transferForm.setData(
                                        'amount',
                                        Number(e.target.value),
                                    )
                                }
                            />
                            {transferForm.errors.amount && (
                                <p className="text-[10px] font-bold text-red-500">
                                    {transferForm.errors.amount}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black tracking-widest uppercase opacity-60">
                                Tanggal
                            </label>
                            <Input
                                type="date"
                                value={transferForm.data.transferred_at}
                                onChange={(e) =>
                                    transferForm.setData(
                                        'transferred_at',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                        <DialogFooter className="mt-4">
                            <Button
                                type="submit"
                                disabled={transferForm.processing}
                                className="w-full font-bold"
                            >
                                Proses Transfer
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ALERT DIALOG: DELETE */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus dompet?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini permanen. Seluruh riwayat saldo pada
                            dompet <strong>{selectedWallet?.name}</strong> akan
                            hilang.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}

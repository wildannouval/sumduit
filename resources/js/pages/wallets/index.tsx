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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatIDR } from '@/lib/money';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import {
    ArrowRightLeft,
    Banknote,
    CheckCircle2,
    CreditCard,
    Edit2,
    Inbox,
    MoreHorizontal,
    PiggyBank,
    Plus,
    Trash2,
    Wallet as WalletIcon,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

type Wallet = {
    id: number;
    type: string;
    name: string;
    account_number: string | null;
    balance: number;
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dompet', href: '/wallets' }];

export default function WalletIndex({
    wallets,
    flash,
}: {
    wallets: Wallet[];
    flash: any;
}) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

    const walletForm = useForm({
        name: '',
        type: 'bank',
        account_number: '',
        balance: 0,
    });

    const transferForm = useForm({
        from_wallet_id: (wallets[0]?.id || '') as string | number,
        to_wallet_id: (wallets[1]?.id || wallets[0]?.id || '') as
            | string
            | number,
        amount: 0,
        note: '',
        transferred_at: new Date().toISOString().slice(0, 10),
    });

    useEffect(() => {
        if (!isAddOpen && !isEditOpen) walletForm.reset();
    }, [isAddOpen, isEditOpen]);

    useEffect(() => {
        if (!isTransferOpen) transferForm.reset();
    }, [isTransferOpen]);

    const totalBalance = wallets.reduce(
        (acc, curr) => acc + Number(curr.balance),
        0,
    );

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
        const url = isAddOpen ? '/wallets' : `/wallets/${selectedWallet?.id}`;
        const method = isAddOpen ? 'post' : 'put';
        router[method](url, walletForm.data as any, {
            onSuccess: () => {
                setIsAddOpen(false);
                setIsEditOpen(false);
            },
        });
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
            <Head title="Dompet & Saldo" />

            <div className="flex flex-col gap-6 p-6 font-sans">
                {/* 1. Notifications */}
                {flash.success && (
                    <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/20">
                        <CheckCircle2 className="h-4 w-4 stroke-emerald-600" />
                        <AlertTitle className="text-xs font-black tracking-widest text-emerald-700 uppercase">
                            Berhasil
                        </AlertTitle>
                        <AlertDescription className="text-xs font-medium">
                            {flash.success}
                        </AlertDescription>
                    </Alert>
                )}

                {/* 2. Top Summary Section */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="relative overflow-hidden border-none bg-slate-950 text-white shadow-xl ring-1 ring-border md:col-span-2 dark:bg-slate-900">
                        <div className="absolute top-[-10px] right-[-10px] rotate-12 opacity-10">
                            <WalletIcon size={160} />
                        </div>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                                Total Saldo Terkonsolidasi
                            </CardDescription>
                            <CardTitle className="text-4xl font-black tracking-tighter tabular-nums">
                                {formatIDR(totalBalance)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                                Tersebar di {wallets.length} Akun Keuangan
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className="group flex cursor-pointer flex-col items-center justify-center border-none bg-card p-6 text-center shadow-sm ring-1 ring-border transition-all hover:ring-primary/50"
                        onClick={() => setIsAddOpen(true)}
                    >
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                            <Plus size={24} strokeWidth={3} />
                        </div>
                        <h3 className="text-sm font-black tracking-tight uppercase">
                            Tambah Dompet
                        </h3>
                        <p className="mt-1 text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                            Input Aset Likuid Baru
                        </p>
                    </Card>
                </div>

                {/* 3. List Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-black tracking-tighter uppercase">
                            Daftar Akun
                        </h2>
                        <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-60">
                            Rincian saldo per sumber dana
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setIsTransferOpen(true)}
                        disabled={wallets.length < 2}
                        className="h-10 px-6 text-[10px] font-black tracking-widest uppercase shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600"
                    >
                        <ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer
                        Antar Dompet
                    </Button>
                </div>

                {/* 4. Data Table */}
                <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="py-4 text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Identitas Dompet
                                    </TableHead>
                                    <TableHead className="py-4 text-center text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Tipe Akun
                                    </TableHead>
                                    <TableHead className="py-4 text-right text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Saldo Saat Ini
                                    </TableHead>
                                    <TableHead className="py-4 text-right text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {wallets.length > 0 ? (
                                    wallets.map((w) => (
                                        <TableRow
                                            key={w.id}
                                            className="group transition-colors hover:bg-muted/30"
                                        >
                                            <TableCell className="py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                                        {getWalletIcon(w.type)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-black tracking-tight uppercase">
                                                            {w.name}
                                                        </div>
                                                        <div className="mt-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase opacity-60">
                                                            {w.account_number ||
                                                                'Internal Account'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant="outline"
                                                    className="h-5 border-muted-foreground/20 px-2 text-[9px] font-black tracking-tighter text-muted-foreground uppercase"
                                                >
                                                    {w.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right text-base font-black text-primary tabular-nums">
                                                {formatIDR(Number(w.balance))}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 opacity-50 group-hover:opacity-100"
                                                        >
                                                            <MoreHorizontal
                                                                size={16}
                                                            />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="w-40 rounded-xl border-none shadow-xl ring-1 ring-border"
                                                    >
                                                        <DropdownMenuLabel className="text-[10px] font-black tracking-widest uppercase opacity-50">
                                                            Opsi Dompet
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                openEdit(w)
                                                            }
                                                            className="cursor-pointer text-xs font-bold uppercase"
                                                        >
                                                            <Edit2
                                                                size={14}
                                                                className="mr-2"
                                                            />{' '}
                                                            Ubah Data
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedWallet(
                                                                    w,
                                                                );
                                                                setIsDeleteOpen(
                                                                    true,
                                                                );
                                                            }}
                                                            className="cursor-pointer text-xs font-bold text-red-600 uppercase"
                                                        >
                                                            <Trash2
                                                                size={14}
                                                                className="mr-2"
                                                            />{' '}
                                                            Hapus Akun
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="h-48 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center opacity-30">
                                                <Inbox
                                                    size={48}
                                                    className="mb-2"
                                                />
                                                <p className="text-xs font-black tracking-widest text-muted-foreground uppercase">
                                                    Data Dompet Kosong
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* MODAL: ADD & EDIT */}
            <Dialog
                open={isAddOpen || isEditOpen}
                onOpenChange={(v) => {
                    if (!v) {
                        setIsAddOpen(false);
                        setIsEditOpen(false);
                    }
                }}
            >
                <DialogContent className="overflow-hidden border-none p-0 shadow-2xl sm:max-w-[450px]">
                    <DialogHeader className="bg-slate-950 p-8 text-white">
                        <DialogTitle className="flex items-center gap-2 text-2xl font-black tracking-tighter uppercase">
                            <WalletIcon size={24} className="text-primary" />{' '}
                            {isAddOpen ? 'Tambah Dompet' : 'Ubah Detail Dompet'}
                        </DialogTitle>
                        <DialogDescription className="text-xs font-bold tracking-widest text-slate-400 uppercase opacity-80">
                            Konfigurasi sumber dana Anda.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={submitWallet}
                        className="space-y-6 bg-card p-8"
                    >
                        <div className="space-y-2">
                            <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                Nama Dompet / Bank
                            </Label>
                            <Input
                                placeholder="Misal: BCA Utama, Wallet Digital"
                                value={walletForm.data.name}
                                onChange={(e) =>
                                    walletForm.setData('name', e.target.value)
                                }
                                className="font-bold"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                    Tipe Akun
                                </Label>
                                <Select
                                    value={walletForm.data.type}
                                    onValueChange={(v) =>
                                        walletForm.setData('type', v)
                                    }
                                >
                                    <SelectTrigger className="h-10 text-xs font-bold text-foreground uppercase">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            value="bank"
                                            className="text-xs font-bold tracking-tighter uppercase"
                                        >
                                            Bank Account
                                        </SelectItem>
                                        <SelectItem
                                            value="cash"
                                            className="text-xs font-bold tracking-tighter uppercase"
                                        >
                                            Cash / Tunai
                                        </SelectItem>
                                        <SelectItem
                                            value="ewallet"
                                            className="text-xs font-bold tracking-tighter uppercase"
                                        >
                                            E-Wallet
                                        </SelectItem>
                                        <SelectItem
                                            value="savings"
                                            className="text-xs font-bold tracking-tighter uppercase"
                                        >
                                            Tabungan
                                        </SelectItem>
                                        <SelectItem
                                            value="emergency"
                                            className="text-xs font-bold tracking-tighter text-blue-600 uppercase"
                                        >
                                            Dana Darurat
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                    Saldo Saat Ini
                                </Label>
                                <Input
                                    type="number"
                                    className="h-10 font-black tabular-nums"
                                    value={walletForm.data.balance}
                                    onChange={(e) =>
                                        walletForm.setData(
                                            'balance',
                                            Number(e.target.value),
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                Nomor Rekening (Opsional)
                            </Label>
                            <Input
                                placeholder="000-000-000-00"
                                value={walletForm.data.account_number}
                                onChange={(e) =>
                                    walletForm.setData(
                                        'account_number',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="submit"
                                disabled={walletForm.processing}
                                className="h-12 w-full text-xs font-black tracking-[0.2em] uppercase shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
                            >
                                Simpan Dompet
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* MODAL: TRANSFER BALANCES */}
            <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
                <DialogContent className="overflow-hidden border-none p-0 shadow-2xl sm:max-w-[420px]">
                    <DialogHeader className="bg-slate-950 p-8 text-white">
                        <DialogTitle className="flex items-center gap-2 text-2xl font-black tracking-tighter uppercase">
                            <ArrowRightLeft
                                size={24}
                                className="text-primary"
                            />{' '}
                            Transfer Dana
                        </DialogTitle>
                        <DialogDescription className="text-xs font-bold tracking-widest text-slate-400 uppercase opacity-80">
                            Pindah saldo antar akun secara instan.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={submitTransfer}
                        className="space-y-6 bg-card p-8"
                    >
                        <div className="grid grid-cols-1 gap-6 rounded-2xl bg-muted/40 p-4 ring-1 ring-border">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                    Dari Dompet
                                </Label>
                                <Select
                                    value={String(
                                        transferForm.data.from_wallet_id,
                                    )}
                                    onValueChange={(v) =>
                                        transferForm.setData(
                                            'from_wallet_id',
                                            Number(v),
                                        )
                                    }
                                >
                                    <SelectTrigger className="h-10 border-none bg-background text-xs font-black uppercase shadow-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {wallets.map((w) => (
                                            <SelectItem
                                                key={w.id}
                                                value={String(w.id)}
                                                className="text-xs font-bold tracking-tighter uppercase"
                                            >
                                                {w.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="relative z-10 -my-3 flex justify-center">
                                <div className="rounded-full bg-primary p-1.5 text-white shadow-md ring-4 ring-card">
                                    <ArrowRightLeft
                                        size={16}
                                        className="rotate-90"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                    Ke Tujuan
                                </Label>
                                <Select
                                    value={String(
                                        transferForm.data.to_wallet_id,
                                    )}
                                    onValueChange={(v) =>
                                        transferForm.setData(
                                            'to_wallet_id',
                                            Number(v),
                                        )
                                    }
                                >
                                    <SelectTrigger className="h-10 border-none bg-background text-xs font-black text-blue-600 uppercase shadow-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {wallets.map((w) => (
                                            <SelectItem
                                                key={w.id}
                                                value={String(w.id)}
                                                className="text-xs font-bold tracking-tighter uppercase"
                                            >
                                                {w.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                    Nominal Transfer (Rp)
                                </Label>
                                <Input
                                    type="number"
                                    className="h-12 border-2 text-xl font-black tabular-nums focus-visible:ring-primary"
                                    value={transferForm.data.amount}
                                    onChange={(e) =>
                                        transferForm.setData(
                                            'amount',
                                            Number(e.target.value),
                                        )
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                    Tanggal & Catatan
                                </Label>
                                <div className="grid gap-2">
                                    <Input
                                        type="date"
                                        value={transferForm.data.transferred_at}
                                        onChange={(e) =>
                                            transferForm.setData(
                                                'transferred_at',
                                                e.target.value,
                                            )
                                        }
                                        className="h-10 font-bold"
                                    />
                                    <Input
                                        placeholder="Alasan transfer (opsional)"
                                        value={transferForm.data.note}
                                        onChange={(e) =>
                                            transferForm.setData(
                                                'note',
                                                e.target.value,
                                            )
                                        }
                                        className="h-10 text-sm font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={transferForm.processing}
                                className="h-12 w-full text-xs font-black tracking-[0.2em] uppercase shadow-lg"
                            >
                                Eksekusi Transfer
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* MODAL: DELETE */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-black tracking-tight uppercase">
                            Hapus akun dompet?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm leading-relaxed font-medium italic opacity-70">
                            Seluruh histori pada akun ini akan ikut terdampak.
                            Pastikan Anda sudah memindahkan saldo jika masih ada
                            sisa dana.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel className="h-10 px-6 text-[10px] font-bold tracking-widest uppercase">
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="h-10 bg-red-600 px-6 text-[10px] font-bold tracking-widest uppercase hover:bg-red-700"
                        >
                            Ya, Hapus Dompet
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}

function getWalletIcon(type: string) {
    switch (type) {
        case 'bank':
            return <CreditCard size={18} />;
        case 'cash':
            return <Banknote size={18} />;
        case 'ewallet':
            return <WalletIcon size={18} />;
        case 'savings':
            return <PiggyBank size={18} />;
        case 'emergency':
            return <CheckCircle2 size={18} className="text-emerald-500" />;
        default:
            return <WalletIcon size={18} />;
    }
}

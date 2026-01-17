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
    PlusCircle,
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
        from_wallet_id: wallets[0]?.id || 0,
        to_wallet_id: wallets[1]?.id || wallets[0]?.id || 0,
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
            <Head title="Dompet" />

            <div className="flex flex-col gap-6 p-6">
                {/* 1. Flash Message */}
                {flash.success && (
                    <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/20">
                        <CheckCircle2 className="h-4 w-4 stroke-emerald-600" />
                        <AlertTitle className="font-bold">Berhasil</AlertTitle>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                {/* 2. Top Summary Card */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="relative overflow-hidden border-none bg-slate-950 text-white shadow-sm ring-1 ring-border md:col-span-2 dark:bg-slate-900">
                        <div className="absolute top-[-20px] right-[-20px] opacity-10">
                            <WalletIcon size={180} />
                        </div>
                        <CardHeader>
                            <CardDescription className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                Total Saldo Terkonsolidasi
                            </CardDescription>
                            <CardTitle className="text-4xl font-black">
                                {formatIDR(totalBalance)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-slate-400">
                                Dari {wallets.length} dompet aktif Anda.
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className="group flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-none bg-muted/20 p-6 text-center shadow-sm ring-1 ring-border transition-all hover:ring-primary"
                        onClick={() => setIsAddOpen(true)}
                    >
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary group-hover:text-white">
                            <Plus size={24} />
                        </div>
                        <h3 className="text-sm font-bold tracking-tight uppercase">
                            Tambah Dompet
                        </h3>
                        <p className="mt-1 text-[10px] text-muted-foreground uppercase">
                            Input aset likuid baru
                        </p>
                    </Card>
                </div>

                {/* 3. Actions Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black tracking-tighter uppercase">
                            Daftar Dompet
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Rincian saldo per akun keuangan.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsTransferOpen(true)}
                        disabled={wallets.length < 2}
                        className="h-9 px-4 text-[10px] font-bold tracking-widest uppercase"
                    >
                        <ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer
                        Antar Dompet
                    </Button>
                </div>

                {/* 4. Table Section */}
                <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="py-3 text-[10px] font-black tracking-widest uppercase">
                                        Nama Dompet
                                    </TableHead>
                                    <TableHead className="py-3 text-center text-[10px] font-black tracking-widest uppercase">
                                        Tipe
                                    </TableHead>
                                    <TableHead className="py-3 text-right text-[10px] font-black tracking-widest uppercase">
                                        Saldo
                                    </TableHead>
                                    <TableHead className="py-3 text-right text-[10px] font-black tracking-widest uppercase">
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
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/5 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                                        {getWalletIcon(w.type)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm leading-none font-bold">
                                                            {w.name}
                                                        </div>
                                                        <div className="mt-1 text-[10px] font-medium tracking-tight text-muted-foreground uppercase">
                                                            {w.account_number ||
                                                                'Tanpa Nomor Rekening'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant="outline"
                                                    className="h-5 px-2 text-[9px] font-bold tracking-tighter uppercase"
                                                >
                                                    {w.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-black text-primary">
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
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel className="text-[10px] font-black uppercase">
                                                            Manajemen
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                openEdit(w)
                                                            }
                                                        >
                                                            <Edit2 className="mr-2 h-3.5 w-3.5" />{' '}
                                                            Ubah
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => {
                                                                setSelectedWallet(
                                                                    w,
                                                                );
                                                                setIsDeleteOpen(
                                                                    true,
                                                                );
                                                            }}
                                                        >
                                                            <Trash2 className="mr-2 h-3.5 w-3.5" />{' '}
                                                            Hapus
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
                                            <div className="flex flex-col items-center justify-center text-muted-foreground opacity-30">
                                                <Inbox
                                                    size={48}
                                                    className="mb-2"
                                                />
                                                <p className="text-sm font-bold tracking-widest uppercase">
                                                    Belum ada dompet
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
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-black tracking-tighter uppercase">
                            {isAddOpen ? (
                                <PlusCircle className="h-5 w-5 text-primary" />
                            ) : (
                                <Edit2 className="h-5 w-5 text-primary" />
                            )}
                            {isAddOpen ? 'Tambah Dompet' : 'Ubah Dompet'}
                        </DialogTitle>
                        <DialogDescription className="text-xs tracking-tight uppercase">
                            Atur sumber dana dan simpanan Anda.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitWallet} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                Nama Akun / Dompet
                            </Label>
                            <Input
                                placeholder="Misal: BCA Utama, Jago Tabungan"
                                value={walletForm.data.name}
                                onChange={(e) =>
                                    walletForm.setData('name', e.target.value)
                                }
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                    Tipe
                                </Label>
                                <Select
                                    value={walletForm.data.type}
                                    onValueChange={(v) =>
                                        walletForm.setData('type', v)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bank">
                                            Bank Account
                                        </SelectItem>
                                        <SelectItem value="cash">
                                            Cash / Tunai
                                        </SelectItem>
                                        <SelectItem value="ewallet">
                                            E-Wallet
                                        </SelectItem>
                                        <SelectItem value="savings">
                                            Tabungan
                                        </SelectItem>
                                        <SelectItem value="emergency">
                                            Dana Darurat
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                    Saldo Saat Ini
                                </Label>
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
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                Nomor Rekening (Opsional)
                            </Label>
                            <Input
                                placeholder="000-000-000"
                                value={walletForm.data.account_number}
                                onChange={(e) =>
                                    walletForm.setData(
                                        'account_number',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={walletForm.processing}
                                className="h-11 w-full text-xs font-black tracking-widest uppercase"
                            >
                                {walletForm.processing
                                    ? 'Memproses...'
                                    : 'Simpan Dompet'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* MODAL: TRANSFER */}
            <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black tracking-tighter uppercase">
                            Transfer Saldo
                        </DialogTitle>
                        <DialogDescription className="text-xs tracking-tight uppercase">
                            Pindahkan dana antar dompet tanpa mencatat
                            pengeluaran.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitTransfer} className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 gap-4 rounded-lg bg-muted/30 p-3 ring-1 ring-border">
                            <div className="space-y-2">
                                <Label className="text-[9px] font-black text-muted-foreground uppercase">
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
                                    <SelectTrigger className="bg-background">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {wallets.map((w) => (
                                            <SelectItem
                                                key={w.id}
                                                value={String(w.id)}
                                            >
                                                {w.name} (
                                                {formatIDR(Number(w.balance))})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="relative z-10 -my-2 flex justify-center">
                                <div className="rounded-full bg-primary p-1.5 text-white shadow-lg">
                                    <ArrowRightLeft
                                        size={14}
                                        className="rotate-90"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[9px] font-black text-muted-foreground uppercase">
                                    Ke Dompet
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
                                    <SelectTrigger className="bg-background">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {wallets.map((w) => (
                                            <SelectItem
                                                key={w.id}
                                                value={String(w.id)}
                                            >
                                                {w.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                Jumlah Transfer
                            </Label>
                            <Input
                                type="number"
                                className="text-lg font-bold"
                                value={transferForm.data.amount}
                                onChange={(e) =>
                                    transferForm.setData(
                                        'amount',
                                        Number(e.target.value),
                                    )
                                }
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={transferForm.processing}
                                className="h-11 w-full text-xs font-black tracking-widest uppercase shadow-lg"
                            >
                                Proses Transfer
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus dompet ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Seluruh data saldo akan terhapus. Pastikan Anda
                            sudah memindahkan saldo ke dompet lain jika
                            diperlukan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 font-bold hover:bg-red-700"
                        >
                            Hapus
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
        default:
            return <WalletIcon size={18} />;
    }
}

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
import { Progress } from '@/components/ui/progress';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { formatIDR } from '@/lib/money';
import { Head, router, useForm } from '@inertiajs/react';
import {
    Calendar, // Tambahkan ini untuk memperbaiki error "Calendar is not defined"
    CheckCircle2,
    HandCoins,
    History,
    Inbox,
    MoreHorizontal,
    PlusCircle,
    Search,
    Trash2,
    User,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

const breadcrumbs = [{ title: 'Hutang & Piutang', href: '/debts' }];

export default function DebtIndex({ debts = [], wallets = [], flash }: any) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isPayOpen, setIsPayOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedDebt, setSelectedDebt] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    const addForm = useForm({
        person_name: '',
        type: 'debt' as 'debt' | 'credit',
        amount: 0,
        due_date: '',
        note: '',
    });

    const payForm = useForm({
        amount: 0,
        wallet_id: (wallets[0]?.id || '') as number | string,
    });

    useEffect(() => {
        if (!isAddOpen) addForm.reset();
        if (!isPayOpen) payForm.reset();
    }, [isAddOpen, isPayOpen]);

    const openPay = (debt: any) => {
        setSelectedDebt(debt);
        payForm.setData({
            amount: debt.remaining_amount,
            wallet_id: wallets[0]?.id || '',
        });
        setIsPayOpen(true);
    };

    const submitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post('/debts', {
            onSuccess: () => {
                setIsAddOpen(false);
            },
        });
    };

    const submitPay = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDebt) return;
        payForm.post(`/debts/${selectedDebt.id}/pay`, {
            onSuccess: () => setIsPayOpen(false),
        });
    };

    const confirmDelete = () => {
        if (!selectedDebt) return;
        router.delete(`/debts/${selectedDebt.id}`, {
            onSuccess: () => setIsDeleteOpen(false),
        });
    };

    // --- Filter Logic ---
    const filteredDebts = debts.filter((d: any) => {
        const matchesSearch = d.person_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'all' || d.type === activeTab;
        return matchesSearch && matchesTab;
    });

    const totalDebt = debts
        .filter((d: any) => d.type === 'debt' && d.status === 'unpaid')
        .reduce((acc: number, d: any) => acc + Number(d.remaining_amount), 0);
    const totalCredit = debts
        .filter((d: any) => d.type === 'credit' && d.status === 'unpaid')
        .reduce((acc: number, d: any) => acc + Number(d.remaining_amount), 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hutang & Piutang" />

            <div className="flex flex-col gap-6 p-6">
                {/* 1. Notifications */}
                {flash?.success && (
                    <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/20">
                        <CheckCircle2 className="h-4 w-4 stroke-emerald-600" />
                        <AlertTitle className="text-xs font-bold tracking-widest uppercase">
                            Berhasil
                        </AlertTitle>
                        <AlertDescription className="text-xs">
                            {flash.success}
                        </AlertDescription>
                    </Alert>
                )}

                {/* 2. Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight uppercase">
                            <HandCoins className="h-6 w-6 text-primary" />{' '}
                            Pinjaman
                        </h1>
                        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                            Lacak kewajiban dan tagihan Anda.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="h-10 px-6 text-xs font-bold tracking-widest uppercase shadow-lg"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Catat Baru
                    </Button>
                </div>

                {/* 3. Summary Section */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card className="relative overflow-hidden border-none bg-red-50 shadow-sm ring-1 ring-red-100 dark:bg-red-950/10 dark:ring-red-900/30">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] font-black tracking-widest text-red-600 uppercase opacity-70 dark:text-red-400">
                                Total Hutang (Kewajiban Saya)
                            </CardDescription>
                            <CardTitle className="text-3xl font-black text-red-700 dark:text-red-300">
                                {formatIDR(totalDebt)}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="relative overflow-hidden border-none bg-blue-50 shadow-sm ring-1 ring-blue-100 dark:bg-blue-950/10 dark:ring-blue-900/30">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] font-black tracking-widest text-blue-600 uppercase opacity-70 dark:text-blue-400">
                                Total Piutang (Tagihan Ke Orang)
                            </CardDescription>
                            <CardTitle className="text-3xl font-black text-blue-700 dark:text-blue-300">
                                {formatIDR(totalCredit)}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* 4. Filter Toolbar */}
                <Tabs
                    defaultValue="all"
                    className="w-full"
                    onValueChange={setActiveTab}
                >
                    <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
                            <TabsTrigger
                                value="all"
                                className="text-xs font-bold tracking-tighter uppercase"
                            >
                                Semua
                            </TabsTrigger>
                            <TabsTrigger
                                value="debt"
                                className="text-xs font-bold tracking-tighter uppercase"
                            >
                                Hutang
                            </TabsTrigger>
                            <TabsTrigger
                                value="credit"
                                className="text-xs font-bold tracking-tighter uppercase"
                            >
                                Piutang
                            </TabsTrigger>
                        </TabsList>

                        <div className="relative w-full md:w-[300px]">
                            <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama orang..."
                                className="h-9 bg-background pl-9 text-xs"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* 5. Table Card */}
                    <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/50 text-[10px] font-black tracking-widest uppercase">
                                    <TableRow>
                                        <TableHead className="px-4 py-3 text-muted-foreground">
                                            Pihak Terkait
                                        </TableHead>
                                        <TableHead className="py-3 text-center text-muted-foreground">
                                            Jenis
                                        </TableHead>
                                        <TableHead className="py-3 text-muted-foreground">
                                            Progress Pelunasan
                                        </TableHead>
                                        <TableHead className="py-3 text-right text-muted-foreground">
                                            Sisa Tagihan
                                        </TableHead>
                                        <TableHead className="py-3 text-right text-muted-foreground">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDebts.length > 0 ? (
                                        filteredDebts.map((d: any) => {
                                            const paidAmount =
                                                d.amount - d.remaining_amount;
                                            const progress =
                                                (paidAmount / d.amount) * 100;
                                            return (
                                                <TableRow
                                                    key={d.id}
                                                    className="group transition-colors hover:bg-muted/30"
                                                >
                                                    <TableCell className="px-4 py-4">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-2 text-sm leading-none font-bold">
                                                                <User
                                                                    size={12}
                                                                    className="text-primary opacity-40"
                                                                />{' '}
                                                                {d.person_name}
                                                            </div>
                                                            <div className="mt-1.5 flex items-center gap-3">
                                                                <span className="flex items-center gap-1 text-[9px] font-bold tracking-tight text-muted-foreground uppercase">
                                                                    <Calendar
                                                                        size={
                                                                            11
                                                                        }
                                                                    />{' '}
                                                                    JT:{' '}
                                                                    {d.due_date ||
                                                                        'N/A'}
                                                                </span>
                                                                {d.status ===
                                                                    'paid' && (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="h-4 border-emerald-500 bg-emerald-50 px-1 text-[8px] font-black text-emerald-600 uppercase"
                                                                    >
                                                                        Lunas
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge
                                                            variant={
                                                                d.type ===
                                                                'debt'
                                                                    ? 'destructive'
                                                                    : 'outline'
                                                            }
                                                            className={`h-5 px-2 text-[9px] font-black tracking-tighter uppercase ${d.type === 'credit' ? 'border-blue-500 bg-blue-50 text-blue-600' : ''}`}
                                                        >
                                                            {d.type === 'debt'
                                                                ? 'Hutang'
                                                                : 'Piutang'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="min-w-[180px]">
                                                        <div className="flex flex-col gap-1.5">
                                                            <div className="flex items-center justify-between text-[9px] font-black tracking-tighter uppercase opacity-60">
                                                                <span>
                                                                    Terbayar:{' '}
                                                                    {formatIDR(
                                                                        paidAmount,
                                                                    )}
                                                                </span>
                                                                <span>
                                                                    {Math.round(
                                                                        progress,
                                                                    )}
                                                                    %
                                                                </span>
                                                            </div>
                                                            <Progress
                                                                value={progress}
                                                                className="h-1.5"
                                                                indicatorClassName={
                                                                    d.type ===
                                                                    'debt'
                                                                        ? 'bg-red-500'
                                                                        : 'bg-blue-500'
                                                                }
                                                            />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell
                                                        className={`text-right font-black ${d.remaining_amount > 0 ? 'text-foreground' : 'text-emerald-600'}`}
                                                    >
                                                        {d.remaining_amount ===
                                                        0
                                                            ? 'LUNAS'
                                                            : formatIDR(
                                                                  d.remaining_amount,
                                                              )}
                                                    </TableCell>
                                                    <TableCell className="px-4 text-right">
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
                                                                <DropdownMenuLabel className="text-[10px] font-black tracking-widest uppercase">
                                                                    Pinjaman
                                                                </DropdownMenuLabel>
                                                                {d.status ===
                                                                    'unpaid' && (
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            openPay(
                                                                                d,
                                                                            )
                                                                        }
                                                                        className="font-bold text-primary"
                                                                    >
                                                                        <History className="mr-2 h-3.5 w-3.5" />{' '}
                                                                        Catat
                                                                        Bayar
                                                                    </DropdownMenuItem>
                                                                )}
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    className="font-medium text-red-600"
                                                                    onClick={() => {
                                                                        setSelectedDebt(
                                                                            d,
                                                                        );
                                                                        setIsDeleteOpen(
                                                                            true,
                                                                        );
                                                                    }}
                                                                >
                                                                    <Trash2 className="mr-2 h-3.5 w-3.5" />{' '}
                                                                    Hapus
                                                                    Catatan
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="h-48 text-center text-muted-foreground"
                                            >
                                                <div className="flex flex-col items-center justify-center opacity-30">
                                                    <Inbox
                                                        size={48}
                                                        className="mb-2"
                                                    />
                                                    <p className="text-sm font-bold tracking-widest uppercase">
                                                        Tidak ada catatan
                                                        ditemukan
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Tabs>
            </div>

            {/* MODAL: CATAT BAYAR */}
            <Dialog
                open={isPayOpen}
                onOpenChange={(v) => {
                    if (!v) setIsPayOpen(false);
                }}
            >
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black tracking-tighter uppercase">
                            Catat Pembayaran
                        </DialogTitle>
                        <DialogDescription className="text-xs font-medium tracking-tight uppercase">
                            Cicilan untuk: {selectedDebt?.person_name}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitPay} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                Nominal Bayar (Rp)
                            </Label>
                            <Input
                                type="number"
                                className="h-12 text-lg font-black"
                                value={payForm.data.amount}
                                onChange={(e) =>
                                    payForm.setData(
                                        'amount',
                                        Number(e.target.value),
                                    )
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                Gunakan Sumber Dana
                            </Label>
                            <Select
                                value={String(payForm.data.wallet_id)}
                                onValueChange={(v) =>
                                    payForm.setData('wallet_id', Number(v))
                                }
                            >
                                <SelectTrigger className="h-11 font-bold">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {wallets.map((w: any) => (
                                        <SelectItem
                                            key={w.id}
                                            value={String(w.id)}
                                        >
                                            {w.name} ({formatIDR(w.balance)})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button
                                type="submit"
                                disabled={payForm.processing}
                                className="h-12 w-full text-xs font-black tracking-widest uppercase"
                            >
                                Konfirmasi Pembayaran
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* MODAL: TAMBAH CATATAN */}
            <Dialog
                open={isAddOpen}
                onOpenChange={(v) => {
                    if (!v) setIsAddOpen(false);
                }}
            >
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-black tracking-tighter uppercase">
                            <PlusCircle className="h-5 w-5 text-primary" />{' '}
                            Catat Pinjaman Baru
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitAdd} className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
                            <Button
                                type="button"
                                size="sm"
                                variant={
                                    addForm.data.type === 'debt'
                                        ? 'destructive'
                                        : 'ghost'
                                }
                                className="h-8 w-full text-[10px] font-black uppercase"
                                onClick={() => addForm.setData('type', 'debt')}
                            >
                                Hutang Saya
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant={
                                    addForm.data.type === 'credit'
                                        ? 'default'
                                        : 'ghost'
                                }
                                className={`h-8 w-full text-[10px] font-black uppercase ${addForm.data.type === 'credit' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                                onClick={() =>
                                    addForm.setData('type', 'credit')
                                }
                            >
                                Piutang Saya
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                Nama Pihak Terkait
                            </Label>
                            <Input
                                placeholder="Nama orang atau instansi"
                                value={addForm.data.person_name}
                                onChange={(e) =>
                                    addForm.setData(
                                        'person_name',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                    Total Nominal
                                </Label>
                                <Input
                                    type="number"
                                    className="font-bold"
                                    value={addForm.data.amount}
                                    onChange={(e) =>
                                        addForm.setData(
                                            'amount',
                                            Number(e.target.value),
                                        )
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                    Jatuh Tempo
                                </Label>
                                <Input
                                    type="date"
                                    value={addForm.data.due_date}
                                    onChange={(e) =>
                                        addForm.setData(
                                            'due_date',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                Catatan
                            </Label>
                            <Input
                                placeholder="Tujuan pinjaman..."
                                value={addForm.data.note}
                                onChange={(e) =>
                                    addForm.setData('note', e.target.value)
                                }
                            />
                        </div>
                        <DialogFooter className="pt-2">
                            <Button
                                type="submit"
                                disabled={addForm.processing}
                                className="h-12 w-full text-xs font-black tracking-widest uppercase shadow-lg"
                            >
                                Simpan Catatan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ALERT DELETE */}
            <AlertDialog
                open={isDeleteOpen}
                onOpenChange={(v) => {
                    if (!v) setIsDeleteOpen(false);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-black tracking-tighter uppercase">
                            Hapus catatan ini?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm">
                            Data pinjaman ini akan dihapus secara permanen.
                            Pastikan Anda sudah mencatat histori transaksinya
                            jika perlu.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="text-xs font-bold tracking-widest uppercase">
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 text-xs font-bold tracking-widest uppercase hover:bg-red-700"
                        >
                            Ya, Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}

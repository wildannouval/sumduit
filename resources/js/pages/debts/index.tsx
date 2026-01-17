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
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import {
    Calendar,
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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Hutang & Piutang', href: '/debts' },
];

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
        addForm.post('/debts', { onSuccess: () => setIsAddOpen(false) });
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

    // Filter Logic
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

            <div className="flex flex-col gap-6 p-6 font-sans">
                {/* 1. Notifications */}
                {flash?.success && (
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

                {/* 2. Header Area */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-3 text-3xl font-black tracking-tighter uppercase">
                            <HandCoins className="h-8 w-8 text-primary" />{' '}
                            Pinjaman
                        </h1>
                        <p className="mt-1 text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
                            Kelola kewajiban dan tagihan piutang Anda.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="h-10 px-6 text-xs font-black tracking-widest uppercase shadow-lg transition-transform hover:scale-105"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Catat Baru
                    </Button>
                </div>

                {/* 3. Summary Section */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card className="relative overflow-hidden border-none bg-red-50 shadow-sm ring-1 ring-red-100 dark:bg-red-950/10 dark:ring-red-900/30">
                        <CardHeader className="pb-4">
                            <CardDescription className="text-[10px] font-black tracking-widest text-red-600 uppercase dark:text-red-400">
                                Total Hutang (Kewajiban Saya)
                            </CardDescription>
                            <CardTitle className="text-3xl font-black text-red-700 tabular-nums dark:text-red-300">
                                {formatIDR(totalDebt)}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="relative overflow-hidden border-none bg-blue-50 shadow-sm ring-1 ring-blue-100 dark:bg-blue-950/10 dark:ring-blue-900/30">
                        <CardHeader className="pb-4">
                            <CardDescription className="text-[10px] font-black tracking-widest text-blue-600 uppercase dark:text-blue-400">
                                Total Piutang (Tagihan Ke Orang)
                            </CardDescription>
                            <CardTitle className="text-3xl font-black text-blue-700 tabular-nums dark:text-blue-300">
                                {formatIDR(totalCredit)}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* 4. Toolbar */}
                <div className="flex flex-col items-center justify-between gap-4 rounded-xl border-b bg-muted/20 p-4 ring-1 ring-border md:flex-row">
                    <Tabs
                        defaultValue="all"
                        className="w-full md:w-auto"
                        onValueChange={setActiveTab}
                    >
                        <TabsList className="h-9 border bg-background">
                            <TabsTrigger
                                value="all"
                                className="px-4 text-[10px] font-black uppercase"
                            >
                                Semua
                            </TabsTrigger>
                            <TabsTrigger
                                value="debt"
                                className="px-4 text-[10px] font-black text-red-600 uppercase"
                            >
                                Hutang
                            </TabsTrigger>
                            <TabsTrigger
                                value="credit"
                                className="px-4 text-[10px] font-black text-blue-600 uppercase"
                            >
                                Piutang
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="relative w-full md:w-[300px]">
                        <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground opacity-50" />
                        <Input
                            placeholder="Cari nama orang..."
                            className="h-9 border-muted bg-background pl-10 text-sm font-medium focus-visible:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* 5. Data Table */}
                <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="border-b bg-muted/50">
                                <TableRow>
                                    <TableHead className="px-6 py-4 text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Pihak Terkait
                                    </TableHead>
                                    <TableHead className="py-4 text-center text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Jenis
                                    </TableHead>
                                    <TableHead className="py-4 text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Progress Pelunasan
                                    </TableHead>
                                    <TableHead className="py-4 text-right text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Sisa Tagihan
                                    </TableHead>
                                    <TableHead className="px-6 py-4 text-right text-[11px] font-black tracking-widest text-muted-foreground uppercase">
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
                                                <TableCell className="px-6 py-5">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 text-sm font-black tracking-tight uppercase">
                                                            <User
                                                                size={14}
                                                                className="text-primary opacity-40"
                                                            />{' '}
                                                            {d.person_name}
                                                        </div>
                                                        <div className="mt-0.5 flex items-center gap-2">
                                                            <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                                                                <Calendar
                                                                    size={11}
                                                                />{' '}
                                                                JT:{' '}
                                                                {d.due_date ||
                                                                    'N/A'}
                                                            </span>
                                                            {d.status ===
                                                                'paid' && (
                                                                <Badge className="h-4 border-none bg-emerald-500/20 text-[8px] font-black text-emerald-600 uppercase">
                                                                    Lunas
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge
                                                        variant="outline"
                                                        className={`h-5 border-none px-2 text-[9px] font-black uppercase ${d.type === 'debt' ? 'bg-red-500/10 text-red-600' : 'bg-blue-500/10 text-blue-600'}`}
                                                    >
                                                        {d.type === 'debt'
                                                            ? 'Hutang'
                                                            : 'Piutang'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="min-w-[200px]">
                                                    <div className="flex flex-col gap-1.5 px-4">
                                                        <div className="flex justify-between text-[9px] font-black tracking-tighter uppercase tabular-nums opacity-60">
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
                                                    className={`text-right text-base font-black tabular-nums ${d.remaining_amount === 0 ? 'text-emerald-600' : 'text-foreground'}`}
                                                >
                                                    {d.remaining_amount === 0
                                                        ? 'LUNAS'
                                                        : formatIDR(
                                                              d.remaining_amount,
                                                          )}
                                                </TableCell>
                                                <TableCell className="px-6 text-right">
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
                                                            className="w-44 rounded-xl border-none shadow-xl ring-1 ring-border"
                                                        >
                                                            <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black tracking-widest uppercase opacity-50">
                                                                Manajemen
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
                                                                    className="cursor-pointer text-xs font-bold text-primary uppercase"
                                                                >
                                                                    <History
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="mr-2"
                                                                    />{' '}
                                                                    Catat
                                                                    Cicilan
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setSelectedDebt(
                                                                        d,
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
                                                                Hapus Catatan
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
                                            className="h-48 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center opacity-30">
                                                <Inbox
                                                    size={48}
                                                    className="mb-2"
                                                />
                                                <p className="text-xs font-black tracking-widest text-muted-foreground uppercase">
                                                    Tidak ada catatan ditemukan
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

            {/* MODAL: TAMBAH PINJAMAN */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="overflow-hidden border-none p-0 shadow-2xl sm:max-w-[450px]">
                    <DialogHeader className="bg-slate-950 p-8 text-white">
                        <DialogTitle className="flex items-center gap-2 text-2xl font-black tracking-tighter uppercase">
                            <PlusCircle size={24} className="text-primary" />{' '}
                            Catat Pinjaman
                        </DialogTitle>
                        <DialogDescription className="text-xs font-bold tracking-widest text-slate-400 uppercase opacity-80">
                            Catat kewajiban atau tagihan piutang baru.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={submitAdd}
                        className="space-y-6 bg-card p-8"
                    >
                        <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
                            <Button
                                type="button"
                                variant={
                                    addForm.data.type === 'debt'
                                        ? 'destructive'
                                        : 'ghost'
                                }
                                className="h-9 text-[10px] font-black uppercase"
                                onClick={() => addForm.setData('type', 'debt')}
                            >
                                Hutang Saya
                            </Button>
                            <Button
                                type="button"
                                variant={
                                    addForm.data.type === 'credit'
                                        ? 'default'
                                        : 'ghost'
                                }
                                className={`h-9 text-[10px] font-black uppercase ${addForm.data.type === 'credit' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                                onClick={() =>
                                    addForm.setData('type', 'credit')
                                }
                            >
                                Piutang Saya
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
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
                                    className="font-bold"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Total Nominal
                                    </Label>
                                    <Input
                                        type="number"
                                        className="h-10 border-2 font-black tabular-nums focus-visible:ring-primary"
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
                                    <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
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
                                        className="font-bold"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                    Catatan / Keterangan
                                </Label>
                                <Input
                                    placeholder="Misal: Pinjaman untuk modal usaha"
                                    value={addForm.data.note}
                                    onChange={(e) =>
                                        addForm.setData('note', e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="submit"
                                disabled={addForm.processing}
                                className="h-12 w-full text-xs font-black tracking-[0.2em] uppercase shadow-lg"
                            >
                                Simpan Catatan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* MODAL: CATAT CICILAN / PEMBAYARAN */}
            <Dialog open={isPayOpen} onOpenChange={setIsPayOpen}>
                <DialogContent className="overflow-hidden border-none p-0 shadow-2xl sm:max-w-[420px]">
                    <DialogHeader className="bg-slate-950 p-8 text-white">
                        <DialogTitle className="flex items-center gap-2 text-2xl font-black tracking-tighter uppercase">
                            <History size={24} className="text-primary" /> Catat
                            Cicilan
                        </DialogTitle>
                        <DialogDescription className="text-xs font-bold tracking-widest text-slate-400 uppercase opacity-80">
                            Pelunasan untuk: {selectedDebt?.person_name}
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={submitPay}
                        className="space-y-6 bg-card p-8"
                    >
                        <div className="space-y-2">
                            <Label className="text-[11px] font-black tracking-widest text-emerald-600 text-muted-foreground uppercase">
                                Nominal Bayar (Rp)
                            </Label>
                            <Input
                                type="number"
                                className="h-12 border-2 border-emerald-100 text-xl font-black tabular-nums focus-visible:ring-emerald-500"
                                value={payForm.data.amount}
                                onChange={(e) =>
                                    payForm.setData(
                                        'amount',
                                        Number(e.target.value),
                                    )
                                }
                            />
                            <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                                Sisa Tagihan:{' '}
                                {selectedDebt
                                    ? formatIDR(selectedDebt.remaining_amount)
                                    : 0}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                Gunakan Sumber Dana
                            </Label>
                            <Select
                                value={String(payForm.data.wallet_id)}
                                onValueChange={(v) =>
                                    payForm.setData('wallet_id', Number(v))
                                }
                            >
                                <SelectTrigger className="h-11 text-xs font-bold uppercase shadow-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {wallets.map((w: any) => (
                                        <SelectItem
                                            key={w.id}
                                            value={String(w.id)}
                                            className="text-xs font-bold uppercase"
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
                                className="h-12 w-full bg-emerald-600 text-xs font-black tracking-[0.2em] uppercase shadow-lg hover:bg-emerald-700"
                            >
                                Konfirmasi Pembayaran
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
                            Hapus catatan ini?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm leading-relaxed font-medium italic opacity-70">
                            Data pinjaman akan dihapus secara permanen. Pastikan
                            Anda sudah mencatat histori transaksinya jika perlu.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel className="h-10 px-6 text-[10px] font-bold tracking-widest text-foreground uppercase">
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="h-10 bg-red-600 px-6 text-[10px] font-bold tracking-widest uppercase hover:bg-red-700"
                        >
                            Hapus Permanen
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}

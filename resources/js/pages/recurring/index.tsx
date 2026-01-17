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
    AlarmClock,
    CalendarClock,
    CheckCircle2,
    Inbox,
    MoreHorizontal,
    PlusCircle,
    RefreshCcw,
    Trash2,
    Wallet as WalletIcon,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tagihan Rutin', href: '/recurring' },
];

export default function RecurringIndex({
    templates = [],
    wallets = [],
    categories = [],
    flash = {},
}: any) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<any>(null);

    const form = useForm({
        name: '',
        amount: 0,
        wallet_id: (wallets[0]?.id || '') as number | string,
        category_id: (categories[0]?.id || '') as number | string,
        type: 'expense',
        frequency: 'monthly',
        next_due_date: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        if (!isAddOpen) form.reset();
    }, [isAddOpen]);

    const submitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/recurring', {
            onSuccess: () => {
                setIsAddOpen(false);
            },
        });
    };

    const handleDelete = () => {
        if (selectedId) {
            router.delete(`/recurring/${selectedId}`, {
                onSuccess: () => setIsDeleteOpen(false),
            });
        }
    };

    // Kalkulasi Total Bulanan yang terautomasi
    const totalMonthlyRecurring = templates.reduce((acc: number, t: any) => {
        const amt = Number(t.amount);
        return t.frequency === 'monthly' ? acc + amt : acc + amt * 4;
    }, 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tagihan Rutin" />

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
                            <RefreshCcw className="h-8 w-8 text-primary" />{' '}
                            Tagihan Rutin
                        </h1>
                        <p className="mt-1 text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
                            Automasi pencatatan transaksi berkala Anda.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="h-10 px-6 text-xs font-black tracking-widest uppercase shadow-lg transition-transform hover:scale-105"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Jadwal
                    </Button>
                </div>

                {/* 3. Summary Stats */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="relative overflow-hidden border-none bg-slate-950 text-white shadow-xl ring-1 ring-border md:col-span-2 dark:bg-slate-900">
                        <div className="absolute top-[-10px] right-[-10px] rotate-12 opacity-10">
                            <AlarmClock size={160} />
                        </div>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                                Estimasi Beban Rutin / Bulan
                            </CardDescription>
                            <CardTitle className="text-4xl font-black tracking-tighter text-primary-foreground italic tabular-nums">
                                {formatIDR(totalMonthlyRecurring)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                                Berdasarkan {templates.length} jadwal aktif
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col justify-center border-none bg-card px-6 shadow-sm ring-1 ring-border">
                        <CardDescription className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                            Status Sistem
                        </CardDescription>
                        <div className="mt-1 flex items-baseline gap-2 text-3xl font-black">
                            {templates.length}{' '}
                            <span className="text-xs font-bold text-muted-foreground uppercase">
                                Template
                            </span>
                        </div>
                    </Card>
                </div>

                {/* 4. Recurring List (Data Table) */}
                <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="py-4 text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Nama Tagihan
                                    </TableHead>
                                    <TableHead className="py-4 text-center text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Frekuensi
                                    </TableHead>
                                    <TableHead className="py-4 text-center text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Next Run
                                    </TableHead>
                                    <TableHead className="py-4 text-right text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Nominal
                                    </TableHead>
                                    <TableHead className="py-4 text-right text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {templates.length > 0 ? (
                                    templates.map((t: any) => (
                                        <TableRow
                                            key={t.id}
                                            className="group transition-colors hover:bg-muted/30"
                                        >
                                            <TableCell className="py-5">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-black tracking-tight uppercase">
                                                        {t.name}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                        <WalletIcon size={12} />{' '}
                                                        {t.wallet?.name} •{' '}
                                                        {t.category?.name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant="outline"
                                                    className="h-5 border-primary/30 bg-primary/5 px-2 text-[9px] font-black tracking-tighter text-primary uppercase"
                                                >
                                                    {t.frequency === 'monthly'
                                                        ? 'Bulanan'
                                                        : 'Mingguan'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600">
                                                        <CalendarClock
                                                            size={12}
                                                        />{' '}
                                                        {t.next_due_date}
                                                    </span>
                                                    {t.last_applied_at && (
                                                        <span className="text-[9px] font-medium text-muted-foreground uppercase">
                                                            Last:{' '}
                                                            {t.last_applied_at}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right text-base font-black tabular-nums">
                                                {formatIDR(Number(t.amount))}
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
                                                            Opsi
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedId(
                                                                    t.id,
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
                                                            Hapus Jadwal
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
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
                                                    Tidak Ada Jadwal Rutin
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

            {/* DIALOG: TAMBAH JADWAL */}
            <Dialog
                open={isAddOpen}
                onOpenChange={(v) => {
                    if (!v) setIsAddOpen(false);
                }}
            >
                <DialogContent className="overflow-hidden border-none p-0 shadow-2xl sm:max-w-[425px]">
                    <DialogHeader className="bg-slate-950 p-8 text-white">
                        <DialogTitle className="flex items-center gap-2 text-2xl font-black tracking-tighter uppercase">
                            <RefreshCcw size={24} className="text-primary" />{' '}
                            Jadwal Automasi
                        </DialogTitle>
                        <DialogDescription className="text-xs font-bold tracking-widest text-slate-400 uppercase opacity-80">
                            Catat transaksi rutin secara otomatis.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={submitAdd}
                        className="space-y-6 bg-card p-8 font-sans"
                    >
                        <div className="space-y-2">
                            <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                Nama Tagihan
                            </Label>
                            <Input
                                placeholder="Misal: Netflix, Listrik Bulanan"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                                className="font-bold"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                    Nominal (Rp)
                                </Label>
                                <Input
                                    type="number"
                                    className="h-10 border-2 font-black tabular-nums focus-visible:ring-primary"
                                    value={form.data.amount}
                                    onChange={(e) =>
                                        form.setData(
                                            'amount',
                                            Number(e.target.value),
                                        )
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                    Frekuensi
                                </Label>
                                <Select
                                    value={form.data.frequency}
                                    onValueChange={(v) =>
                                        form.setData('frequency', v)
                                    }
                                >
                                    <SelectTrigger className="h-10 text-xs font-bold text-foreground uppercase">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            value="monthly"
                                            className="text-xs font-bold tracking-tighter uppercase"
                                        >
                                            Bulanan
                                        </SelectItem>
                                        <SelectItem
                                            value="weekly"
                                            className="text-xs font-bold tracking-tighter uppercase"
                                        >
                                            Mingguan
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                    Kategori
                                </Label>
                                <Select
                                    value={String(form.data.category_id)}
                                    onValueChange={(v) =>
                                        form.setData('category_id', Number(v))
                                    }
                                >
                                    <SelectTrigger className="h-10 text-xs font-bold uppercase">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((c: any) => (
                                            <SelectItem
                                                key={c.id}
                                                value={String(c.id)}
                                                className="text-xs font-bold uppercase"
                                            >
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                    Dompet
                                </Label>
                                <Select
                                    value={String(form.data.wallet_id)}
                                    onValueChange={(v) =>
                                        form.setData('wallet_id', Number(v))
                                    }
                                >
                                    <SelectTrigger className="h-10 text-xs font-bold uppercase">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {wallets.map((w: any) => (
                                            <SelectItem
                                                key={w.id}
                                                value={String(w.id)}
                                                className="text-xs font-bold uppercase"
                                            >
                                                {w.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2 rounded-lg border border-blue-100 bg-blue-50/50 p-3 dark:border-blue-900/30 dark:bg-blue-900/10">
                            <Label className="flex items-center gap-2 text-[10px] font-black tracking-widest text-blue-600 uppercase dark:text-blue-400">
                                <CalendarClock size={12} /> Mulai Automasi
                                Tanggal
                            </Label>
                            <Input
                                type="date"
                                className="mt-1 h-10 bg-background font-bold"
                                value={form.data.next_due_date}
                                onChange={(e) =>
                                    form.setData(
                                        'next_due_date',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="h-12 w-full text-xs font-black tracking-[0.2em] uppercase shadow-lg transition-transform hover:scale-[1.02]"
                            >
                                Aktifkan Automasi
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
                <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-black tracking-tight uppercase">
                            Berhenti automasi?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm leading-relaxed font-medium italic opacity-70">
                            Tagihan ini tidak akan lagi dicatat secara otomatis
                            ke Arus Kas Anda.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel className="h-10 px-6 text-[10px] font-bold tracking-widest uppercase">
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="h-10 bg-red-600 px-6 text-[10px] font-bold tracking-widest uppercase hover:bg-red-700"
                        >
                            Ya, Hapus Jadwal
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}

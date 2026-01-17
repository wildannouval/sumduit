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
    CardFooter,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { formatIDR } from '@/lib/money';
import { Head, useForm } from '@inertiajs/react';
import {
    AlarmClock,
    CalendarClock,
    CheckCircle2,
    Inbox,
    PlusCircle,
    RefreshCcw,
    Trash2,
    Wallet as WalletIcon,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

const breadcrumbs = [{ title: 'Automasi Tagihan', href: '/recurring' }];

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
            form.delete(`/recurring/${selectedId}`, {
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

            <div className="flex flex-col gap-6 p-6">
                {/* 1. Notifications */}
                {flash?.success && (
                    <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/20">
                        <CheckCircle2 className="h-4 w-4 stroke-emerald-600" />
                        <AlertTitle className="text-xs font-bold tracking-widest uppercase">
                            Sistem Aktif
                        </AlertTitle>
                        <AlertDescription className="text-xs">
                            {flash.success}
                        </AlertDescription>
                    </Alert>
                )}

                {/* 2. Header Area */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight uppercase">
                            <RefreshCcw className="h-6 w-6 text-primary" />{' '}
                            Tagihan Rutin
                        </h1>
                        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                            Automasi pencatatan transaksi berkala Anda.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="h-10 px-6 text-xs font-bold tracking-widest uppercase shadow-lg"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Jadwal
                    </Button>
                </div>

                {/* 3. Summary Stats */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="relative overflow-hidden border-none bg-slate-950 text-white shadow-sm ring-1 ring-border dark:bg-slate-900">
                        <div className="absolute top-[-10px] right-[-10px] rotate-12 opacity-10">
                            <AlarmClock size={120} />
                        </div>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                Total Beban Rutin / Bulan
                            </CardDescription>
                            <CardTitle className="text-3xl font-black text-primary-foreground italic">
                                {formatIDR(totalMonthlyRecurring)}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="flex flex-col justify-center border-none bg-card px-6 shadow-sm ring-1 ring-border">
                        <CardDescription className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                            Automasi Aktif
                        </CardDescription>
                        <div className="mt-1 text-3xl font-black">
                            {templates.length}{' '}
                            <span className="text-xs font-bold tracking-tighter text-muted-foreground uppercase">
                                Template
                            </span>
                        </div>
                    </Card>
                </div>

                {/* 4. Recurring Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {templates.length > 0 ? (
                        templates.map((t: any) => (
                            <Card
                                key={t.id}
                                className="group flex flex-col justify-between overflow-hidden border-none bg-card shadow-sm ring-1 ring-border transition-all hover:ring-primary/50"
                            >
                                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                                    <div className="flex flex-col gap-1">
                                        <Badge
                                            variant="outline"
                                            className="w-fit border-primary/30 bg-primary/5 text-[9px] font-black tracking-tighter text-primary uppercase"
                                        >
                                            {t.frequency === 'monthly'
                                                ? 'Setiap Bulan'
                                                : 'Setiap Minggu'}
                                        </Badge>
                                        <CardTitle className="mt-1 text-lg font-black tracking-tight uppercase">
                                            {t.name}
                                        </CardTitle>
                                        <CardDescription className="text-[10px] font-bold tracking-widest uppercase">
                                            {t.category?.name}
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                                        onClick={() => {
                                            setSelectedId(t.id);
                                            setIsDeleteOpen(true);
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </CardHeader>

                                <CardContent className="pb-4">
                                    <div className="text-2xl font-black tracking-tighter text-foreground">
                                        {formatIDR(Number(t.amount))}
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 p-2">
                                        <WalletIcon
                                            size={14}
                                            className="text-muted-foreground"
                                        />
                                        <span className="text-[11px] font-bold text-muted-foreground uppercase">
                                            {t.wallet?.name}
                                        </span>
                                    </div>
                                </CardContent>

                                <CardFooter className="flex items-center justify-between border-t bg-muted/20 py-3">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-muted-foreground uppercase opacity-60">
                                            Next Run
                                        </span>
                                        <div className="flex items-center gap-1 text-xs font-bold text-blue-600">
                                            <CalendarClock size={12} />{' '}
                                            {t.next_due_date}
                                        </div>
                                    </div>
                                    {t.last_applied_at && (
                                        <div className="flex flex-col text-right">
                                            <span className="text-[9px] font-black text-muted-foreground uppercase opacity-60">
                                                Terakhir
                                            </span>
                                            <span className="text-[10px] font-medium text-muted-foreground">
                                                {t.last_applied_at}
                                            </span>
                                        </div>
                                    )}
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-muted/10 py-20 text-center">
                            <Inbox
                                size={48}
                                className="mb-4 text-muted-foreground opacity-20"
                            />
                            <h3 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
                                Belum ada jadwal otomatis
                            </h3>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Gunakan tombol "Tambah Jadwal" untuk memulai.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* DIALOG: TAMBAH JADWAL */}
            <Dialog
                open={isAddOpen}
                onOpenChange={(v) => {
                    if (!v) setIsAddOpen(false);
                }}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-black tracking-tighter text-primary uppercase">
                            <RefreshCcw size={20} /> Jadwal Automasi
                        </DialogTitle>
                        <DialogDescription className="text-xs font-medium uppercase">
                            Transaksi ini akan dicatat otomatis sesuai jadwal.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitAdd} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                Nama Automasi
                            </Label>
                            <Input
                                placeholder="Contoh: BPJS Kesehatan, WiFi Rumah"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                    Nominal
                                </Label>
                                <Input
                                    type="number"
                                    className="font-bold"
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
                                <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                    Frekuensi
                                </Label>
                                <Select
                                    value={form.data.frequency}
                                    onValueChange={(v) =>
                                        form.setData('frequency', v)
                                    }
                                >
                                    <SelectTrigger className="font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="monthly">
                                            Bulanan
                                        </SelectItem>
                                        <SelectItem value="weekly">
                                            Mingguan
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                    Kategori
                                </Label>
                                <Select
                                    value={String(form.data.category_id)}
                                    onValueChange={(v) =>
                                        form.setData('category_id', Number(v))
                                    }
                                >
                                    <SelectTrigger className="font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((c: any) => (
                                            <SelectItem
                                                key={c.id}
                                                value={String(c.id)}
                                            >
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                    Dompet Sumber
                                </Label>
                                <Select
                                    value={String(form.data.wallet_id)}
                                    onValueChange={(v) =>
                                        form.setData('wallet_id', Number(v))
                                    }
                                >
                                    <SelectTrigger className="font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {wallets.map((w: any) => (
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

                        <div className="space-y-2 rounded-lg border border-blue-100 bg-blue-50/50 p-3 dark:border-blue-900/30 dark:bg-blue-900/10">
                            <Label className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase dark:text-blue-400">
                                <CalendarClock size={12} /> Mulai Automasi
                                Tanggal
                            </Label>
                            <Input
                                type="date"
                                className="mt-1 bg-background"
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
                                className="h-11 w-full text-xs font-black tracking-widest uppercase"
                            >
                                {form.processing
                                    ? 'Sedang Memproses...'
                                    : 'Aktifkan Automasi'}
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
                            Hapus jadwal automasi?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm">
                            Tagihan ini tidak akan lagi dicatatkan secara
                            otomatis ke Arus Kas Anda mulai periode berikutnya.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="text-xs font-bold tracking-widest uppercase">
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 text-xs font-bold tracking-widest uppercase hover:bg-red-700"
                        >
                            Ya, Berhenti
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}

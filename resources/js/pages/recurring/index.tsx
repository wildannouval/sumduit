import AppLayout from '@/layouts/app-layout';
import { formatIDR } from '@/lib/money';
import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

// Shadcn UI
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
    AlarmClock,
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    Plus,
    Trash2,
    Wallet as WalletIcon,
} from 'lucide-react';

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
                form.reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Recurring', href: '/recurring' }]}>
            <Head title="Tagihan Rutin" />
            <div className="flex flex-col gap-6 p-6">
                {/* Notification Area */}
                <div className="space-y-3">
                    {flash?.success && (
                        <Alert className="animate-in border-emerald-200 bg-emerald-50 text-emerald-800 shadow-sm fade-in slide-in-from-top-2">
                            <CheckCircle2 className="h-4 w-4 stroke-emerald-600" />
                            <AlertTitle className="font-bold">
                                Berhasil
                            </AlertTitle>
                            <AlertDescription>{flash.success}</AlertDescription>
                        </Alert>
                    )}
                    {flash?.error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle className="font-bold">Gagal</AlertTitle>
                            <AlertDescription>{flash.error}</AlertDescription>
                        </Alert>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter text-foreground uppercase">
                            Tagihan Rutin
                        </h1>
                        <p className="text-sm text-muted-foreground italic">
                            Automasi pencatatan transaksi berkala Anda.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="font-bold"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Tambah Jadwal
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {templates.map((t: any) => (
                        <div
                            key={t.id}
                            className="flex flex-col justify-between gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                                        <AlarmClock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg leading-tight font-black tracking-tighter uppercase">
                                            {t.name}
                                        </h3>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">
                                            {t.category?.name} • {t.frequency}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-red-500 hover:bg-red-50"
                                    onClick={() => {
                                        setSelectedId(t.id);
                                        setIsDeleteOpen(true);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="flex items-end justify-between border-t pt-4">
                                <div>
                                    <p className="flex items-center gap-1 text-[10px] font-bold uppercase opacity-50">
                                        <CalendarDays className="h-3 w-3" />{' '}
                                        Jatuh Tempo
                                    </p>
                                    <p className="text-sm font-bold text-blue-600">
                                        {t.next_due_date}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="flex items-center justify-end gap-1 text-[10px] font-bold uppercase opacity-50">
                                        <WalletIcon className="h-3 w-3" />{' '}
                                        {t.wallet?.name}
                                    </p>
                                    <p className="text-lg font-black">
                                        {formatIDR(Number(t.amount))}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {templates.length === 0 && (
                        <div className="col-span-full rounded-2xl border-2 border-dashed p-12 text-center text-muted-foreground italic">
                            Belum ada jadwal tagihan otomatis.
                        </div>
                    )}
                </div>
            </div>

            {/* DIALOG: TAMBAH */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Jadwalkan Tagihan Baru</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitAdd} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase opacity-60">
                                Nama Tagihan
                            </label>
                            <Input
                                placeholder="mis. Langganan Netflix"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase opacity-60">
                                    Nominal
                                </label>
                                <Input
                                    type="number"
                                    value={form.data.amount}
                                    onChange={(e) =>
                                        form.setData(
                                            'amount',
                                            Number(e.target.value),
                                        )
                                    }
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase opacity-60">
                                    Frekuensi
                                </label>
                                <select
                                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                                    value={form.data.frequency}
                                    onChange={(e) =>
                                        form.setData(
                                            'frequency',
                                            e.target.value,
                                        )
                                    }
                                >
                                    <option value="monthly">Bulanan</option>
                                    <option value="weekly">Mingguan</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase opacity-60">
                                    Kategori
                                </label>
                                <select
                                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                                    value={form.data.category_id}
                                    onChange={(e) =>
                                        form.setData(
                                            'category_id',
                                            Number(e.target.value),
                                        )
                                    }
                                >
                                    {categories.map((c: any) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase opacity-60">
                                    Dompet
                                </label>
                                <select
                                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                                    value={form.data.wallet_id}
                                    onChange={(e) =>
                                        form.setData(
                                            'wallet_id',
                                            Number(e.target.value),
                                        )
                                    }
                                >
                                    {wallets.map((w: any) => (
                                        <option key={w.id} value={w.id}>
                                            {w.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase opacity-60">
                                Tanggal Jatuh Tempo Berikutnya
                            </label>
                            <Input
                                type="date"
                                value={form.data.next_due_date}
                                onChange={(e) =>
                                    form.setData(
                                        'next_due_date',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                className="w-full font-bold"
                                disabled={form.processing}
                            >
                                Aktifkan Automasi
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ALERT DELETE */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus automasi ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tagihan ini tidak akan lagi dicatatkan secara
                            otomatis ke Arus Kas Anda.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() =>
                                router.delete(`/recurring/${selectedId}`, {
                                    onSuccess: () => setIsDeleteOpen(false),
                                })
                            }
                            className="bg-red-600"
                        >
                            Ya, Berhenti
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}

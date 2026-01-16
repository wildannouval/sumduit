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
    CheckCircle2,
    Edit2,
    PlusCircle,
    Target,
    Trash2,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Transactions', href: '/transactions' },
];

export default function TransactionIndex({
    transactions,
    wallets,
    categories,
    goals,
    flash,
}: any) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedTx, setSelectedTx] = useState<any>(null);

    const form = useForm({
        type: 'expense' as 'income' | 'expense',
        amount: 0,
        wallet_id: (wallets[0]?.id || null) as number | null,
        category_id: null as number | null,
        goal_id: null as number | null,
        occurred_at: new Date().toISOString().split('T')[0],
        note: '',
    });

    useEffect(() => {
        if (!isAddOpen && !isEditOpen) {
            form.reset();
            setSelectedTx(null);
        }
    }, [isAddOpen, isEditOpen]);

    const openEdit = (tx: any) => {
        setSelectedTx(tx);
        form.setData({
            type: tx.type,
            amount: Number(tx.amount),
            wallet_id: tx.wallet_id,
            category_id: tx.category_id,
            goal_id: tx.goal_id,
            occurred_at: tx.occurred_at,
            note: tx.note || '',
        });
        setIsEditOpen(true);
    };

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isAddOpen
            ? '/transactions'
            : `/transactions/${selectedTx.id}`;
        const action = isAddOpen ? form.post : form.put;

        action(url, {
            onSuccess: () => {
                setIsAddOpen(false);
                setIsEditOpen(false);
            },
        });
    };

    const confirmDelete = () => {
        if (selectedTx) {
            router.delete(`/transactions/${selectedTx.id}`, {
                onSuccess: () => setIsDeleteOpen(false),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Arus Kas" />
            <div className="flex flex-col gap-6 p-6">
                {/* Notification Banner */}
                <div className="space-y-3">
                    {flash.success && (
                        <Alert className="animate-in border-emerald-200 bg-emerald-50 text-emerald-800 fade-in slide-in-from-top-2">
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
                            className="animate-in fade-in slide-in-from-top-2"
                        >
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle className="font-bold">Gagal</AlertTitle>
                            <AlertDescription>{flash.error}</AlertDescription>
                        </Alert>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">
                            Arus Kas
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Catat aktivitas keuangan Anda secara harian.
                        </p>
                    </div>
                    <Button onClick={() => setIsAddOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Catat Transaksi
                    </Button>
                </div>

                {/* Table Section */}
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50 text-left">
                            <tr className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                <th className="p-4">Tanggal</th>
                                <th className="p-4">Keterangan</th>
                                <th className="p-4 text-right">Nominal</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {transactions.data.map((t: any) => (
                                <tr
                                    key={t.id}
                                    className="transition-colors hover:bg-muted/20"
                                >
                                    <td className="p-4 align-top text-muted-foreground">
                                        {t.occurred_at}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold">
                                            {t.category?.name || 'Lainnya'}
                                        </div>
                                        <div className="text-[10px] font-medium uppercase italic opacity-60">
                                            Dompet: {t.wallet?.name}
                                        </div>
                                        {t.goal && (
                                            <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase">
                                                <Target className="h-3 w-3" />{' '}
                                                {t.goal.name}
                                            </div>
                                        )}
                                        {t.note && (
                                            <p className="mt-1 text-xs font-medium text-muted-foreground italic">
                                                "{t.note}"
                                            </p>
                                        )}
                                    </td>
                                    <td
                                        className={`p-4 text-right font-black ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}
                                    >
                                        {t.type === 'income' ? '+' : '-'}
                                        {formatIDR(Number(t.amount))}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8"
                                                onClick={() => openEdit(t)}
                                            >
                                                <Edit2 className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-red-500 hover:text-red-600"
                                                onClick={() => {
                                                    setSelectedTx(t);
                                                    setIsDeleteOpen(true);
                                                }}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL: CREATE & EDIT */}
            <Dialog
                open={isAddOpen || isEditOpen}
                onOpenChange={(v) =>
                    !v && (setIsAddOpen(false) || setIsEditOpen(false))
                }
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {isAddOpen ? 'Catat Transaksi' : 'Ubah Transaksi'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitForm} className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
                            <Button
                                type="button"
                                size="sm"
                                variant={
                                    form.data.type === 'expense'
                                        ? 'destructive'
                                        : 'ghost'
                                }
                                className="w-full"
                                onClick={() => form.setData('type', 'expense')}
                            >
                                Pengeluaran
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant={
                                    form.data.type === 'income'
                                        ? 'default'
                                        : 'ghost'
                                }
                                className="w-full"
                                onClick={() => form.setData('type', 'income')}
                            >
                                Pemasukan
                            </Button>
                        </div>

                        <div className="grid gap-4">
                            <div className="space-y-1">
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

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase opacity-60">
                                        Dompet
                                    </label>
                                    <select
                                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                                        value={form.data.wallet_id ?? ''}
                                        onChange={(e) =>
                                            form.setData(
                                                'wallet_id',
                                                e.target.value
                                                    ? Number(e.target.value)
                                                    : null,
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
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase opacity-60">
                                        Kategori
                                    </label>
                                    <select
                                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                                        value={form.data.category_id ?? ''}
                                        onChange={(e) =>
                                            form.setData(
                                                'category_id',
                                                e.target.value
                                                    ? Number(e.target.value)
                                                    : null,
                                            )
                                        }
                                    >
                                        <option value="">Lainnya</option>
                                        {categories
                                            .filter(
                                                (c: any) =>
                                                    c.type === form.data.type,
                                            )
                                            .map((c: any) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black tracking-tighter text-blue-600 uppercase">
                                    Hubungkan ke Goal (Tabungan)
                                </label>
                                <select
                                    className="h-10 w-full rounded-md border bg-blue-50/30 px-3 text-sm"
                                    value={form.data.goal_id ?? ''}
                                    onChange={(e) =>
                                        form.setData(
                                            'goal_id',
                                            e.target.value
                                                ? Number(e.target.value)
                                                : null,
                                        )
                                    }
                                >
                                    <option value="">Tidak Ada</option>
                                    {goals.map((g: any) => (
                                        <option key={g.id} value={g.id}>
                                            {g.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase opacity-60">
                                    Tanggal & Catatan
                                </label>
                                <Input
                                    type="date"
                                    value={form.data.occurred_at}
                                    onChange={(e) =>
                                        form.setData(
                                            'occurred_at',
                                            e.target.value,
                                        )
                                    }
                                />
                                <Input
                                    className="mt-2"
                                    value={form.data.note}
                                    onChange={(e) =>
                                        form.setData('note', e.target.value)
                                    }
                                    placeholder="Contoh: Makan siang bareng tim"
                                />
                            </div>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="w-full font-bold"
                            >
                                Simpan Transaksi
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ALERT DIALOG: DELETE */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Hapus transaksi ini?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Data akan dihapus permanen dan saldo dompet serta
                            target tabungan akan dikembalikan secara otomatis.
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

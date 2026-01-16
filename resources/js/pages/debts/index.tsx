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
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    AlertCircle,
    CheckCircle2,
    HandCoins,
    History,
    Plus,
    Trash2,
} from 'lucide-react';

export default function DebtIndex({ debts = [], wallets = [], flash }: any) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isPayOpen, setIsPayOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedDebt, setSelectedDebt] = useState<any>(null);

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
                addForm.reset();
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

    return (
        <AppLayout
            breadcrumbs={[{ title: 'Hutang & Piutang', href: '/debts' }]}
        >
            <Head title="Hutang & Piutang" />
            <div className="flex flex-col gap-6 p-6">
                {/* Notifikasi Flash */}
                <div className="space-y-3">
                    {flash?.success && (
                        <Alert className="animate-in border-emerald-200 bg-emerald-50 text-emerald-800 fade-in slide-in-from-top-2">
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
                        <h1 className="text-2xl font-black tracking-tighter uppercase">
                            Pinjaman
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola catatan hutang dan piutang Anda.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="font-bold"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Catat Baru
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {debts.map((d: any) => (
                        <div
                            key={d.id}
                            className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`rounded-xl p-2.5 ${d.type === 'debt' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}
                                    >
                                        <HandCoins className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black tracking-widest uppercase opacity-50">
                                            {d.type === 'debt'
                                                ? 'Hutang ke'
                                                : 'Piutang ke'}
                                        </p>
                                        <h3 className="text-lg leading-tight font-black">
                                            {d.person_name}
                                        </h3>
                                    </div>
                                </div>
                                <div
                                    className={`rounded-full px-3 py-0.5 text-[10px] font-black tracking-tighter uppercase ${d.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
                                >
                                    {d.status}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs font-bold tracking-tighter uppercase opacity-70">
                                    <span>Sisa Pelunasan</span>
                                    <span>
                                        {formatIDR(d.remaining_amount)} /{' '}
                                        {formatIDR(d.amount)}
                                    </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                    <div
                                        className={`h-full transition-all duration-500 ${d.type === 'debt' ? 'bg-red-500' : 'bg-blue-500'}`}
                                        style={{
                                            width: `${((d.amount - d.remaining_amount) / d.amount) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 flex gap-2">
                                {d.status === 'unpaid' && (
                                    <Button
                                        className="h-9 flex-1 font-bold"
                                        variant="outline"
                                        onClick={() => openPay(d)}
                                    >
                                        <History className="mr-2 h-4 w-4" />{' '}
                                        Bayar
                                    </Button>
                                )}
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-9 w-9 text-red-500 hover:bg-red-50"
                                    onClick={() => {
                                        setSelectedDebt(d);
                                        setIsDeleteOpen(true);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {debts.length === 0 && (
                        <div className="col-span-full rounded-2xl border-2 border-dashed p-12 text-center text-muted-foreground italic">
                            Belum ada catatan hutang atau piutang.
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL: BAYAR CICILAN */}
            <Dialog open={isPayOpen} onOpenChange={setIsPayOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Bayar Pinjaman: {selectedDebt?.person_name}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitPay} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase opacity-60">
                                Nominal
                            </label>
                            <Input
                                type="number"
                                value={payForm.data.amount}
                                onChange={(e) =>
                                    payForm.setData(
                                        'amount',
                                        Number(e.target.value),
                                    )
                                }
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase opacity-60">
                                Sumber Dana
                            </label>
                            <select
                                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                                value={payForm.data.wallet_id}
                                onChange={(e) =>
                                    payForm.setData(
                                        'wallet_id',
                                        Number(e.target.value),
                                    )
                                }
                            >
                                {wallets.map((w: any) => (
                                    <option key={w.id} value={w.id}>
                                        {w.name} ({formatIDR(w.balance)})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Button
                            type="submit"
                            className="w-full font-bold"
                            disabled={payForm.processing}
                        >
                            Konfirmasi Pembayaran
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* MODAL: TAMBAH CATATAN */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Catat Pinjaman Baru</DialogTitle>
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
                                onClick={() => addForm.setData('type', 'debt')}
                            >
                                Hutang
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant={
                                    addForm.data.type === 'credit'
                                        ? 'default'
                                        : 'ghost'
                                }
                                onClick={() =>
                                    addForm.setData('type', 'credit')
                                }
                            >
                                Piutang
                            </Button>
                        </div>
                        <Input
                            placeholder="Nama Pihak Terkait"
                            value={addForm.data.person_name}
                            onChange={(e) =>
                                addForm.setData('person_name', e.target.value)
                            }
                        />
                        <Input
                            type="number"
                            placeholder="Total Nominal"
                            value={addForm.data.amount}
                            onChange={(e) =>
                                addForm.setData(
                                    'amount',
                                    Number(e.target.value),
                                )
                            }
                        />
                        <Button
                            type="submit"
                            className="w-full font-bold"
                            disabled={addForm.processing}
                        >
                            Simpan Catatan
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ALERT DIALOG: DELETE */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus catatan?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Data <strong>{selectedDebt?.person_name}</strong>{' '}
                            akan dihapus permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}

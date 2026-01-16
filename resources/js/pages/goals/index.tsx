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
    CalendarDays,
    CheckCircle2,
    Edit2,
    Plus,
    Target,
    Trash2,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Goals', href: '/goals' }];

export default function GoalIndex({ goals, flash }: any) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<any>(null);

    const form = useForm({
        name: '',
        target_amount: 0,
        current_amount: 0,
        due_date: '',
        note: '',
    });

    useEffect(() => {
        if (!isAddOpen && !isEditOpen) {
            form.reset();
            setSelectedGoal(null);
        }
    }, [isAddOpen, isEditOpen]);

    const openEdit = (goal: any) => {
        setSelectedGoal(goal);
        form.setData({
            name: goal.name,
            target_amount: Number(goal.target_amount),
            current_amount: Number(goal.current_amount),
            due_date: goal.due_date || '',
            note: goal.note || '',
        });
        setIsEditOpen(true);
    };

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isAddOpen ? '/goals' : `/goals/${selectedGoal.id}`;
        if (isAddOpen) {
            form.post(url, { onSuccess: () => setIsAddOpen(false) });
        } else {
            form.put(url, { onSuccess: () => setIsEditOpen(false) });
        }
    };

    const confirmDelete = () => {
        if (selectedGoal) {
            router.delete(`/goals/${selectedGoal.id}`, {
                onSuccess: () => setIsDeleteOpen(false),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Goals & Tabungan" />
            <div className="flex flex-col gap-6 p-6">
                {/* Success Alert */}
                {flash.success && (
                    <Alert className="animate-in border-emerald-200 bg-emerald-50 text-emerald-800 shadow-sm fade-in slide-in-from-top-2">
                        <CheckCircle2 className="h-4 w-4 stroke-emerald-600" />
                        <AlertTitle className="font-bold">Berhasil</AlertTitle>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight uppercase">
                            Target Tabungan
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Wujudkan impian finansial Anda satu langkah setiap
                            harinya.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="font-bold"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Goal Baru
                    </Button>
                </div>

                {/* Table Data Goals */}
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50 text-left">
                            <tr className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                <th className="p-4">Nama Rencana</th>
                                <th className="p-4 text-right">
                                    Target Nominal
                                </th>
                                <th className="p-4 text-center">Progress</th>
                                <th className="p-4 text-right">Sisa Target</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {goals.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="p-12 text-center text-muted-foreground italic"
                                    >
                                        Belum ada target tabungan.
                                    </td>
                                </tr>
                            ) : (
                                goals.map((g: any) => (
                                    <tr
                                        key={g.id}
                                        className="transition-colors hover:bg-muted/20"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400">
                                                <Target className="h-4 w-4" />{' '}
                                                {g.name}
                                            </div>
                                            {g.due_date && (
                                                <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                                                    <CalendarDays className="h-3 w-3" />{' '}
                                                    Jatuh tempo: {g.due_date}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-right font-semibold">
                                            {formatIDR(Number(g.target_amount))}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex min-w-[120px] flex-col gap-1.5">
                                                <div className="flex justify-between text-[10px] font-bold">
                                                    <span>
                                                        {formatIDR(
                                                            g.current_amount,
                                                        )}
                                                    </span>
                                                    <span>
                                                        {g.progress_pct}%
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                                    <div
                                                        className={`h-full transition-all ${g.progress_pct >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                                        style={{
                                                            width: `${Math.min(g.progress_pct, 100)}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right font-black tracking-tight text-red-600">
                                            {formatIDR(g.remaining)}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8"
                                                    onClick={() => openEdit(g)}
                                                >
                                                    <Edit2 className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-red-500 hover:text-red-600"
                                                    onClick={() => {
                                                        setSelectedGoal(g);
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
                        <DialogTitle>
                            {isAddOpen ? 'Tentukan Goal Baru' : 'Ubah Rencana'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitForm} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase opacity-60">
                                Nama Impian
                            </label>
                            <Input
                                placeholder="mis. Liburan ke Jepang"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase opacity-60">
                                    Target Nominal
                                </label>
                                <Input
                                    type="number"
                                    value={form.data.target_amount}
                                    onChange={(e) =>
                                        form.setData(
                                            'target_amount',
                                            Number(e.target.value),
                                        )
                                    }
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase opacity-60">
                                    Saldo Awal
                                </label>
                                <Input
                                    type="number"
                                    value={form.data.current_amount}
                                    onChange={(e) =>
                                        form.setData(
                                            'current_amount',
                                            Number(e.target.value),
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase opacity-60">
                                Estimasi Tanggal Dicapai
                            </label>
                            <Input
                                type="date"
                                value={form.data.due_date}
                                onChange={(e) =>
                                    form.setData('due_date', e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase opacity-60">
                                Catatan/Alasan
                            </label>
                            <Input
                                placeholder="Tulis motivasimu di sini..."
                                value={form.data.note}
                                onChange={(e) =>
                                    form.setData('note', e.target.value)
                                }
                            />
                        </div>
                        <DialogFooter className="mt-4">
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="w-full font-bold"
                            >
                                Simpan Rencana
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ALERT DIALOG: DELETE */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Batalkan Goal ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Data impian <strong>{selectedGoal?.name}</strong>{' '}
                            akan dihapus. Saldo saat ini tidak akan hilang, tapi
                            progress target tidak lagi dipantau.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Ya, Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}

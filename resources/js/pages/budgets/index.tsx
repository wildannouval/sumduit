import AppLayout from '@/layouts/app-layout';
import { formatIDR } from '@/lib/money';
import { type BreadcrumbItem } from '@/types';
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
    CalendarDays,
    CheckCircle2,
    Edit2,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Budgets', href: '/budgets' }];

export default function BudgetIndex({
    budgets,
    categories,
    summary,
    filters,
    flash,
}: any) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState<any>(null);

    const form = useForm({
        month: filters.month || new Date().toISOString().slice(0, 7),
        category_id: (categories[0]?.id || '') as number | string,
        amount: 0,
        notes: '',
    });

    useEffect(() => {
        if (!isAddOpen && !isEditOpen) {
            form.reset();
            setSelectedBudget(null);
        }
    }, [isAddOpen, isEditOpen]);

    const openEdit = (budget: any) => {
        setSelectedBudget(budget);
        form.setData({
            month: budget.month,
            category_id: budget.category_id,
            amount: Number(budget.amount),
            notes: budget.notes || '',
        });
        setIsEditOpen(true);
    };

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isAddOpen ? '/budgets' : `/budgets/${selectedBudget.id}`;
        if (isAddOpen) {
            form.post(url, { onSuccess: () => setIsAddOpen(false) });
        } else {
            form.put(url, { onSuccess: () => setIsEditOpen(false) });
        }
    };

    const applyFilters = (next: any) => {
        router.get(
            '/budgets',
            { ...filters, ...next },
            { preserveState: true },
        );
    };

    const confirmDelete = () => {
        if (selectedBudget) {
            router.delete(`/budgets/${selectedBudget.id}`, {
                onSuccess: () => setIsDeleteOpen(false),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Anggaran Bulanan" />
            <div className="flex flex-col gap-6 p-6">
                {/* Alert Notification */}
                <div className="space-y-3">
                    {flash.success && (
                        <Alert className="animate-in border-emerald-200 bg-emerald-50 text-emerald-800 shadow-sm fade-in slide-in-from-top-2">
                            <CheckCircle2 className="h-4 w-4 stroke-emerald-600" />
                            <AlertTitle className="font-bold">
                                Berhasil
                            </AlertTitle>
                            <AlertDescription>{flash.success}</AlertDescription>
                        </Alert>
                    )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight uppercase">
                            Manajemen Budget
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Atur batasan belanja agar finansial tetap sehat.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="font-bold shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Alokasi Baru
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <SummaryCard
                        title="Total Budget"
                        value={summary.total_budget}
                        color="text-foreground"
                    />
                    <SummaryCard
                        title="Terpakai"
                        value={summary.total_spent}
                        color="text-red-600"
                    />
                    <SummaryCard
                        title="Sisa Saldo"
                        value={summary.total_remaining}
                        color="text-emerald-600"
                    />
                    <div className="flex flex-col justify-center rounded-xl border bg-slate-900 p-4 text-white shadow-lg">
                        <span className="text-[10px] font-bold uppercase opacity-60">
                            Utilitas Budget
                        </span>
                        <div className="text-2xl font-black">
                            {Math.round(summary.utilization_pct)}%
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-end gap-3 rounded-xl border bg-muted/30 p-4">
                    <div className="w-full space-y-1.5 md:w-64">
                        <label className="flex items-center gap-1 text-[10px] font-black uppercase opacity-60">
                            <Search className="h-3 w-3" /> Cari Kategori
                        </label>
                        <Input
                            value={filters.search}
                            onChange={(e) =>
                                applyFilters({ search: e.target.value })
                            }
                            placeholder="mis: Makan Luar..."
                            className="bg-background"
                        />
                    </div>
                    <div className="w-full space-y-1.5 md:w-44">
                        <label className="flex items-center gap-1 text-[10px] font-black uppercase opacity-60">
                            <CalendarDays className="h-3 w-3" /> Periode
                        </label>
                        <Input
                            type="month"
                            value={filters.month}
                            onChange={(e) =>
                                applyFilters({ month: e.target.value })
                            }
                            className="bg-background"
                        />
                    </div>
                </div>

                {/* Data Table */}
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50 text-left">
                            <tr className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                <th className="p-4">Kategori & Group</th>
                                <th className="p-4 text-right">Limit Budget</th>
                                <th className="p-4 text-right">Realisasi</th>
                                <th className="p-4 text-right">Sisa</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {budgets.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="p-12 text-center text-muted-foreground italic"
                                    >
                                        Belum ada anggaran untuk periode ini.
                                    </td>
                                </tr>
                            ) : (
                                budgets.map((b: any) => {
                                    const usage =
                                        b.amount > 0
                                            ? (b.spent / b.amount) * 100
                                            : 0;
                                    return (
                                        <tr
                                            key={b.id}
                                            className="transition-colors hover:bg-muted/20"
                                        >
                                            <td className="p-4">
                                                <div className="font-bold">
                                                    {b.category?.name}
                                                </div>
                                                <div className="text-[10px] font-medium uppercase opacity-50">
                                                    {b.group}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right font-semibold">
                                                {formatIDR(Number(b.amount))}
                                            </td>
                                            <td className="p-4 text-right font-bold text-red-600">
                                                {formatIDR(b.spent)}
                                                <div className="mt-1 ml-auto h-1 w-24 overflow-hidden rounded-full bg-muted">
                                                    <div
                                                        className={`h-full ${usage > 90 ? 'bg-red-500' : 'bg-blue-500'}`}
                                                        style={{
                                                            width: `${Math.min(usage, 100)}%`,
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <td
                                                className={`p-4 text-right font-black ${b.remaining >= 0 ? 'text-emerald-600' : 'text-red-700'}`}
                                            >
                                                {formatIDR(b.remaining)}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8"
                                                        onClick={() =>
                                                            openEdit(b)
                                                        }
                                                    >
                                                        <Edit2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-red-500 hover:text-red-600"
                                                        onClick={() => {
                                                            setSelectedBudget(
                                                                b,
                                                            );
                                                            setIsDeleteOpen(
                                                                true,
                                                            );
                                                        }}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL: ADD & EDIT */}
            <Dialog
                open={isAddOpen || isEditOpen}
                onOpenChange={(v) =>
                    !v && (setIsAddOpen(false) || setIsEditOpen(false))
                }
            >
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>
                            {isAddOpen
                                ? 'Alokasi Budget Baru'
                                : 'Edit Anggaran'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitForm} className="space-y-4 pt-2">
                        <div className="grid gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase opacity-60">
                                    Pilih Kategori
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
                                    <option value="" disabled>
                                        Pilih Kategori Pengeluaran
                                    </option>
                                    {categories.map((c: any) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name} ({c.group})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase opacity-60">
                                        Periode Bulan
                                    </label>
                                    <Input
                                        type="month"
                                        value={form.data.month}
                                        onChange={(e) =>
                                            form.setData(
                                                'month',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase opacity-60">
                                        Nominal Limit
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
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase opacity-60">
                                    Catatan Singkat
                                </label>
                                <Input
                                    placeholder="mis. Batasi makan luar bulan ini"
                                    value={form.data.notes}
                                    onChange={(e) =>
                                        form.setData('notes', e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="w-full font-bold"
                            >
                                Simpan Anggaran
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
                            Hapus batasan anggaran?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Data anggaran untuk kategori ini akan dihapus, namun
                            riwayat transaksi Anda tetap aman.
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

function SummaryCard({ title, value, color }: any) {
    return (
        <div className="rounded-xl border bg-card p-4 shadow-sm">
            <span className="text-[10px] font-bold uppercase opacity-60">
                {title}
            </span>
            <div className={`mt-1 truncate text-xl font-black ${color}`}>
                {formatIDR(value)}
            </div>
        </div>
    );
}

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
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
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
    BarChart3,
    CheckCircle2,
    Edit2,
    Inbox,
    PieChart,
    PlusCircle,
    Search,
    Target,
    Trash2,
    TrendingDown,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Anggaran', href: '/budgets' }];

const chartConfig = {
    amount: { label: 'Limit', color: 'hsl(var(--primary))' },
    spent: { label: 'Terpakai', color: '#ef4444' },
} satisfies ChartConfig;

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
        const method = isAddOpen ? 'post' : 'put';

        router[method](url, form.data as any, {
            onSuccess: () => {
                setIsAddOpen(false);
                setIsEditOpen(false);
            },
        });
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
                {/* 1. Notifications */}
                {flash.success && (
                    <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
                        <CheckCircle2 className="h-4 w-4 stroke-emerald-600" />
                        <AlertTitle className="font-bold tracking-tight">
                            Berhasil
                        </AlertTitle>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                {/* 2. Page Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight uppercase">
                            <Target className="h-6 w-6 text-primary" />{' '}
                            Manajemen Budget
                        </h1>
                        <p className="text-xs tracking-widest text-muted-foreground uppercase">
                            Kontrol pengeluaran bulanan Anda.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="text-xs font-bold tracking-widest uppercase shadow-lg"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Alokasi Baru
                    </Button>
                </div>

                {/* 3. Summary Section */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <CardSummary
                        title="Total Budget"
                        value={summary.total_budget}
                        icon={<Target className="h-4 w-4" />}
                    />
                    <CardSummary
                        title="Total Terpakai"
                        value={summary.total_spent}
                        color="text-red-600"
                        icon={<TrendingDown className="h-4 w-4" />}
                    />
                    <CardSummary
                        title="Total Sisa"
                        value={summary.total_remaining}
                        color="text-emerald-600"
                        icon={<PieChart className="h-4 w-4" />}
                    />
                    <Card className="border-none bg-slate-950 text-white shadow-xl dark:bg-slate-900">
                        <CardHeader className="p-4 pb-2">
                            <CardDescription className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                Utilitas Budget
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="text-3xl font-black">
                                {Math.round(summary.utilization_pct)}%
                            </div>
                            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                                <div
                                    className={`h-full transition-all ${summary.utilization_pct > 90 ? 'bg-red-500' : 'bg-primary'}`}
                                    style={{
                                        width: `${Math.min(summary.utilization_pct, 100)}%`,
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 4. Visualization & Filters */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b bg-muted/20">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2 text-sm font-black tracking-tighter uppercase">
                                    <BarChart3 className="h-4 w-4 text-primary" />{' '}
                                    Overview Budget vs Realisasi
                                </CardTitle>
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    type="month"
                                    value={filters.month}
                                    onChange={(e) =>
                                        applyFilters({ month: e.target.value })
                                    }
                                    className="h-8 w-[140px] bg-background text-xs font-bold uppercase"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {budgets.length > 0 ? (
                                <ChartContainer
                                    config={chartConfig}
                                    className="h-[200px] w-full"
                                >
                                    <BarChart data={budgets}>
                                        <CartesianGrid
                                            vertical={false}
                                            strokeDasharray="3 3"
                                            opacity={0.3}
                                        />
                                        <XAxis
                                            dataKey="category.name"
                                            tickLine={false}
                                            tickMargin={10}
                                            axisLine={false}
                                            tickFormatter={(value) =>
                                                value.slice(0, 6)
                                            }
                                            fontSize={10}
                                            fontWeight="bold"
                                        />
                                        <ChartTooltip
                                            content={<ChartTooltipContent />}
                                        />
                                        <Bar
                                            dataKey="amount"
                                            fill="var(--color-amount)"
                                            radius={[4, 4, 0, 0]}
                                        />
                                        <Bar
                                            dataKey="spent"
                                            fill="var(--color-spent)"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ChartContainer>
                            ) : (
                                <EmptyState
                                    title="Belum ada data visual"
                                    description="Tambahkan anggaran untuk melihat grafik perbandingan."
                                />
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-sm font-black tracking-tighter uppercase">
                                <Search className="h-4 w-4 text-primary" />{' '}
                                Filter Kategori
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-muted-foreground uppercase">
                                    Cari Nama Kategori
                                </Label>
                                <Input
                                    placeholder="Contoh: Makan, Internet..."
                                    value={filters.search}
                                    onChange={(e) =>
                                        applyFilters({ search: e.target.value })
                                    }
                                    className="bg-muted/30"
                                />
                            </div>
                            <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3 dark:border-blue-900/30 dark:bg-blue-900/10">
                                <p className="text-[10px] leading-relaxed font-bold text-blue-600 uppercase">
                                    Tips: Gunakan periode bulan untuk melihat
                                    histori anggaran bulan-bulan sebelumnya.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 5. Budget Table */}
                <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="py-3 text-[10px] font-black tracking-widest uppercase">
                                        Kategori & Group
                                    </TableHead>
                                    <TableHead className="py-3 text-right text-[10px] font-black tracking-widest uppercase">
                                        Limit
                                    </TableHead>
                                    <TableHead className="py-3 text-right text-[10px] font-black tracking-widest uppercase">
                                        Terpakai
                                    </TableHead>
                                    <TableHead className="py-3 text-right text-[10px] font-black tracking-widest uppercase">
                                        Sisa
                                    </TableHead>
                                    <TableHead className="py-3 text-right text-[10px] font-black tracking-widest uppercase">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {budgets.length > 0 ? (
                                    budgets.map((b: any) => {
                                        const usage =
                                            b.amount > 0
                                                ? (b.spent / b.amount) * 100
                                                : 0;
                                        return (
                                            <TableRow
                                                key={b.id}
                                                className="group transition-colors hover:bg-muted/30"
                                            >
                                                <TableCell>
                                                    <div className="text-sm leading-none font-bold">
                                                        {b.category?.name}
                                                    </div>
                                                    <div className="mt-1 text-[9px] font-bold tracking-tighter text-muted-foreground uppercase">
                                                        Group: {b.group}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-bold">
                                                    {formatIDR(
                                                        Number(b.amount),
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span
                                                            className={`text-xs font-black ${usage > 90 ? 'text-red-600' : 'text-foreground'}`}
                                                        >
                                                            {formatIDR(b.spent)}{' '}
                                                            ({Math.round(usage)}
                                                            %)
                                                        </span>
                                                        <div className="h-1 w-24 overflow-hidden rounded-full bg-muted">
                                                            <div
                                                                className={`h-full ${usage > 100 ? 'bg-red-600' : usage > 80 ? 'bg-orange-500' : 'bg-blue-500'}`}
                                                                style={{
                                                                    width: `${Math.min(usage, 100)}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell
                                                    className={`text-right font-black ${b.remaining < 0 ? 'text-red-600' : 'text-emerald-600'}`}
                                                >
                                                    {formatIDR(b.remaining)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
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
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                            <EmptyState
                                                title="Belum ada anggaran"
                                                description="Mulai alokasikan dana Anda untuk periode bulan ini."
                                            />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* --- MODALS --- */}
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
                            {isAddOpen ? 'Alokasi Budget' : 'Ubah Budget'}
                        </DialogTitle>
                        <DialogDescription className="text-xs font-medium tracking-tight uppercase">
                            Atur limit belanja bulanan per kategori.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitForm} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                Kategori Pengeluaran
                            </Label>
                            <Select
                                value={String(form.data.category_id)}
                                onValueChange={(v) =>
                                    form.setData('category_id', Number(v))
                                }
                            >
                                <SelectTrigger className="font-bold">
                                    <SelectValue placeholder="Pilih Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((c: any) => (
                                        <SelectItem
                                            key={c.id}
                                            value={String(c.id)}
                                        >
                                            {c.name} ({c.group})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                    Periode
                                </Label>
                                <Input
                                    type="month"
                                    value={form.data.month}
                                    onChange={(e) =>
                                        form.setData('month', e.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                    Nominal Limit
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
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                Catatan Tambahan
                            </Label>
                            <Input
                                placeholder="Misal: Kurangi jajan kopi"
                                value={form.data.notes}
                                onChange={(e) =>
                                    form.setData('notes', e.target.value)
                                }
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="h-11 w-full text-xs font-black tracking-widest uppercase"
                            >
                                {form.processing
                                    ? 'Menyimpan...'
                                    : 'Simpan Anggaran'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Hapus batasan anggaran ini?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Data anggaran akan dihapus, tetapi riwayat transaksi
                            kategori ini tetap ada.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 text-xs font-bold uppercase hover:bg-red-700"
                        >
                            Ya, Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}

// --- SUB COMPONENTS ---

function CardSummary({ title, value, color = 'text-foreground', icon }: any) {
    return (
        <Card className="overflow-hidden border-none bg-card shadow-sm ring-1 ring-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2 text-muted-foreground">
                <CardDescription className="text-[10px] font-black tracking-widest uppercase">
                    {title}
                </CardDescription>
                {icon}
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className={`truncate text-xl font-black ${color}`}>
                    {formatIDR(value)}
                </div>
            </CardContent>
        </Card>
    );
}

function EmptyState({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/5 p-8 text-center">
            <Inbox className="mb-3 h-8 w-8 text-muted-foreground opacity-20" />
            <h3 className="text-sm font-bold tracking-tight text-foreground uppercase">
                {title}
            </h3>
            <p className="mt-1 max-w-[200px] text-xs text-muted-foreground">
                {description}
            </p>
        </div>
    );
}

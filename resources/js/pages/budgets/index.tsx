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
import AppLayout from '@/layouts/app-layout';
import { formatIDR } from '@/lib/money';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import {
    BarChart3,
    CheckCircle2,
    Edit2,
    Inbox,
    MoreHorizontal,
    PlusCircle,
    Search,
    Target,
    Trash2,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Anggaran', href: '/budgets' }];

const chartConfig = {
    amount: { label: 'Limit', color: '#6366f1' },
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

            <div className="flex flex-col gap-6 p-6 font-sans">
                {/* 1. Notifications */}
                {flash.success && (
                    <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/20">
                        <CheckCircle2 className="h-4 w-4 stroke-emerald-600" />
                        <AlertTitle className="text-xs font-black tracking-widest uppercase">
                            Berhasil
                        </AlertTitle>
                        <AlertDescription className="text-xs font-medium">
                            {flash.success}
                        </AlertDescription>
                    </Alert>
                )}

                {/* 2. Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-3 text-3xl font-black tracking-tighter uppercase">
                            <Target className="h-8 w-8 text-primary" /> Anggaran
                        </h1>
                        <p className="mt-1 text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
                            Kendali pengeluaran bulanan Anda.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="h-10 px-6 text-xs font-black tracking-widest uppercase shadow-lg transition-transform hover:scale-105"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Alokasi Baru
                    </Button>
                </div>

                {/* 3. Summary Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <CardStat
                        label="Total Budget"
                        value={summary.total_budget}
                        color="text-foreground"
                    />
                    <CardStat
                        label="Total Terpakai"
                        value={summary.total_spent}
                        color="text-red-600"
                    />
                    <CardStat
                        label="Total Sisa"
                        value={summary.total_remaining}
                        color="text-emerald-600"
                    />

                    <Card className="relative overflow-hidden border-none bg-slate-950 text-white shadow-xl ring-1 ring-border dark:bg-slate-900">
                        <CardHeader className="p-4 pb-0 text-center">
                            <CardDescription className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                Utilitas Global
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center p-4 pt-1">
                            <div className="text-3xl font-black tabular-nums">
                                {Math.round(summary.utilization_pct)}%
                            </div>
                            <Progress
                                value={summary.utilization_pct}
                                className="mt-2 h-1.5 w-full bg-slate-800"
                                indicatorClassName={
                                    summary.utilization_pct > 90
                                        ? 'bg-red-500'
                                        : 'bg-primary'
                                }
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* 4. Analysis & Controls */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20 pb-4">
                            <CardTitle className="text-sm font-black tracking-tighter uppercase">
                                Visualisasi Budget vs Realisasi
                            </CardTitle>
                            <Input
                                type="month"
                                className="h-8 w-40 bg-background text-xs font-bold"
                                value={filters.month}
                                onChange={(e) =>
                                    applyFilters({ month: e.target.value })
                                }
                            />
                        </CardHeader>
                        <CardContent className="pt-6">
                            {budgets.length > 0 ? (
                                <ChartContainer
                                    config={chartConfig}
                                    className="h-[200px] w-full"
                                >
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart data={budgets}>
                                            <CartesianGrid
                                                vertical={false}
                                                strokeDasharray="3 3"
                                                opacity={0.2}
                                            />
                                            <XAxis
                                                dataKey="category.name"
                                                axisLine={false}
                                                tickLine={false}
                                                fontSize={10}
                                                fontWeight="bold"
                                                className="uppercase"
                                                tickFormatter={(v) =>
                                                    v.length > 8
                                                        ? `${v.substring(0, 6)}..`
                                                        : v
                                                }
                                            />
                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent />
                                                }
                                            />
                                            <Bar
                                                dataKey="amount"
                                                fill="var(--color-amount)"
                                                radius={[4, 4, 0, 0]}
                                                barSize={30}
                                            />
                                            <Bar
                                                dataKey="spent"
                                                fill="var(--color-spent)"
                                                radius={[4, 4, 0, 0]}
                                                barSize={30}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            ) : (
                                <EmptyState
                                    title="Visual Kosong"
                                    description="Belum ada data untuk periode ini."
                                />
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-border">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-black tracking-tighter uppercase">
                                Pencarian
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                    Nama Kategori
                                </Label>
                                <div className="relative">
                                    <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground opacity-50" />
                                    <Input
                                        placeholder="Cari..."
                                        className="h-10 pl-9 text-sm font-medium"
                                        value={filters.search}
                                        onChange={(e) =>
                                            applyFilters({
                                                search: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/20 dark:bg-blue-900/10">
                                <p className="text-[10px] leading-relaxed font-bold text-blue-600 uppercase dark:text-blue-400">
                                    Tips: Evaluasi anggaran setiap bulan untuk
                                    menyesuaikan gaya hidup dan target tabungan
                                    Anda.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 5. Data Table */}
                <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="border-b bg-muted/50">
                                <TableRow>
                                    <TableHead className="h-12 py-4 text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Kategori & Group
                                    </TableHead>
                                    <TableHead className="h-12 py-4 text-right text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Limit
                                    </TableHead>
                                    <TableHead className="h-12 py-4 text-center text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Pemakaian
                                    </TableHead>
                                    <TableHead className="h-12 py-4 text-right text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Sisa
                                    </TableHead>
                                    <TableHead className="h-12 py-4 text-right text-[11px] font-black tracking-widest text-muted-foreground uppercase">
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
                                                <TableCell className="py-5">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm font-black tracking-tight uppercase">
                                                            {b.category?.name}
                                                        </span>
                                                        <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase opacity-60">
                                                            Group: {b.group}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-black tabular-nums">
                                                    {formatIDR(
                                                        Number(b.amount),
                                                    )}
                                                </TableCell>
                                                <TableCell className="min-w-[150px]">
                                                    <div className="flex flex-col items-center gap-1.5">
                                                        <div className="flex w-full justify-between px-1 text-[10px] font-black tracking-tighter uppercase">
                                                            <span
                                                                className={
                                                                    usage > 90
                                                                        ? 'text-red-600'
                                                                        : 'text-muted-foreground'
                                                                }
                                                            >
                                                                {formatIDR(
                                                                    b.spent,
                                                                )}
                                                            </span>
                                                            <span
                                                                className={
                                                                    usage > 90
                                                                        ? 'text-red-600'
                                                                        : ''
                                                                }
                                                            >
                                                                {Math.round(
                                                                    usage,
                                                                )}
                                                                %
                                                            </span>
                                                        </div>
                                                        <Progress
                                                            value={usage}
                                                            className="h-1.5 w-full"
                                                            indicatorClassName={
                                                                usage > 100
                                                                    ? 'bg-red-600'
                                                                    : usage > 80
                                                                      ? 'bg-orange-500'
                                                                      : 'bg-blue-500'
                                                            }
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell
                                                    className={`text-right font-black tabular-nums ${b.remaining < 0 ? 'text-red-600' : 'text-emerald-600'}`}
                                                >
                                                    {formatIDR(b.remaining)}
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
                                                            <DropdownMenuLabel className="text-[10px] font-black uppercase opacity-50">
                                                                Manajemen
                                                            </DropdownMenuLabel>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    openEdit(b)
                                                                }
                                                                className="cursor-pointer text-xs font-bold uppercase"
                                                            >
                                                                <Edit2
                                                                    size={14}
                                                                    className="mr-2"
                                                                />{' '}
                                                                Ubah Limit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setSelectedBudget(
                                                                        b,
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
                                                                Hapus
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
                                            className="h-32 text-center font-medium text-muted-foreground italic"
                                        >
                                            Data anggaran periode ini kosong.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* --- MODAL: ADD & EDIT --- */}
            <Dialog
                open={isAddOpen || isEditOpen}
                onOpenChange={(v) => {
                    if (!v) {
                        setIsAddOpen(false);
                        setIsEditOpen(false);
                    }
                }}
            >
                <DialogContent className="overflow-hidden border-none p-0 shadow-2xl sm:max-w-[400px]">
                    <DialogHeader className="bg-slate-950 p-6 text-white">
                        <DialogTitle className="flex items-center gap-2 text-xl font-black tracking-tighter text-primary uppercase">
                            <BarChart3 size={24} />{' '}
                            {isAddOpen ? 'Alokasi Budget' : 'Ubah Batasan'}
                        </DialogTitle>
                    </DialogHeader>

                    <form
                        onSubmit={submitForm}
                        className="space-y-6 bg-card p-6"
                    >
                        <div className="space-y-2">
                            <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                Kategori Pengeluaran
                            </Label>
                            <Select
                                value={String(form.data.category_id)}
                                onValueChange={(v) =>
                                    form.setData('category_id', Number(v))
                                }
                            >
                                <SelectTrigger className="h-10 text-xs font-bold uppercase">
                                    <SelectValue placeholder="Pilih Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((c: any) => (
                                        <SelectItem
                                            key={c.id}
                                            value={String(c.id)}
                                            className="text-xs font-bold uppercase"
                                        >
                                            {c.name} ({c.group})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                    Periode Bulan
                                </Label>
                                <Input
                                    type="month"
                                    className="h-10 font-bold"
                                    value={form.data.month}
                                    onChange={(e) =>
                                        form.setData('month', e.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                    Nominal Limit
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
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                Catatan (Opsional)
                            </Label>
                            <Input
                                placeholder="Misal: Kurangi jajan kopi harian"
                                className="h-10"
                                value={form.data.notes}
                                onChange={(e) =>
                                    form.setData('notes', e.target.value)
                                }
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="h-12 w-full text-xs font-black tracking-[0.2em] uppercase shadow-lg transition-transform hover:scale-[1.02]"
                            >
                                Simpan Anggaran
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* --- ALERT DELETE --- */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-black tracking-tight uppercase">
                            Hapus anggaran?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm font-medium opacity-70">
                            Batasan belanja untuk kategori ini akan dihapus.
                            Riwayat transaksi Anda tidak akan terpengaruh.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel className="h-10 px-6 text-[10px] font-bold tracking-widest uppercase">
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="h-10 bg-red-600 px-6 text-[10px] font-bold tracking-widest uppercase hover:bg-red-700"
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

function CardStat({ label, value, color = 'text-foreground' }: any) {
    return (
        <Card className="border-none bg-card shadow-sm ring-1 ring-border">
            <CardHeader className="p-4 pb-1 text-muted-foreground">
                <CardDescription className="text-[10px] font-black tracking-widest uppercase">
                    {label}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div
                    className={`truncate text-xl font-black tabular-nums ${color}`}
                >
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
        <div className="flex h-48 flex-col items-center justify-center p-8 text-center opacity-30">
            <Inbox className="mb-3 h-8 w-8 text-muted-foreground" />
            <h3 className="text-sm font-black tracking-tight uppercase">
                {title}
            </h3>
            <p className="mt-1 text-xs">{description}</p>
        </div>
    );
}

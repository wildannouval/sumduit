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
    CalendarDays,
    CheckCircle2,
    Edit2,
    Flag,
    Inbox,
    MoreHorizontal,
    PlusCircle,
    Target,
    Trash2,
    Trophy,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Target Tabungan', href: '/goals' },
];

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
        const method = isAddOpen ? 'post' : 'put';

        router[method](url, form.data as any, {
            onSuccess: () => {
                setIsAddOpen(false);
                setIsEditOpen(false);
            },
        });
    };

    const confirmDelete = () => {
        if (selectedGoal) {
            router.delete(`/goals/${selectedGoal.id}`, {
                onSuccess: () => setIsDeleteOpen(false),
            });
        }
    };

    // Statistik Ringkasan
    const totalTarget = goals.reduce(
        (acc: number, g: any) => acc + Number(g.target_amount),
        0,
    );
    const totalSaved = goals.reduce(
        (acc: number, g: any) => acc + Number(g.current_amount),
        0,
    );
    const overallProgress =
        totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Target Tabungan" />

            <div className="flex flex-col gap-6 p-6 font-sans">
                {/* 1. Notifications */}
                {flash.success && (
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
                            <Trophy className="h-8 w-8 text-primary" /> Target
                            Tabungan
                        </h1>
                        <p className="mt-1 text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
                            Wujudkan impian finansial Anda selangkah demi
                            selangkah.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="h-10 px-6 text-xs font-black tracking-widest uppercase shadow-lg transition-transform hover:scale-105"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Goal Baru
                    </Button>
                </div>

                {/* 3. Summary Section */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="relative overflow-hidden border-none bg-slate-950 text-white shadow-xl ring-1 ring-border md:col-span-2 dark:bg-slate-900">
                        <div className="absolute top-[-10px] right-[-10px] rotate-12 opacity-10">
                            <Target size={180} />
                        </div>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                                Akumulasi Seluruh Impian
                            </CardDescription>
                            <CardTitle className="text-4xl font-black tracking-tighter tabular-nums">
                                {formatIDR(totalSaved)}
                                <span className="ml-2 text-sm font-normal text-slate-500 uppercase italic">
                                    / {formatIDR(totalTarget)}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <Progress
                                    value={overallProgress}
                                    className="h-1.5 flex-1 bg-slate-800"
                                    indicatorClassName="bg-primary"
                                />
                                <span className="text-xs font-black text-primary italic tabular-nums">
                                    {Math.round(overallProgress)}%
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col justify-center border-none bg-card px-6 shadow-sm ring-1 ring-border">
                        <CardDescription className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                            Rencana Aktif
                        </CardDescription>
                        <div className="mt-1 flex items-baseline gap-2 text-3xl font-black">
                            {goals.length}{' '}
                            <span className="text-xs font-bold tracking-tighter text-muted-foreground uppercase">
                                Goal
                            </span>
                        </div>
                    </Card>
                </div>

                {/* 4. Data Table */}
                <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="border-b bg-muted/50">
                                <TableRow>
                                    <TableHead className="py-4 text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Rencana Impian
                                    </TableHead>
                                    <TableHead className="py-4 text-right text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Target Nominal
                                    </TableHead>
                                    <TableHead className="py-4 text-center text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Progress Pencapaian
                                    </TableHead>
                                    <TableHead className="py-4 text-right text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Sisa Dana
                                    </TableHead>
                                    <TableHead className="px-6 py-4 text-right text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {goals.length > 0 ? (
                                    goals.map((g: any) => (
                                        <TableRow
                                            key={g.id}
                                            className="group transition-colors hover:bg-muted/30"
                                        >
                                            <TableCell className="py-5">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-black tracking-tight uppercase">
                                                            {g.name}
                                                        </span>
                                                        {g.progress_pct >=
                                                            100 && (
                                                            <Badge className="h-4 border-none bg-emerald-500/20 px-1.5 text-[8px] font-black text-emerald-600 uppercase">
                                                                Goal Tercapai
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {g.due_date && (
                                                        <div className="mt-1 flex items-center gap-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase opacity-60">
                                                            <CalendarDays
                                                                size={11}
                                                            />{' '}
                                                            Target: {g.due_date}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right text-sm font-black tabular-nums">
                                                {formatIDR(
                                                    Number(g.target_amount),
                                                )}
                                            </TableCell>
                                            <TableCell className="min-w-[200px]">
                                                <div className="flex flex-col gap-1.5 px-4">
                                                    <div className="flex items-center justify-between text-[10px] font-black tracking-tighter uppercase">
                                                        <span className="text-primary">
                                                            {formatIDR(
                                                                g.current_amount,
                                                            )}
                                                        </span>
                                                        <span className="tabular-nums">
                                                            {g.progress_pct}%
                                                        </span>
                                                    </div>
                                                    <Progress
                                                        value={g.progress_pct}
                                                        className="h-1.5 w-full"
                                                        indicatorClassName={
                                                            g.progress_pct >=
                                                            100
                                                                ? 'bg-emerald-500'
                                                                : 'bg-blue-500'
                                                        }
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell
                                                className={`text-right font-black tabular-nums ${g.remaining === 0 ? 'text-emerald-600 italic' : 'text-red-600'}`}
                                            >
                                                {g.remaining === 0
                                                    ? 'LUNAS'
                                                    : formatIDR(g.remaining)}
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
                                                        className="w-40 rounded-xl border-none font-sans shadow-xl ring-1 ring-border"
                                                    >
                                                        <DropdownMenuLabel className="text-[10px] font-black tracking-widest uppercase opacity-50">
                                                            Manajemen
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                openEdit(g)
                                                            }
                                                            className="cursor-pointer text-xs font-bold uppercase"
                                                        >
                                                            <Edit2
                                                                size={14}
                                                                className="mr-2"
                                                            />{' '}
                                                            Sesuaikan
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedGoal(
                                                                    g,
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
                                                            Batalkan Goal
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
                                                    Belum ada impian terdaftar
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
                <DialogContent className="overflow-hidden border-none p-0 shadow-2xl sm:max-w-[450px]">
                    <DialogHeader className="bg-slate-950 p-8 text-white">
                        <DialogTitle className="flex items-center gap-2 text-2xl font-black tracking-tighter uppercase">
                            <Flag size={24} className="text-primary" />{' '}
                            {isAddOpen
                                ? 'Tentukan Goal Baru'
                                : 'Ubah Rencana Goal'}
                        </DialogTitle>
                        <DialogDescription className="text-xs font-bold tracking-widest text-slate-400 uppercase opacity-80">
                            Beri identitas pada impian finansialmu.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={submitForm}
                        className="space-y-6 bg-card p-8 font-sans"
                    >
                        <div className="space-y-2">
                            <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                Nama Impian / Rencana
                            </Label>
                            <Input
                                placeholder="Misal: iPhone 16 Pro, Liburan Jepang, DP Rumah"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                                className="h-11 font-bold"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                    Target Nominal (Rp)
                                </Label>
                                <Input
                                    type="number"
                                    className="h-11 border-2 font-black text-primary tabular-nums focus-visible:ring-primary"
                                    value={form.data.target_amount}
                                    onChange={(e) =>
                                        form.setData(
                                            'target_amount',
                                            Number(e.target.value),
                                        )
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                    Saldo Awal (Rp)
                                </Label>
                                <Input
                                    type="number"
                                    className="h-11 font-bold tabular-nums"
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

                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                    Estimasi Tanggal Dicapai
                                </Label>
                                <Input
                                    type="date"
                                    className="h-11 font-bold"
                                    value={form.data.due_date}
                                    onChange={(e) =>
                                        form.setData('due_date', e.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                    Catatan Motivasi
                                </Label>
                                <Input
                                    placeholder="Misal: Untuk kenyamanan kerja"
                                    value={form.data.note}
                                    onChange={(e) =>
                                        form.setData('note', e.target.value)
                                    }
                                    className="h-11"
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="h-12 w-full text-xs font-black tracking-[0.2em] uppercase shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02]"
                            >
                                Simpan Rencana
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ALERT DELETE */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-black tracking-tight uppercase">
                            Batalkan rencana ini?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm leading-relaxed font-medium italic opacity-70">
                            Data impian akan dihapus permanen. Uang yang sudah
                            masuk ke dompet tidak akan berkurang, hanya progres
                            pelacakannya saja yang hilang.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel className="h-10 px-6 text-[10px] font-bold tracking-widest uppercase">
                            Tetap Simpan
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="h-10 bg-red-600 px-6 text-[10px] font-bold tracking-widest uppercase hover:bg-red-700"
                        >
                            Ya, Hapus Rencana
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}

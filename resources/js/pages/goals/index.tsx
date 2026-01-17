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

            <div className="flex flex-col gap-6 p-6">
                {/* 1. Notifications */}
                {flash.success && (
                    <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
                        <CheckCircle2 className="h-4 w-4 stroke-emerald-600" />
                        <AlertTitle className="text-sm font-bold tracking-tight uppercase">
                            Berhasil
                        </AlertTitle>
                        <AlertDescription className="text-xs">
                            {flash.success}
                        </AlertDescription>
                    </Alert>
                )}

                {/* 2. Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight uppercase">
                            <Trophy className="h-6 w-6 text-primary" /> Target
                            Tabungan
                        </h1>
                        <p className="text-xs tracking-widest text-muted-foreground uppercase">
                            Pantau progres impian finansial Anda.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="h-10 px-6 text-xs font-bold tracking-widest uppercase shadow-lg"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Goal Baru
                    </Button>
                </div>

                {/* 3. Overall Summary Card */}
                <Card className="relative overflow-hidden border-none bg-slate-950 text-white shadow-sm ring-1 ring-border dark:bg-slate-900">
                    <div className="pointer-events-none absolute top-[-10px] right-[-10px] rotate-12 text-white opacity-10">
                        <Target size={150} />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                            Akumulasi Seluruh Impian
                        </CardDescription>
                        <CardTitle className="text-4xl font-black">
                            {formatIDR(totalSaved)}{' '}
                            <span className="text-sm font-normal text-slate-500">
                                / {formatIDR(totalTarget)}
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <Progress
                                value={overallProgress}
                                className="h-2 flex-1 bg-slate-800"
                                indicatorClassName="bg-primary"
                            />
                            <span className="text-xs font-bold text-primary italic">
                                {Math.round(overallProgress)}% Tercapai
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* 4. Goals Table */}
                <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/50 text-[10px] font-black tracking-widest uppercase">
                                <TableRow>
                                    <TableHead className="px-4 py-3">
                                        Nama Rencana
                                    </TableHead>
                                    <TableHead className="py-3 text-right">
                                        Target
                                    </TableHead>
                                    <TableHead className="py-3">
                                        Progress
                                    </TableHead>
                                    <TableHead className="py-3 text-right">
                                        Sisa
                                    </TableHead>
                                    <TableHead className="py-3 text-right">
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
                                            <TableCell className="px-4 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm leading-none font-bold">
                                                            {g.name}
                                                        </span>
                                                        {g.progress_pct >=
                                                            100 && (
                                                            <Badge
                                                                variant="outline"
                                                                className="h-4 border-emerald-500 bg-emerald-50 px-1.5 text-[9px] font-black text-emerald-600 uppercase"
                                                            >
                                                                Goal Tercapai
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {g.due_date && (
                                                        <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground uppercase">
                                                            <CalendarDays className="h-3 w-3" />{' '}
                                                            Target: {g.due_date}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right text-sm font-bold italic">
                                                {formatIDR(
                                                    Number(g.target_amount),
                                                )}
                                            </TableCell>
                                            <TableCell className="min-w-[180px]">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center justify-between text-[10px] font-black tracking-tighter uppercase">
                                                        <span className="text-primary">
                                                            {formatIDR(
                                                                g.current_amount,
                                                            )}
                                                        </span>
                                                        <span>
                                                            {g.progress_pct}%
                                                        </span>
                                                    </div>
                                                    <Progress
                                                        value={g.progress_pct}
                                                        className="h-1.5"
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
                                                className={`text-right font-black ${g.remaining === 0 ? 'text-emerald-600' : 'text-red-600'}`}
                                            >
                                                {g.remaining === 0
                                                    ? 'LUNAS'
                                                    : formatIDR(g.remaining)}
                                            </TableCell>
                                            <TableCell className="px-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 opacity-50 group-hover:opacity-100"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel className="text-[10px] font-black uppercase">
                                                            Rencana
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                openEdit(g)
                                                            }
                                                        >
                                                            <Edit2 className="mr-2 h-3.5 w-3.5" />{' '}
                                                            Sesuaikan
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => {
                                                                setSelectedGoal(
                                                                    g,
                                                                );
                                                                setIsDeleteOpen(
                                                                    true,
                                                                );
                                                            }}
                                                        >
                                                            <Trash2 className="mr-2 h-3.5 w-3.5" />{' '}
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
                                            <div className="flex flex-col items-center justify-center text-muted-foreground opacity-30">
                                                <Inbox
                                                    size={48}
                                                    className="mb-2"
                                                />
                                                <p className="text-sm font-bold tracking-widest uppercase">
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
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-black tracking-tighter uppercase">
                            <Flag className="h-5 w-5 text-primary" />
                            {isAddOpen ? 'Tentukan Goal Baru' : 'Ubah Rencana'}
                        </DialogTitle>
                        <DialogDescription className="text-xs font-medium tracking-tight uppercase">
                            Beri nama impianmu dan tentukan targetnya.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitForm} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                Nama Impian
                            </Label>
                            <Input
                                placeholder="Misal: iPhone 16 Pro, Dana Darurat"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                    Target Nominal
                                </Label>
                                <Input
                                    type="number"
                                    className="font-bold"
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
                                <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                    Saldo Awal
                                </Label>
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

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                Estimasi Tanggal Dicapai
                            </Label>
                            <Input
                                type="date"
                                value={form.data.due_date}
                                onChange={(e) =>
                                    form.setData('due_date', e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                Catatan Motivasi
                            </Label>
                            <Input
                                placeholder="Kenapa impian ini penting?"
                                value={form.data.note}
                                onChange={(e) =>
                                    form.setData('note', e.target.value)
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
                                    ? 'Memproses...'
                                    : 'Simpan Rencana'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ALERT DELETE */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Batalkan rencana ini?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Data impian akan dihapus. Tabungan yang sudah
                            terkumpul di dompet tetap aman, hanya progres
                            targetnya yang hilang.
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

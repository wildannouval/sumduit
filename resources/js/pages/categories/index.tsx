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
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import {
    CheckCircle2,
    Edit2,
    Folders,
    Inbox,
    Layers,
    MoreHorizontal,
    PlusCircle,
    Tag,
    Tags,
    Trash2,
    TrendingDown,
    TrendingUp,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Kategori', href: '/categories' },
];

export default function CategoryIndex({ categories = [], flash = {} }: any) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);

    const form = useForm({
        name: '',
        type: 'expense' as 'income' | 'expense',
        group: 'needs' as 'needs' | 'wants' | 'saving',
    });

    useEffect(() => {
        if (!isAddOpen && !isEditOpen) {
            form.reset();
            setSelectedCategory(null);
        }
    }, [isAddOpen, isEditOpen]);

    const openEdit = (cat: any) => {
        setSelectedCategory(cat);
        form.setData({
            name: cat.name,
            type: cat.type,
            group: cat.group,
        });
        setIsEditOpen(true);
    };

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isAddOpen
            ? '/categories'
            : `/categories/${selectedCategory.id}`;
        const method = isAddOpen ? 'post' : 'put';

        router[method](url, form.data as any, {
            onSuccess: () => {
                setIsAddOpen(false);
                setIsEditOpen(false);
            },
        });
    };

    const confirmDelete = () => {
        if (selectedCategory) {
            router.delete(`/categories/${selectedCategory.id}`, {
                onSuccess: () => setIsDeleteOpen(false),
            });
        }
    };

    // Statistik Ringkasan
    const expenseCats = categories.filter(
        (c: any) => c.type === 'expense',
    ).length;
    const incomeCats = categories.filter(
        (c: any) => c.type === 'income',
    ).length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kategori Transaksi" />

            <div className="flex flex-col gap-6 p-6 font-sans">
                {/* 1. Notifications */}
                {flash?.success && (
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
                            <Tags className="h-8 w-8 text-primary" /> Kategori
                        </h1>
                        <p className="mt-1 text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
                            Struktur pengelompokan dana masuk dan keluar.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="h-10 px-6 text-xs font-black tracking-widest uppercase shadow-lg transition-transform hover:scale-105"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Kategori Baru
                    </Button>
                </div>

                {/* 3. Summary Section */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="relative overflow-hidden border-none bg-slate-950 text-white shadow-xl ring-1 ring-border dark:bg-slate-900">
                        <div className="absolute top-[-10px] right-[-10px] rotate-12 opacity-10">
                            <Layers size={140} />
                        </div>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                                Total Kategori
                            </CardDescription>
                            <CardTitle className="text-4xl font-black tracking-tighter tabular-nums">
                                {categories.length}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                                Label Aktif
                            </p>
                        </CardContent>
                    </Card>

                    <CardStat
                        label="Pengeluaran"
                        count={expenseCats}
                        icon={
                            <TrendingDown size={20} className="text-red-500" />
                        }
                    />
                    <CardStat
                        label="Pemasukan"
                        count={incomeCats}
                        icon={
                            <TrendingUp
                                size={20}
                                className="text-emerald-500"
                            />
                        }
                    />
                </div>

                {/* 4. Category Table (Shadcn UI) */}
                <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="border-b bg-muted/50">
                                <TableRow>
                                    <TableHead className="px-6 py-4 text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Nama Label
                                    </TableHead>
                                    <TableHead className="py-4 text-center text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Jenis Aliran
                                    </TableHead>
                                    <TableHead className="py-4 text-center text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Kelompok (Group)
                                    </TableHead>
                                    <TableHead className="px-6 py-4 text-right text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.length > 0 ? (
                                    categories.map((c: any) => (
                                        <TableRow
                                            key={c.id}
                                            className="group transition-colors hover:bg-muted/30"
                                        >
                                            <TableCell className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/5 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                                        <Tag size={16} />
                                                    </div>
                                                    <span className="text-sm font-black tracking-tight uppercase">
                                                        {c.name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant={
                                                        c.type === 'income'
                                                            ? 'outline'
                                                            : 'destructive'
                                                    }
                                                    className={`h-5 border-none px-2 text-[9px] font-black tracking-tighter uppercase ${c.type === 'income' ? 'bg-emerald-500/10 text-emerald-600' : ''}`}
                                                >
                                                    {c.type === 'income'
                                                        ? 'Pemasukan'
                                                        : 'Pengeluaran'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="inline-block rounded-full bg-muted px-3 py-0.5 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                    {c.group}
                                                </span>
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
                                                        <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black tracking-widest uppercase opacity-50">
                                                            Navigasi
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                openEdit(c)
                                                            }
                                                            className="cursor-pointer text-xs font-bold uppercase"
                                                        >
                                                            <Edit2
                                                                size={14}
                                                                className="mr-2"
                                                            />{' '}
                                                            Ubah Nama
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedCategory(
                                                                    c,
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
                                                            Hapus Label
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="h-48 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center opacity-30">
                                                <Inbox
                                                    size={48}
                                                    className="mb-2"
                                                />
                                                <p className="text-xs font-black tracking-widest text-muted-foreground uppercase">
                                                    Belum ada kategori
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
                <DialogContent className="overflow-hidden border-none p-0 shadow-2xl sm:max-w-[420px]">
                    <DialogHeader className="bg-slate-950 p-8 text-white">
                        <DialogTitle className="flex items-center gap-2 text-2xl font-black tracking-tighter uppercase">
                            <Folders size={24} className="text-primary" />{' '}
                            {isAddOpen ? 'Kategori Baru' : 'Ubah Kategori'}
                        </DialogTitle>
                        <DialogDescription className="text-xs font-bold tracking-widest text-slate-400 uppercase opacity-80">
                            Atur identitas label transaksi Anda.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={submitForm}
                        className="space-y-6 bg-card p-8 font-sans"
                    >
                        <div className="space-y-2">
                            <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                Nama Kategori
                            </Label>
                            <Input
                                placeholder="Misal: Makan Siang, Gaji Pokok"
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
                                    Jenis Aliran
                                </Label>
                                <Select
                                    value={form.data.type}
                                    onValueChange={(v: any) =>
                                        form.setData('type', v)
                                    }
                                >
                                    <SelectTrigger className="h-10 text-xs font-bold uppercase">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            value="expense"
                                            className="text-xs font-bold uppercase"
                                        >
                                            Pengeluaran
                                        </SelectItem>
                                        <SelectItem
                                            value="income"
                                            className="text-xs font-bold uppercase"
                                        >
                                            Pemasukan
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                    Kelompok (Group)
                                </Label>
                                <Select
                                    value={form.data.group}
                                    onValueChange={(v: any) =>
                                        form.setData('group', v)
                                    }
                                >
                                    <SelectTrigger className="h-10 text-xs font-bold uppercase">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            value="needs"
                                            className="text-xs font-bold uppercase"
                                        >
                                            Needs (Wajib)
                                        </SelectItem>
                                        <SelectItem
                                            value="wants"
                                            className="text-xs font-bold uppercase"
                                        >
                                            Wants (Gaya Hidup)
                                        </SelectItem>
                                        <SelectItem
                                            value="saving"
                                            className="text-xs font-bold uppercase"
                                        >
                                            Saving (Tabungan)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3 dark:border-blue-900/20 dark:bg-blue-900/10">
                            <p className="text-[10px] leading-relaxed font-bold tracking-tighter text-blue-600 uppercase dark:text-blue-400">
                                Tip: Gunakan kelompok "Needs" untuk biaya pokok
                                agar analisis budget 50/30/20 Anda akurat.
                            </p>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="h-12 w-full text-xs font-black tracking-[0.2em] uppercase shadow-lg transition-transform hover:scale-[1.02]"
                            >
                                {form.processing
                                    ? 'Menyimpan...'
                                    : 'Simpan Kategori'}
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
                            Hapus kategori?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm leading-relaxed font-medium italic opacity-70">
                            Kategori <strong>{selectedCategory?.name}</strong>{' '}
                            akan dihapus. Transaksi lama akan kehilangan
                            labelnya (menjadi 'Lainnya').
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

function CardStat({ label, count, icon }: any) {
    return (
        <Card className="overflow-hidden border-none bg-card shadow-sm ring-1 ring-border transition-all hover:bg-muted/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-1 text-muted-foreground">
                <CardDescription className="text-[10px] font-black tracking-widest uppercase">
                    {label}
                </CardDescription>
                {icon}
            </CardHeader>
            <CardContent className="flex items-baseline gap-2 p-4 pt-0">
                <div className="text-3xl font-black tabular-nums">{count}</div>
                <span className="text-[10px] font-bold tracking-tighter text-muted-foreground uppercase opacity-50">
                    Item
                </span>
            </CardContent>
        </Card>
    );
}

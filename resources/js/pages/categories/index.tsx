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

            <div className="flex flex-col gap-6 p-6">
                {/* 1. Notifications */}
                {flash?.success && (
                    <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/20">
                        <CheckCircle2 className="h-4 w-4 stroke-emerald-600" />
                        <AlertTitle className="text-xs font-bold tracking-widest uppercase">
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
                            <Tags className="h-6 w-6 text-primary" /> Kategori
                            Transaksi
                        </h1>
                        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                            Atur struktur pengelompokan keuangan Anda.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="h-10 px-6 text-xs font-bold tracking-widest uppercase shadow-lg"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Kategori Baru
                    </Button>
                </div>

                {/* 3. Summary Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="relative overflow-hidden border-none bg-slate-950 text-white shadow-sm ring-1 ring-border dark:bg-slate-900">
                        <div className="absolute top-[-10px] right-[-10px] rotate-12 opacity-10">
                            <Layers size={120} />
                        </div>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] font-black tracking-widest text-slate-400 uppercase opacity-70">
                                Total Kategori Aktif
                            </CardDescription>
                            <CardTitle className="text-4xl font-black">
                                {categories.length}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <CardStat
                        label="Kategori Pengeluaran"
                        count={expenseCats}
                        icon={<TrendingDown className="text-red-500" />}
                    />
                    <CardStat
                        label="Kategori Pemasukan"
                        count={incomeCats}
                        icon={<TrendingUp className="text-emerald-500" />}
                    />
                </div>

                {/* 4. Category Table */}
                <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/50 text-[10px] font-black tracking-widest uppercase">
                                <TableRow>
                                    <TableHead className="px-6 py-3">
                                        Nama Kategori
                                    </TableHead>
                                    <TableHead className="py-3 text-center">
                                        Jenis Aliran
                                    </TableHead>
                                    <TableHead className="py-3 text-center">
                                        Kelompok (Group)
                                    </TableHead>
                                    <TableHead className="px-6 py-3 text-right">
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
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                                        <Tag size={14} />
                                                    </div>
                                                    <span className="text-sm font-bold tracking-tight uppercase">
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
                                                    className={`h-5 px-2 text-[9px] font-black tracking-tighter uppercase ${c.type === 'income' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : ''}`}
                                                >
                                                    {c.type === 'income'
                                                        ? 'Pemasukan'
                                                        : 'Pengeluaran'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="rounded bg-muted px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase">
                                                    {c.group}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-6 text-right">
                                                <div className="flex justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8"
                                                        onClick={() =>
                                                            openEdit(c)
                                                        }
                                                    >
                                                        <Edit2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                                                        onClick={() => {
                                                            setSelectedCategory(
                                                                c,
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
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="h-48 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center text-muted-foreground opacity-30">
                                                <Inbox
                                                    size={48}
                                                    className="mb-2"
                                                />
                                                <p className="text-sm font-bold tracking-widest uppercase">
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
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-black tracking-tighter uppercase">
                            <Folders className="h-5 w-5 text-primary" />
                            {isAddOpen ? 'Kategori Baru' : 'Ubah Kategori'}
                        </DialogTitle>
                        <DialogDescription className="text-xs font-medium tracking-tight uppercase">
                            Atur identitas label transaksi Anda.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitForm} className="space-y-5 pt-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                Nama Kategori
                            </Label>
                            <Input
                                placeholder="Misal: Makan Siang, Gaji Pokok"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                                className="font-bold"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
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
                                        <SelectItem value="expense">
                                            Pengeluaran
                                        </SelectItem>
                                        <SelectItem value="income">
                                            Pemasukan
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
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
                                        <SelectItem value="needs">
                                            Needs (Wajib)
                                        </SelectItem>
                                        <SelectItem value="wants">
                                            Wants (Keinginan)
                                        </SelectItem>
                                        <SelectItem value="saving">
                                            Saving (Investasi)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3 dark:border-blue-900/30 dark:bg-blue-900/10">
                            <p className="text-[10px] leading-relaxed font-bold text-blue-600 uppercase dark:text-blue-400">
                                Tip: Gunakan kelompok "Needs" untuk biaya hidup
                                pokok agar analisis 50/30/20 Anda akurat.
                            </p>
                        </div>

                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="h-11 w-full text-xs font-black tracking-widest uppercase"
                            >
                                {form.processing
                                    ? 'Memproses...'
                                    : 'Simpan Kategori'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ALERT DELETE */}
            <AlertDialog
                open={isDeleteOpen}
                onOpenChange={(v) => {
                    if (!v) setIsDeleteOpen(false);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-black tracking-tighter uppercase">
                            Hapus kategori ini?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm">
                            Kategori <strong>{selectedCategory?.name}</strong>{' '}
                            akan dihapus. Transaksi yang sudah ada akan
                            kehilangan label kategorinya (menjadi 'Lainnya').
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="text-xs font-bold tracking-widest uppercase">
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 text-xs font-bold tracking-widest uppercase hover:bg-red-700"
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
        <Card className="overflow-hidden border-none bg-card shadow-sm ring-1 ring-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-1 text-muted-foreground">
                <CardDescription className="text-[10px] font-black tracking-widest uppercase">
                    {label}
                </CardDescription>
                {icon}
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="text-3xl font-black">
                    {count}{' '}
                    <span className="text-xs font-bold text-muted-foreground uppercase opacity-50">
                        Item
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

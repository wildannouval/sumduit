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
import { formatIDR } from '@/lib/money';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    Edit2,
    HardDrive,
    Inbox,
    MoreHorizontal,
    Package,
    PlusCircle,
    Search,
    Trash2,
    TrendingUp,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inventaris Aset', href: '/assets' },
];

export default function AssetIndex({ assets, summary, filters, flash }: any) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<any>(null);

    const form = useForm({
        name: '',
        value: 0,
        category: 'Elektronik',
        purchased_at: '',
        note: '',
    });

    useEffect(() => {
        if (!isAddOpen && !isEditOpen) {
            form.reset();
            setSelectedAsset(null);
        }
    }, [isAddOpen, isEditOpen]);

    const openEdit = (asset: any) => {
        setSelectedAsset(asset);
        form.setData({
            name: asset.name,
            value: Number(asset.value),
            category: asset.category || 'Elektronik',
            purchased_at: asset.purchased_at || '',
            note: asset.note || '',
        });
        setIsEditOpen(true);
    };

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isAddOpen ? '/assets' : `/assets/${selectedAsset.id}`;
        const method = isAddOpen ? 'post' : 'put';

        router[method](url, form.data as any, {
            onSuccess: () => {
                setIsAddOpen(false);
                setIsEditOpen(false);
            },
        });
    };

    const confirmDelete = () => {
        if (selectedAsset) {
            router.delete(`/assets/${selectedAsset.id}`, {
                onSuccess: () => setIsDeleteOpen(false),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Aset" />

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
                            <Package className="h-8 w-8 text-primary" />{' '}
                            Inventaris Aset
                        </h1>
                        <p className="mt-1 text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
                            Monitor kekayaan tetap dan barang berharga Anda.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="h-10 px-6 text-xs font-black tracking-widest uppercase shadow-lg transition-transform hover:scale-105"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Aset
                    </Button>
                </div>

                {/* 3. Summary Section */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="relative overflow-hidden border-none bg-slate-950 text-white shadow-xl ring-1 ring-border md:col-span-2 dark:bg-slate-900">
                        <div className="absolute top-[-10px] right-[-10px] rotate-12 opacity-10">
                            <TrendingUp size={160} />
                        </div>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                                Estimasi Nilai Total Aset
                            </CardDescription>
                            <CardTitle className="text-4xl font-black tracking-tighter tabular-nums">
                                {formatIDR(summary.total_value)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                                Terhitung dari {summary.total_assets} item
                                terdaftar.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col justify-center border-none bg-card px-6 shadow-sm ring-1 ring-border">
                        <CardDescription className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                            Jumlah Koleksi
                        </CardDescription>
                        <div className="mt-1 flex items-baseline gap-2 text-3xl font-black">
                            {summary.total_assets}{' '}
                            <span className="text-xs font-bold tracking-tighter text-muted-foreground uppercase">
                                Item
                            </span>
                        </div>
                    </Card>
                </div>

                {/* 4. Filter & Search Toolbar */}
                <div className="flex flex-col items-center justify-between gap-4 rounded-xl border-b bg-muted/20 p-4 ring-1 ring-border md:flex-row">
                    <div className="relative w-full md:max-w-sm">
                        <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground opacity-50" />
                        <Input
                            placeholder="Cari nama aset..."
                            className="h-9 border-muted bg-background pl-9 text-sm font-medium"
                            value={filters.search}
                            onChange={(e) =>
                                router.get(
                                    '/assets',
                                    { ...filters, search: e.target.value },
                                    { preserveState: true },
                                )
                            }
                        />
                    </div>
                    <div className="flex w-full items-center gap-2 md:w-auto">
                        <Select
                            value={filters.category}
                            onValueChange={(v) =>
                                router.get(
                                    '/assets',
                                    {
                                        ...filters,
                                        category: v === 'all' ? '' : v,
                                    },
                                    { preserveState: true },
                                )
                            }
                        >
                            <SelectTrigger className="h-9 w-full bg-background text-xs font-bold tracking-tighter uppercase md:w-[180px]">
                                <SelectValue placeholder="Semua Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Semua Kategori
                                </SelectItem>
                                <SelectItem value="Elektronik">
                                    Elektronik
                                </SelectItem>
                                <SelectItem value="Kendaraan">
                                    Kendaraan
                                </SelectItem>
                                <SelectItem value="Properti">
                                    Properti
                                </SelectItem>
                                <SelectItem value="Hobi">
                                    Hobi & Koleksi
                                </SelectItem>
                                <SelectItem value="Lainnya">Lainnya</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* 5. Assets Table (Shadcn Data Table) */}
                <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="border-b bg-muted/50">
                                <TableRow>
                                    <TableHead className="px-6 py-4 text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Informasi Aset
                                    </TableHead>
                                    <TableHead className="py-4 text-center text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Kategori
                                    </TableHead>
                                    <TableHead className="py-4 text-right text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Nilai Perolehan
                                    </TableHead>
                                    <TableHead className="px-6 py-4 text-right text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assets.length > 0 ? (
                                    assets.map((a: any) => (
                                        <TableRow
                                            key={a.id}
                                            className="group transition-colors hover:bg-muted/30"
                                        >
                                            <TableCell className="px-6 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <div className="text-sm font-black tracking-tight uppercase">
                                                        {a.name}
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                                                            <Calendar className="h-3 w-3" />{' '}
                                                            {a.purchased_at ||
                                                                'N/A'}
                                                        </span>
                                                        {a.note && (
                                                            <span className="max-w-[150px] truncate text-[10px] text-muted-foreground italic opacity-70">
                                                                "{a.note}"
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant="outline"
                                                    className="h-5 border-primary/20 bg-primary/5 px-2 text-[9px] font-black tracking-tighter text-primary uppercase"
                                                >
                                                    {a.category || 'General'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right text-base font-black text-blue-600 tabular-nums dark:text-blue-400">
                                                {formatIDR(Number(a.value))}
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
                                                        className="w-40 rounded-xl border-none shadow-xl ring-1 ring-border"
                                                    >
                                                        <DropdownMenuLabel className="text-[10px] font-black tracking-widest uppercase opacity-50">
                                                            Opsi Aset
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                openEdit(a)
                                                            }
                                                            className="cursor-pointer text-xs font-bold uppercase"
                                                        >
                                                            <Edit2
                                                                size={14}
                                                                className="mr-2"
                                                            />{' '}
                                                            Ubah Data
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedAsset(
                                                                    a,
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
                                                            Hapus Aset
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
                                                    Belum ada aset terdaftar
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
                            <HardDrive size={24} className="text-primary" />{' '}
                            {isAddOpen ? 'Catat Aset Baru' : 'Ubah Detail Aset'}
                        </DialogTitle>
                        <DialogDescription className="text-xs font-bold tracking-widest text-slate-400 uppercase opacity-80">
                            Data ini akan menambah estimasi kekayaan bersih
                            Anda.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={submitForm}
                        className="space-y-6 bg-card p-8"
                    >
                        <div className="space-y-2">
                            <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                Nama Barang / Aset
                            </Label>
                            <Input
                                placeholder="Misal: MacBook Pro M3, Honda Vario"
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
                                    Kategori
                                </Label>
                                <Select
                                    value={form.data.category}
                                    onValueChange={(v) =>
                                        form.setData('category', v)
                                    }
                                >
                                    <SelectTrigger className="h-10 text-xs font-bold uppercase">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            value="Elektronik"
                                            className="text-xs font-bold tracking-tighter uppercase"
                                        >
                                            Elektronik
                                        </SelectItem>
                                        <SelectItem
                                            value="Kendaraan"
                                            className="text-xs font-bold tracking-tighter uppercase"
                                        >
                                            Kendaraan
                                        </SelectItem>
                                        <SelectItem
                                            value="Properti"
                                            className="text-xs font-bold tracking-tighter uppercase"
                                        >
                                            Properti
                                        </SelectItem>
                                        <SelectItem
                                            value="Hobi"
                                            className="text-xs font-bold tracking-tighter uppercase"
                                        >
                                            Hobi & Koleksi
                                        </SelectItem>
                                        <SelectItem
                                            value="Lainnya"
                                            className="text-xs font-bold tracking-tighter uppercase"
                                        >
                                            Lainnya
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                    Nilai/Harga (Rp)
                                </Label>
                                <Input
                                    type="number"
                                    className="h-10 border-2 font-black tabular-nums focus-visible:ring-primary"
                                    value={form.data.value}
                                    onChange={(e) =>
                                        form.setData(
                                            'value',
                                            Number(e.target.value),
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                Tanggal Perolehan
                            </Label>
                            <Input
                                type="date"
                                className="h-11 font-bold"
                                value={form.data.purchased_at}
                                onChange={(e) =>
                                    form.setData('purchased_at', e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                                Catatan (SN/Warna/Spek)
                            </Label>
                            <Input
                                placeholder="Contoh: Space Gray, SN: 12345"
                                className="h-11"
                                value={form.data.note}
                                onChange={(e) =>
                                    form.setData('note', e.target.value)
                                }
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="h-12 w-full text-xs font-black tracking-[0.2em] uppercase shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02]"
                            >
                                {form.processing
                                    ? 'Memproses...'
                                    : 'Simpan Inventaris'}
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
                <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-black tracking-tight uppercase">
                            Hapus dari inventaris?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm leading-relaxed font-medium italic opacity-70">
                            Data aset ini akan dihapus permanen. Hal ini akan
                            mengurangi estimasi total kekayaan bersih Anda di
                            Dashboard.
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

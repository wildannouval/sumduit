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

            <div className="flex flex-col gap-6 p-6">
                {/* 1. Notifications */}
                {flash.success && (
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
                            <Package className="h-6 w-6 text-primary" />{' '}
                            Inventaris Aset
                        </h1>
                        <p className="text-xs tracking-widest text-muted-foreground uppercase">
                            Daftar kekayaan tetap dan barang berharga.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="h-10 px-6 text-xs font-bold tracking-widest uppercase shadow-lg"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Aset
                    </Button>
                </div>

                {/* 3. Summary Section */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="relative overflow-hidden border-none bg-slate-950 text-white shadow-sm ring-1 ring-border md:col-span-2 dark:bg-slate-900">
                        <div className="pointer-events-none absolute top-[-10px] right-[-10px] rotate-12 text-white opacity-10">
                            <TrendingUp size={150} />
                        </div>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                Estimasi Nilai Total Aset
                            </CardDescription>
                            <CardTitle className="text-4xl font-black">
                                {formatIDR(summary.total_value)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-slate-400 italic">
                                Terhitung dari {summary.total_assets} item
                                barang terdaftar.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none bg-card shadow-sm ring-1 ring-border">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] font-black tracking-widest uppercase">
                                Jumlah Koleksi
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex h-full items-center pb-6">
                            <div className="flex items-baseline gap-2 text-4xl font-black">
                                {summary.total_assets}{' '}
                                <span className="text-sm font-bold tracking-tighter text-muted-foreground uppercase">
                                    Item
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 4. Filters & Search */}
                <div className="flex flex-col items-center justify-between gap-3 rounded-xl bg-muted/20 p-4 ring-1 ring-border md:flex-row">
                    <div className="relative w-full md:max-w-sm">
                        <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari nama aset..."
                            className="h-9 bg-background pl-9 text-sm"
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

                {/* 5. Assets Table */}
                <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/50 text-[10px] font-black uppercase">
                                <TableRow>
                                    <TableHead className="px-4 py-3">
                                        Informasi Aset
                                    </TableHead>
                                    <TableHead className="py-3 text-center">
                                        Kategori
                                    </TableHead>
                                    <TableHead className="py-3 text-right">
                                        Nilai Perolehan
                                    </TableHead>
                                    <TableHead className="py-3 text-right">
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
                                            <TableCell className="px-4 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="text-sm leading-none font-bold">
                                                        {a.name}
                                                    </div>
                                                    <div className="mt-1 flex items-center gap-3">
                                                        <span className="flex items-center gap-1 text-[10px] font-medium tracking-tight text-muted-foreground uppercase">
                                                            <Calendar className="h-3 w-3" />{' '}
                                                            {a.purchased_at ||
                                                                'Tgl Tidak Tercatat'}
                                                        </span>
                                                        {a.note && (
                                                            <span className="max-w-[150px] truncate text-[10px] text-muted-foreground italic">
                                                                "{a.note}"
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant="outline"
                                                    className="h-5 border-primary/20 bg-primary/5 px-2 text-[9px] font-bold tracking-tighter text-primary uppercase"
                                                >
                                                    {a.category || 'General'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-black text-blue-600 dark:text-blue-400">
                                                {formatIDR(Number(a.value))}
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
                                                        <DropdownMenuLabel className="text-[10px] font-black tracking-widest uppercase">
                                                            Opsi Aset
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                openEdit(a)
                                                            }
                                                        >
                                                            <Edit2 className="mr-2 h-3.5 w-3.5" />{' '}
                                                            Ubah Detail
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => {
                                                                setSelectedAsset(
                                                                    a,
                                                                );
                                                                setIsDeleteOpen(
                                                                    true,
                                                                );
                                                            }}
                                                        >
                                                            <Trash2 className="mr-2 h-3.5 w-3.5" />{' '}
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
                                            className="h-48 text-center text-muted-foreground"
                                        >
                                            <div className="flex flex-col items-center justify-center opacity-30">
                                                <Inbox
                                                    size={48}
                                                    className="mb-2"
                                                />
                                                <p className="text-sm font-bold tracking-widest uppercase">
                                                    Tidak ada aset ditemukan
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

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
                                <HardDrive className="h-5 w-5 text-primary" />
                                {isAddOpen
                                    ? 'Catat Aset Baru'
                                    : 'Ubah Detail Aset'}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium tracking-tight uppercase">
                                Data ini akan menambah estimasi kekayaan bersih
                                Anda.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={submitForm} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                    Nama Barang / Aset
                                </Label>
                                <Input
                                    placeholder="Misal: MacBook Pro M3, Honda Vario"
                                    value={form.data.name}
                                    onChange={(e) =>
                                        form.setData('name', e.target.value)
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                        Kategori
                                    </Label>
                                    <Select
                                        value={form.data.category}
                                        onValueChange={(v) =>
                                            form.setData('category', v)
                                        }
                                    >
                                        <SelectTrigger className="font-bold">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
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
                                            <SelectItem value="Lainnya">
                                                Lainnya
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                        Nilai/Harga (Rp)
                                    </Label>
                                    <Input
                                        type="number"
                                        className="font-bold"
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
                                <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                    Tanggal Perolehan
                                </Label>
                                <Input
                                    type="date"
                                    value={form.data.purchased_at}
                                    onChange={(e) =>
                                        form.setData(
                                            'purchased_at',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                    Catatan Tambahan (SN/Warna/Spek)
                                </Label>
                                <Input
                                    placeholder="Contoh: Warna Space Gray, SN: 12345"
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
                                        : 'Simpan Inventaris'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* ALERT DELETE */}
                <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="font-black tracking-tighter uppercase">
                                Hapus dari inventaris?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm">
                                Data aset ini akan dihapus permanen dari daftar
                                kekayaan Anda.
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
            </div>
        </AppLayout>
    );
}

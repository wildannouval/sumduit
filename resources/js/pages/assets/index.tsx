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
    Calendar,
    CheckCircle2,
    Edit2,
    Package,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Assets', href: '/assets' }];

export default function AssetIndex({ assets, summary, filters, flash }: any) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<any>(null);

    const form = useForm({
        name: '',
        value: 0,
        category: '',
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
            category: asset.category || '',
            purchased_at: asset.purchased_at || '',
            note: asset.note || '',
        });
        setIsEditOpen(true);
    };

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isAddOpen ? '/assets' : `/assets/${selectedAsset.id}`;
        if (isAddOpen) {
            form.post(url, { onSuccess: () => setIsAddOpen(false) });
        } else {
            form.put(url, { onSuccess: () => setIsEditOpen(false) });
        }
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
                {/* Flash Message */}
                {flash.success && (
                    <Alert className="animate-in border-emerald-200 bg-emerald-50 text-emerald-800 shadow-sm fade-in slide-in-from-top-2">
                        <CheckCircle2 className="h-4 w-4 stroke-emerald-600" />
                        <AlertTitle className="font-bold">Berhasil</AlertTitle>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight uppercase">
                            Inventaris Aset
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola kepemilikan aset tetap dan barang berharga
                            Anda.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="font-bold"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Tambah Aset
                    </Button>
                </div>

                {/* Summary Section */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
                        <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                            <Package className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase opacity-60">
                                Jumlah Item
                            </p>
                            <p className="text-2xl font-black">
                                {summary.total_assets}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
                        <div className="rounded-lg bg-emerald-50 p-3 font-bold text-emerald-600">
                            Rp
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase opacity-60">
                                Estimasi Nilai Total
                            </p>
                            <p className="text-2xl font-black text-emerald-600">
                                {formatIDR(summary.total_value)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filter Search */}
                <div className="relative max-w-sm">
                    <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari nama aset..."
                        className="bg-card pl-9"
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

                {/* Table Section */}
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                <th className="p-4">Informasi Aset</th>
                                <th className="p-4">Kategori</th>
                                <th className="p-4 text-right">Nilai Aset</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {assets.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="p-12 text-center text-muted-foreground italic"
                                    >
                                        Tidak ada aset ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                assets.map((a: any) => (
                                    <tr
                                        key={a.id}
                                        className="transition-colors hover:bg-muted/20"
                                    >
                                        <td className="p-4">
                                            <div className="font-bold text-foreground">
                                                {a.name}
                                            </div>
                                            <div className="mt-1 flex items-center gap-1 text-[10px] font-medium opacity-60">
                                                <Calendar className="h-3 w-3" />{' '}
                                                {a.purchased_at ||
                                                    'Tanpa Tanggal'}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="rounded bg-secondary px-2 py-1 text-[10px] font-bold tracking-tight uppercase">
                                                {a.category || 'General'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-black tracking-tight text-blue-600">
                                            {formatIDR(Number(a.value))}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8"
                                                    onClick={() => openEdit(a)}
                                                >
                                                    <Edit2 className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-red-500"
                                                    onClick={() => {
                                                        setSelectedAsset(a);
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
                            {isAddOpen ? 'Catat Aset Baru' : 'Ubah Detail Aset'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitForm} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase opacity-60">
                                Nama Aset
                            </label>
                            <Input
                                placeholder="mis. MacBook Pro M3"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase opacity-60">
                                    Kategori
                                </label>
                                <Input
                                    placeholder="Elektronik"
                                    value={form.data.category}
                                    onChange={(e) =>
                                        form.setData('category', e.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase opacity-60">
                                    Harga/Nilai
                                </label>
                                <Input
                                    type="number"
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
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase opacity-60">
                                Tanggal Perolehan
                            </label>
                            <Input
                                type="date"
                                value={form.data.purchased_at}
                                onChange={(e) =>
                                    form.setData('purchased_at', e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase opacity-60">
                                Catatan Tambahan
                            </label>
                            <Input
                                placeholder="SN: 1234567..."
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
                                Simpan Aset
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
                            Hapus dari inventaris?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Data aset <strong>{selectedAsset?.name}</strong>{' '}
                            akan dihapus permanen. Tindakan ini tidak dapat
                            dibatalkan.
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

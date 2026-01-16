import AppLayout from '@/layouts/app-layout';
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
import { CheckCircle2, Edit2, Plus, Tags, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Categories', href: '/categories' },
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

    // Reset form saat modal ditutup
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

        // Pengecekan defensif untuk mencegah error .id dari null
        if (!isAddOpen && !selectedCategory?.id) return;

        const url = isAddOpen
            ? '/categories'
            : `/categories/${selectedCategory.id}`;

        if (isAddOpen) {
            form.post(url, { onSuccess: () => setIsAddOpen(false) });
        } else {
            form.put(url, { onSuccess: () => setIsEditOpen(false) });
        }
    };

    const confirmDelete = () => {
        if (!selectedCategory?.id) return;

        router.delete(`/categories/${selectedCategory.id}`, {
            onSuccess: () => setIsDeleteOpen(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kategori Transaksi" />
            <div className="flex flex-col gap-6 p-6">
                {/* Notifikasi Berhasil */}
                {flash?.success && (
                    <Alert className="animate-in border-emerald-200 bg-emerald-50 text-emerald-800 shadow-sm fade-in slide-in-from-top-2">
                        <CheckCircle2 className="h-4 w-4 stroke-emerald-600" />
                        <AlertTitle className="font-bold">Berhasil</AlertTitle>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight uppercase">
                            Daftar Kategori
                        </h1>
                        <p className="text-sm text-muted-foreground italic">
                            Atur pengelompokan transaksi Anda.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="font-bold"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Kategori Baru
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50 text-left">
                            <tr className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                <th className="p-4">Nama Kategori</th>
                                <th className="p-4">Jenis</th>
                                <th className="p-4">Alokasi Budget</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {categories.map((c: any) => (
                                <tr
                                    key={c.id}
                                    className="transition-colors hover:bg-muted/20"
                                >
                                    <td className="flex items-center gap-2 p-4 font-bold">
                                        <Tags className="h-3.5 w-3.5 opacity-40" />{' '}
                                        {c.name}
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${c.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                                        >
                                            {c.type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-[10px] font-medium tracking-tighter uppercase opacity-60">
                                        {c.group}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8"
                                                onClick={() => openEdit(c)}
                                            >
                                                <Edit2 className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-red-500 hover:bg-red-50"
                                                onClick={() => {
                                                    setSelectedCategory(c);
                                                    setIsDeleteOpen(true);
                                                }}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="p-12 text-center text-muted-foreground italic"
                                    >
                                        Belum ada kategori yang ditambahkan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL: CREATE & EDIT */}
            <Dialog
                open={isAddOpen || isEditOpen}
                onOpenChange={(v) =>
                    !v && (setIsAddOpen(false) || setIsEditOpen(false))
                }
            >
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>
                            {isAddOpen ? 'Kategori Baru' : 'Ubah Kategori'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitForm} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase opacity-60">
                                Nama Kategori
                            </label>
                            <Input
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                                placeholder="mis. Makan Siang"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase opacity-60">
                                    Jenis Aliran
                                </label>
                                <select
                                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                                    value={form.data.type}
                                    onChange={(e) =>
                                        form.setData(
                                            'type',
                                            e.target.value as any,
                                        )
                                    }
                                >
                                    <option value="expense">Pengeluaran</option>
                                    <option value="income">Pemasukan</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase opacity-60">
                                    Kelompok
                                </label>
                                <select
                                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                                    value={form.data.group}
                                    onChange={(e) =>
                                        form.setData(
                                            'group',
                                            e.target.value as any,
                                        )
                                    }
                                >
                                    <option value="needs">Needs (Wajib)</option>
                                    <option value="wants">
                                        Wants (Keinginan)
                                    </option>
                                    <option value="saving">
                                        Saving (Tabungan)
                                    </option>
                                </select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="w-full font-bold"
                            >
                                Simpan Kategori
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ALERT DIALOG: DELETE */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus kategori ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Kategori <strong>{selectedCategory?.name}</strong>{' '}
                            akan dihapus. Transaksi yang sudah ada akan
                            kehilangan referensi kategorinya namun nilainya
                            tetap aman.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}

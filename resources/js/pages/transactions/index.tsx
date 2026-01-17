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
import { Card, CardContent } from '@/components/ui/card';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { formatIDR } from '@/lib/money';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    ArrowRightLeft,
    CheckCircle2,
    Edit2,
    History,
    Inbox,
    MoreHorizontal,
    PlusCircle,
    Search,
    Target,
    Trash2,
    Wallet as WalletIcon,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Arus Kas', href: '/transactions' },
];

export default function TransactionIndex({
    transactions,
    wallets,
    categories,
    goals,
    flash,
}: any) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedTx, setSelectedTx] = useState<any>(null);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const form = useForm({
        type: 'expense' as 'income' | 'expense' | 'transfer',
        amount: 0,
        wallet_id: (wallets[0]?.id || '') as string | number,
        to_wallet_id: '' as string | number,
        category_id: '' as string | number | null,
        goal_id: '' as string | number | null,
        occurred_at: new Date().toISOString().split('T')[0],
        note: '',
    });

    useEffect(() => {
        if (!isAddOpen && !isEditOpen) {
            form.reset();
            setSelectedTx(null);
        }
    }, [isAddOpen, isEditOpen]);

    const openEdit = (tx: any) => {
        setSelectedTx(tx);
        form.setData({
            type: tx.type,
            amount: Number(tx.amount),
            wallet_id: tx.wallet_id,
            to_wallet_id: '',
            category_id: tx.category_id || '',
            goal_id: tx.goal_id || '',
            occurred_at: tx.occurred_at,
            note: tx.note || '',
        });
        setIsEditOpen(true);
    };

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        const url =
            form.data.type === 'transfer'
                ? '/wallets/transfer'
                : isAddOpen
                  ? '/transactions'
                  : `/transactions/${selectedTx.id}`;
        const method =
            isAddOpen || form.data.type === 'transfer' ? 'post' : 'put';

        router[method](url, form.data as any, {
            onSuccess: () => {
                setIsAddOpen(false);
                setIsEditOpen(false);
            },
        });
    };

    const confirmDelete = () => {
        if (selectedTx) {
            router.delete(`/transactions/${selectedTx.id}`, {
                onSuccess: () => setIsDeleteOpen(false),
            });
        }
    };

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'type', // Kolom hidden untuk filter Tabs
            header: '',
            enableHiding: true,
        },
        {
            accessorKey: 'occurred_at',
            header: 'Tanggal',
            cell: ({ row }) => (
                <div className="text-sm font-bold tracking-tight text-muted-foreground">
                    {row.getValue('occurred_at')}
                </div>
            ),
        },
        {
            accessorKey: 'category',
            header: 'Keterangan',
            cell: ({ row }) => {
                const tx = row.original;
                return (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-black tracking-tight uppercase">
                                {tx.category?.name || 'Lainnya'}
                            </span>
                            <Badge
                                variant={
                                    tx.type === 'income'
                                        ? 'outline'
                                        : 'destructive'
                                }
                                className={`h-4 border-none px-1.5 text-[9px] font-black uppercase ${tx.type === 'income' ? 'bg-emerald-500/20 text-emerald-600' : ''}`}
                            >
                                {tx.type === 'income' ? 'Masuk' : 'Keluar'}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                            <span className="flex items-center gap-1">
                                <WalletIcon size={12} /> {tx.wallet?.name}
                            </span>
                            {tx.goal && (
                                <span className="flex items-center gap-1 text-blue-500">
                                    <Target size={12} /> {tx.goal.name}
                                </span>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'note',
            header: 'Catatan',
            cell: ({ row }) => (
                <div className="max-w-[200px] truncate text-xs font-medium text-muted-foreground italic">
                    "{row.getValue('note') || '-'}"
                </div>
            ),
        },
        {
            accessorKey: 'amount',
            header: () => <div className="text-right">Nominal</div>,
            cell: ({ row }) => (
                <div
                    className={`text-right text-base font-black tabular-nums ${row.original.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}
                >
                    {row.original.type === 'income' ? '+' : '-'}
                    {formatIDR(row.original.amount)}
                </div>
            ),
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <div className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 opacity-50 hover:opacity-100"
                            >
                                <MoreHorizontal size={16} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-40 rounded-xl border-none shadow-xl ring-1 ring-border"
                        >
                            <DropdownMenuLabel className="text-[10px] font-black uppercase opacity-50">
                                Opsi
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => openEdit(row.original)}
                                className="cursor-pointer text-xs font-bold uppercase"
                            >
                                <Edit2 size={14} className="mr-2" /> Ubah
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedTx(row.original);
                                    setIsDeleteOpen(true);
                                }}
                                className="cursor-pointer text-xs font-bold text-red-600 uppercase"
                            >
                                <Trash2 size={14} className="mr-2" /> Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: transactions.data,
        columns,
        state: { columnFilters, columnVisibility: { type: false } }, // Sembunyikan kolom type
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Arus Kas" />

            <div className="flex flex-col gap-6 p-6 font-sans">
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

                {/* Header Area */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-3 text-3xl font-black tracking-tighter uppercase">
                            <History className="h-8 w-8 text-primary" /> Arus
                            Kas
                        </h1>
                        <p className="mt-1 text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
                            Monitor transaksi keuangan harian Anda.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="h-10 px-6 text-xs font-black tracking-widest uppercase shadow-lg transition-transform hover:scale-105"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Catat Transaksi
                    </Button>
                </div>

                {/* Filter & Data Table */}
                <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border">
                    <div className="flex flex-col items-center justify-between gap-4 border-b bg-muted/20 p-4 md:flex-row">
                        <Tabs
                            defaultValue="all"
                            className="w-full md:w-auto"
                            onValueChange={(v) =>
                                table
                                    .getColumn('type')
                                    ?.setFilterValue(v === 'all' ? '' : v)
                            }
                        >
                            <TabsList className="h-9 border bg-background">
                                <TabsTrigger
                                    value="all"
                                    className="px-4 text-[10px] font-black uppercase"
                                >
                                    Semua
                                </TabsTrigger>
                                <TabsTrigger
                                    value="income"
                                    className="px-4 text-[10px] font-black text-emerald-600 uppercase"
                                >
                                    Masuk
                                </TabsTrigger>
                                <TabsTrigger
                                    value="expense"
                                    className="px-4 text-[10px] font-black text-red-600 uppercase"
                                >
                                    Keluar
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className="relative w-full md:w-[280px]">
                            <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground opacity-50" />
                            <Input
                                placeholder="Cari catatan..."
                                className="h-9 border-muted bg-background pl-9 text-xs font-medium focus-visible:ring-primary"
                                value={
                                    (table
                                        .getColumn('note')
                                        ?.getFilterValue() as string) ?? ''
                                }
                                onChange={(e) =>
                                    table
                                        .getColumn('note')
                                        ?.setFilterValue(e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                className="h-10 py-2 text-[11px] font-black tracking-widest text-muted-foreground uppercase"
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext(),
                                                )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            className="group transition-colors hover:bg-muted/30"
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell
                                                        key={cell.id}
                                                        className="py-4"
                                                    >
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </TableCell>
                                                ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-32 text-center font-medium text-muted-foreground italic"
                                        >
                                            <Inbox
                                                size={32}
                                                className="mx-auto mb-2 opacity-20"
                                            />
                                            Data transaksi belum tersedia.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>

                    {/* Pagination */}
                    <div className="flex items-center justify-between border-t bg-muted/5 px-6 py-4">
                        <div className="text-[10px] font-black tracking-wider text-muted-foreground uppercase">
                            Page {transactions.current_page} of{' '}
                            {transactions.last_page}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    router.get(transactions.prev_page_url)
                                }
                                disabled={!transactions.prev_page_url}
                                className="h-8 px-3 text-[10px] font-black uppercase shadow-sm"
                            >
                                Prev
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    router.get(transactions.next_page_url)
                                }
                                disabled={!transactions.next_page_url}
                                className="h-8 px-3 text-[10px] font-black uppercase shadow-sm"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>

            {/* MODAL: FORM ADD/EDIT */}
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
                    <DialogHeader className="bg-slate-950 p-6 text-white">
                        <DialogTitle className="flex items-center gap-2 text-xl font-black tracking-tighter uppercase">
                            {isAddOpen ? <PlusCircle /> : <Edit2 />}{' '}
                            {isAddOpen ? 'Catat Arus Kas' : 'Ubah Transaksi'}
                        </DialogTitle>
                    </DialogHeader>

                    <form
                        onSubmit={submitForm}
                        className="space-y-5 bg-card p-6 font-sans"
                    >
                        {/* Selector Tipe */}
                        <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted p-1">
                            <Button
                                type="button"
                                variant={
                                    form.data.type === 'expense'
                                        ? 'destructive'
                                        : 'ghost'
                                }
                                className="h-8 text-[10px] font-black uppercase"
                                onClick={() => form.setData('type', 'expense')}
                            >
                                Keluar
                            </Button>
                            <Button
                                type="button"
                                variant={
                                    form.data.type === 'income'
                                        ? 'default'
                                        : 'ghost'
                                }
                                className={`h-8 text-[10px] font-black uppercase ${form.data.type === 'income' ? 'bg-emerald-600' : ''}`}
                                onClick={() => form.setData('type', 'income')}
                            >
                                Masuk
                            </Button>
                            <Button
                                type="button"
                                variant={
                                    form.data.type === 'transfer'
                                        ? 'secondary'
                                        : 'ghost'
                                }
                                className="h-8 text-[10px] font-black uppercase"
                                onClick={() => form.setData('type', 'transfer')}
                            >
                                <ArrowRightLeft size={12} className="mr-1" />{' '}
                                Transfer
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                    Nominal (Rp)
                                </Label>
                                <Input
                                    type="number"
                                    className="h-11 border-2 text-lg font-black tabular-nums focus-visible:ring-primary"
                                    value={form.data.amount}
                                    onChange={(e) =>
                                        form.setData(
                                            'amount',
                                            Number(e.target.value),
                                        )
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black text-muted-foreground uppercase">
                                        {form.data.type === 'transfer'
                                            ? 'Dari'
                                            : 'Dompet'}
                                    </Label>
                                    <Select
                                        value={String(form.data.wallet_id)}
                                        onValueChange={(v) =>
                                            form.setData('wallet_id', Number(v))
                                        }
                                    >
                                        <SelectTrigger className="h-9 text-xs font-bold uppercase">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {wallets.map((w: any) => (
                                                <SelectItem
                                                    key={w.id}
                                                    value={String(w.id)}
                                                >
                                                    {w.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {form.data.type === 'transfer' ? (
                                    <div className="animate-in space-y-1.5 fade-in slide-in-from-right-2">
                                        <Label className="text-[10px] font-black text-blue-600 uppercase">
                                            Ke Tujuan
                                        </Label>
                                        <Select
                                            value={String(
                                                form.data.to_wallet_id,
                                            )}
                                            onValueChange={(v) =>
                                                form.setData(
                                                    'to_wallet_id',
                                                    Number(v),
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-9 border-blue-200 bg-blue-50/30 text-xs font-bold uppercase">
                                                <SelectValue placeholder="Pilih Tujuan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {wallets.map((w: any) => (
                                                    <SelectItem
                                                        key={w.id}
                                                        value={String(w.id)}
                                                    >
                                                        {w.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ) : (
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black text-muted-foreground uppercase">
                                            Kategori
                                        </Label>
                                        <Select
                                            value={
                                                form.data.category_id
                                                    ? String(
                                                          form.data.category_id,
                                                      )
                                                    : 'null'
                                            }
                                            onValueChange={(v) =>
                                                form.setData(
                                                    'category_id',
                                                    v === 'null'
                                                        ? null
                                                        : Number(v),
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-9 text-xs font-bold uppercase">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="null">
                                                    Lainnya
                                                </SelectItem>
                                                {categories
                                                    .filter(
                                                        (c: any) =>
                                                            c.type ===
                                                            form.data.type,
                                                    )
                                                    .map((c: any) => (
                                                        <SelectItem
                                                            key={c.id}
                                                            value={String(c.id)}
                                                        >
                                                            {c.name}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase">
                                    Tanggal & Catatan
                                </Label>
                                <div className="grid gap-3">
                                    <Input
                                        type="date"
                                        className="h-9 font-bold"
                                        value={form.data.occurred_at}
                                        onChange={(e) =>
                                            form.setData(
                                                'occurred_at',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <Input
                                        placeholder="Tulis keterangan..."
                                        className="h-9 text-sm"
                                        value={form.data.note}
                                        onChange={(e) =>
                                            form.setData('note', e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="h-11 w-full text-xs font-black tracking-widest uppercase shadow-md"
                            >
                                Simpan
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
                            Hapus transaksi?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm font-medium">
                            Data ini akan dihapus secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-2">
                        <AlertDialogCancel className="h-10 px-6 text-[10px] font-bold tracking-widest text-foreground uppercase">
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="h-10 bg-red-600 px-6 text-[10px] font-bold tracking-widest uppercase hover:bg-red-700"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}

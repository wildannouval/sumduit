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
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
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
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    ArrowDownLeft,
    ArrowUpRight,
    CheckCircle2,
    ChevronDown,
    Columns2,
    Edit2,
    History, // Ganti LayoutColumns menjadi Columns2
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

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );
    const [rowSelection, setRowSelection] = useState({});

    const form = useForm({
        type: 'expense' as 'income' | 'expense',
        amount: 0,
        wallet_id: (wallets[0]?.id || null) as number | null,
        category_id: null as number | null,
        goal_id: null as number | null,
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
            category_id: tx.category_id,
            goal_id: tx.goal_id,
            occurred_at: tx.occurred_at,
            note: tx.note || '',
        });
        setIsEditOpen(true);
    };

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isAddOpen
            ? '/transactions'
            : `/transactions/${selectedTx.id}`;
        const method = isAddOpen ? 'post' : 'put';

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
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'occurred_at',
            header: 'Tanggal',
            cell: ({ row }) => (
                <div className="text-xs font-medium text-muted-foreground">
                    {row.getValue('occurred_at')}
                </div>
            ),
        },
        {
            accessorKey: 'category',
            header: 'Kategori & Dompet',
            cell: ({ row }) => {
                const tx = row.original;
                return (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">
                                {tx.category?.name || 'Lainnya'}
                            </span>
                            <Badge
                                variant={
                                    tx.type === 'income'
                                        ? 'outline'
                                        : 'destructive'
                                }
                                className={
                                    tx.type === 'income'
                                        ? 'border-emerald-500 bg-emerald-50 text-[10px] text-emerald-600'
                                        : 'text-[10px]'
                                }
                            >
                                {tx.type === 'income' ? 'Masuk' : 'Keluar'}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] tracking-tight text-muted-foreground uppercase">
                            <WalletIcon className="h-3 w-3" /> {tx.wallet?.name}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'note',
            header: 'Catatan',
            cell: ({ row }) => (
                <div className="max-w-[200px] truncate text-xs text-muted-foreground italic">
                    {row.getValue('note') || '-'}
                </div>
            ),
        },
        {
            accessorKey: 'amount',
            header: () => <div className="text-right">Nominal</div>,
            cell: ({ row }) => {
                const tx = row.original;
                return (
                    <div
                        className={`text-right font-black ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}
                    >
                        {tx.type === 'income' ? '+' : '-'}{' '}
                        {formatIDR(Number(tx.amount))}
                    </div>
                );
            },
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                const tx = row.original;
                return (
                    <div className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => openEdit(tx)}>
                                    <Edit2 className="mr-2 h-3.5 w-3.5" /> Ubah
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => {
                                        setSelectedTx(tx);
                                        setIsDeleteOpen(true);
                                    }}
                                >
                                    <Trash2 className="mr-2 h-3.5 w-3.5" />{' '}
                                    Hapus
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data: transactions.data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Arus Kas" />

            <div className="flex flex-col gap-6 p-6">
                {flash.success && (
                    <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
                        <CheckCircle2 className="h-4 w-4 stroke-emerald-600" />
                        <AlertTitle className="font-bold">Berhasil</AlertTitle>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight uppercase">
                            <History className="h-6 w-6 text-primary" /> Arus
                            Kas
                        </h1>
                        <p className="text-xs tracking-widest text-muted-foreground uppercase">
                            Manajemen transaksi keuangan Anda.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="px-6 text-xs font-bold tracking-widest uppercase shadow-lg"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Catat Transaksi
                    </Button>
                </div>

                <Tabs defaultValue="all" className="w-full">
                    <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
                            <TabsTrigger
                                value="all"
                                onClick={() =>
                                    table
                                        .getColumn('category')
                                        ?.setFilterValue('')
                                }
                            >
                                Semua
                            </TabsTrigger>
                            <TabsTrigger
                                value="income"
                                onClick={() =>
                                    table.setColumnFilters([
                                        { id: 'category', value: 'income' },
                                    ])
                                }
                            >
                                Pemasukan
                            </TabsTrigger>
                            <TabsTrigger
                                value="expense"
                                onClick={() =>
                                    table.setColumnFilters([
                                        { id: 'category', value: 'expense' },
                                    ])
                                }
                            >
                                Pengeluaran
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center gap-2">
                            <div className="relative w-full md:w-[250px]">
                                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari catatan..."
                                    value={
                                        (table
                                            .getColumn('note')
                                            ?.getFilterValue() as string) ?? ''
                                    }
                                    onChange={(event) =>
                                        table
                                            .getColumn('note')
                                            ?.setFilterValue(event.target.value)
                                    }
                                    className="h-9 bg-background pl-9 text-xs"
                                />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9"
                                    >
                                        <Columns2 className="mr-2 h-4 w-4" />{' '}
                                        Kolom{' '}
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {table
                                        .getAllColumns()
                                        .filter((column) => column.getCanHide())
                                        .map((column) => (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) =>
                                                    column.toggleVisibility(
                                                        !!value,
                                                    )
                                                }
                                            >
                                                {column.id}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    {table
                                        .getHeaderGroups()
                                        .map((headerGroup) => (
                                            <TableRow key={headerGroup.id}>
                                                {headerGroup.headers.map(
                                                    (header) => (
                                                        <TableHead
                                                            key={header.id}
                                                            className="py-3 text-[10px] font-black tracking-widest uppercase"
                                                        >
                                                            {header.isPlaceholder
                                                                ? null
                                                                : flexRender(
                                                                      header
                                                                          .column
                                                                          .columnDef
                                                                          .header,
                                                                      header.getContext(),
                                                                  )}
                                                        </TableHead>
                                                    ),
                                                )}
                                            </TableRow>
                                        ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                data-state={
                                                    row.getIsSelected() &&
                                                    'selected'
                                                }
                                                className="group transition-colors hover:bg-muted/30"
                                            >
                                                {row
                                                    .getVisibleCells()
                                                    .map((cell) => (
                                                        <TableCell
                                                            key={cell.id}
                                                            className="py-3"
                                                        >
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext(),
                                                            )}
                                                        </TableCell>
                                                    ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={columns.length}
                                                className="h-32 text-center text-muted-foreground"
                                            >
                                                Tidak ada data transaksi
                                                ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <div className="flex items-center justify-between border-t bg-muted/10 px-4 py-4 text-[10px] font-bold text-muted-foreground uppercase">
                            <div>
                                {
                                    table.getFilteredSelectedRowModel().rows
                                        .length
                                }{' '}
                                dari {table.getFilteredRowModel().rows.length}{' '}
                                baris dipilih.
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        router.get(transactions.prev_page_url)
                                    }
                                    disabled={!transactions.prev_page_url}
                                    className="h-8 text-[10px] font-black uppercase"
                                >
                                    Sebelumnya
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        router.get(transactions.next_page_url)
                                    }
                                    disabled={!transactions.next_page_url}
                                    className="h-8 text-[10px] font-black uppercase"
                                >
                                    Berikutnya
                                </Button>
                            </div>
                        </div>
                    </Card>
                </Tabs>
            </div>

            <Dialog
                open={isAddOpen || isEditOpen}
                onOpenChange={(v) => {
                    if (!v) {
                        setIsAddOpen(false);
                        setIsEditOpen(false);
                    }
                }}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-black tracking-tighter uppercase">
                            {isAddOpen ? (
                                <PlusCircle className="h-5 w-5 text-primary" />
                            ) : (
                                <Edit2 className="h-5 w-5 text-primary" />
                            )}
                            {isAddOpen ? 'Catat Transaksi' : 'Ubah Transaksi'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={submitForm} className="space-y-5 pt-2">
                        <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
                            <Button
                                type="button"
                                size="sm"
                                variant={
                                    form.data.type === 'expense'
                                        ? 'destructive'
                                        : 'ghost'
                                }
                                className="w-full font-bold shadow-sm"
                                onClick={() => form.setData('type', 'expense')}
                            >
                                <ArrowDownLeft className="mr-1 h-3 w-3" />{' '}
                                Pengeluaran
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant={
                                    form.data.type === 'income'
                                        ? 'default'
                                        : 'ghost'
                                }
                                className={`w-full font-bold ${form.data.type === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                                onClick={() => form.setData('type', 'income')}
                            >
                                <ArrowUpRight className="mr-1 h-3 w-3" />{' '}
                                Pemasukan
                            </Button>
                        </div>

                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                    Nominal (Rp)
                                </Label>
                                <Input
                                    type="number"
                                    className="text-lg font-bold"
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
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-muted-foreground uppercase">
                                        Dompet
                                    </Label>
                                    <Select
                                        value={String(form.data.wallet_id)}
                                        onValueChange={(v) =>
                                            form.setData('wallet_id', Number(v))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Dompet" />
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
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-muted-foreground uppercase">
                                        Kategori
                                    </Label>
                                    <Select
                                        value={
                                            form.data.category_id
                                                ? String(form.data.category_id)
                                                : 'null'
                                        }
                                        onValueChange={(v) =>
                                            form.setData(
                                                'category_id',
                                                v === 'null' ? null : Number(v),
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Kategori" />
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
                            </div>

                            <div className="space-y-2 rounded-md bg-blue-50/50 p-3 ring-1 ring-blue-100">
                                <Label className="flex items-center gap-1 text-[9px] font-black text-blue-600 uppercase">
                                    <Target className="h-3 w-3" /> Hubungkan
                                    Tabungan
                                </Label>
                                <Select
                                    value={
                                        form.data.goal_id
                                            ? String(form.data.goal_id)
                                            : 'null'
                                    }
                                    onValueChange={(v) =>
                                        form.setData(
                                            'goal_id',
                                            v === 'null' ? null : Number(v),
                                        )
                                    }
                                >
                                    <SelectTrigger className="h-8 border-blue-200 bg-background text-xs font-medium">
                                        <SelectValue placeholder="Pilih Goal" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="null">
                                            Tidak Ada
                                        </SelectItem>
                                        {goals.map((g: any) => (
                                            <SelectItem
                                                key={g.id}
                                                value={String(g.id)}
                                            >
                                                {g.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase">
                                    Tanggal & Catatan
                                </Label>
                                <Input
                                    type="date"
                                    value={form.data.occurred_at}
                                    onChange={(e) =>
                                        form.setData(
                                            'occurred_at',
                                            e.target.value,
                                        )
                                    }
                                />
                                <Input
                                    value={form.data.note}
                                    onChange={(e) =>
                                        form.setData('note', e.target.value)
                                    }
                                    placeholder="Misal: Makan siang"
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="h-11 w-full text-xs font-black tracking-widest uppercase"
                            >
                                {form.processing
                                    ? 'Menyimpan...'
                                    : 'Simpan Transaksi'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Hapus transaksi ini?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Data akan dihapus permanen dan saldo akan
                            disesuaikan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 font-bold hover:bg-red-700"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}

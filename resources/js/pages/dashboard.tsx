import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatIDR } from '@/lib/money';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowDownCircle,
    ArrowUpCircle,
    History,
    Inbox,
    Layers,
    TrendingDown,
    TrendingUp,
} from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

export default function Dashboard(props: any) {
    const {
        netWorth,
        statsToday,
        totals,
        runway,
        topSpending,
        recentTransactions,
    } = props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-6">
                {/* --- SECTION 1: NET WORTH HERO --- */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <Card className="relative flex flex-col justify-center overflow-hidden border-none bg-slate-950 py-6 text-white shadow-2xl lg:col-span-2 dark:bg-slate-900">
                        <div className="absolute top-[-20px] right-[-20px] rotate-12 opacity-10">
                            <Layers size={200} />
                        </div>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                                    Kekayaan Bersih (Net Worth)
                                </CardDescription>

                                {/* Indikator Pertumbuhan */}
                                <Badge
                                    className={`h-6 border-none px-2 text-[10px] font-black uppercase ${
                                        netWorth.growth_pct >= 0
                                            ? 'bg-emerald-500/20 text-emerald-400'
                                            : 'bg-red-500/20 text-red-400'
                                    }`}
                                    variant="outline"
                                >
                                    {netWorth.growth_pct >= 0 ? (
                                        <TrendingUp
                                            size={12}
                                            className="mr-1"
                                        />
                                    ) : (
                                        <TrendingDown
                                            size={12}
                                            className="mr-1"
                                        />
                                    )}
                                    {netWorth.growth_pct >= 0 ? '+' : ''}
                                    {netWorth.growth_pct}%
                                    <span className="ml-1 font-normal opacity-60">
                                        Bulan Ini
                                    </span>
                                </Badge>
                            </div>
                            <CardTitle className="text-5xl font-black tracking-tighter">
                                {formatIDR(netWorth.total)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10 mt-2 flex gap-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold tracking-tight text-slate-500 uppercase">
                                    Aset Likuid (Dompet)
                                </span>
                                <span className="text-sm font-bold text-emerald-400">
                                    {formatIDR(netWorth.liquid)}
                                </span>
                            </div>
                            <div className="flex flex-col border-l border-slate-800 pl-6">
                                <span className="text-[10px] font-bold tracking-tight text-slate-500 uppercase">
                                    Aset Tetap (Barang)
                                </span>
                                <span className="text-sm font-bold text-blue-400">
                                    {formatIDR(netWorth.fixed)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col justify-between overflow-hidden border-none bg-card shadow-sm ring-1 ring-border">
                        <CardHeader className="bg-muted/20 pb-2">
                            <CardDescription className="flex items-center gap-2 text-[10px] font-black tracking-widest text-primary uppercase">
                                <ArrowUpCircle size={14} /> Arus Hari Ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 py-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-muted-foreground uppercase">
                                    Pemasukan
                                </span>
                                <span className="font-black text-emerald-600">
                                    {formatIDR(statsToday.income)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-t pt-4">
                                <span className="text-xs font-medium text-muted-foreground uppercase">
                                    Pengeluaran
                                </span>
                                <span className="font-black text-red-600">
                                    {formatIDR(statsToday.spent)}
                                </span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-center border-t bg-muted/5 py-2.5">
                            <p className="text-[9px] font-bold tracking-tighter text-muted-foreground uppercase italic">
                                Berdasarkan ringkasan harian Anda
                            </p>
                        </CardFooter>
                    </Card>
                </div>

                {/* --- SECTION 2: MONTHLY METRICS --- */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <CardMetric
                        label="Uang Masuk"
                        value={totals.income}
                        icon={
                            <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
                        }
                        color="text-emerald-600"
                        description="Total sebulan ini"
                    />
                    <CardMetric
                        label="Uang Keluar"
                        value={totals.expense}
                        icon={
                            <ArrowDownCircle className="h-4 w-4 text-red-500" />
                        }
                        color="text-red-600"
                        description="Total sebulan ini"
                    />
                    <CardMetric
                        label="Cashflow Bersih"
                        value={totals.net}
                        icon={<Layers className="h-4 w-4 text-blue-500" />}
                        color="text-blue-600"
                        description="Surplus/Defisit"
                    />
                    <Card className="flex flex-col justify-center border-none bg-slate-100 shadow-sm ring-1 ring-border dark:bg-slate-800/30">
                        <CardHeader className="p-4 pb-0">
                            <CardDescription className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                Ketahanan Dana
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-baseline gap-2 p-4 pt-1">
                            <div className="text-3xl font-black">{runway}</div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                Bulan
                            </span>
                        </CardContent>
                    </Card>
                </div>

                {/* --- SECTION 3: BOTTOM AREA --- */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="border-none shadow-sm ring-1 ring-border lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base font-bold">
                                <TrendingDown className="h-4 w-4 text-red-500" />
                                Pengeluaran Terbesar per Kategori
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            {topSpending.length > 0 ? (
                                <div className="h-[250px] w-full pt-4">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart data={topSpending}>
                                            <CartesianGrid
                                                vertical={false}
                                                strokeDasharray="3 3"
                                                opacity={0.3}
                                            />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                fontSize={12}
                                                fontWeight="bold"
                                            />
                                            <Bar
                                                dataKey="amount"
                                                fill="#3b82f6"
                                                radius={[4, 4, 0, 0]}
                                                barSize={45}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <EmptyState
                                    title="Data belum cukup"
                                    description="Catat pengeluaran Anda untuk melihat grafik."
                                />
                            )}
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border">
                        <CardHeader className="pb-0">
                            <CardTitle className="flex items-center gap-2 text-base font-bold">
                                <History className="h-4 w-4 text-primary" />{' '}
                                Transaksi Terbaru
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="mt-4 p-0">
                            {recentTransactions.length > 0 ? (
                                <div className="divide-y border-t">
                                    {recentTransactions.map((tx: any) => (
                                        <div
                                            key={tx.id}
                                            className="flex items-center justify-between p-4 transition-colors hover:bg-muted/40"
                                        >
                                            <div className="flex flex-col gap-0.5">
                                                <span className="max-w-[120px] truncate text-sm font-bold">
                                                    {tx.category?.name ||
                                                        'Lainnya'}
                                                </span>
                                                <span className="text-[10px] font-medium tracking-tighter text-muted-foreground uppercase">
                                                    {tx.wallet?.name}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <div
                                                    className={`text-sm font-black ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}
                                                >
                                                    {tx.type === 'income'
                                                        ? '+'
                                                        : '-'}
                                                    {formatIDR(tx.amount)}
                                                </div>
                                                <div className="text-[9px] text-muted-foreground uppercase opacity-60">
                                                    {tx.occurred_at}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center text-xs text-muted-foreground italic">
                                    Belum ada transaksi.
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-center border-t bg-muted/10 p-3">
                            <Link
                                href="/transactions"
                                className="text-[10px] font-black text-primary uppercase transition-all hover:tracking-widest"
                            >
                                Lihat Semua Data
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

function CardMetric({ label, value, description, icon, color }: any) {
    return (
        <Card className="border-none bg-card shadow-sm ring-1 ring-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-1 text-muted-foreground">
                <CardDescription className="text-[10px] font-black tracking-widest uppercase">
                    {label}
                </CardDescription>
                {icon}
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className={`text-xl font-black ${color}`}>
                    {formatIDR(value)}
                </div>
                <p className="mt-1 text-[9px] font-medium tracking-tighter text-muted-foreground uppercase">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}

function EmptyState({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="flex h-[250px] flex-col items-center justify-center p-8 text-center">
            <Inbox className="mb-2 h-8 w-8 text-muted-foreground opacity-20" />
            <h3 className="text-xs font-semibold tracking-tight text-foreground uppercase">
                {title}
            </h3>
            <p className="mt-1 max-w-[150px] text-[10px] text-muted-foreground italic">
                {description}
            </p>
        </div>
    );
}

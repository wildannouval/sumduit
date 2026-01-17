import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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

            <div className="flex flex-col gap-8 p-8 font-sans">
                {' '}
                {/* Gunakan p-8 untuk ruang lebih lega */}
                {/* --- SECTION 1: NET WORTH HERO --- */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="relative flex flex-col justify-center overflow-hidden border-none bg-slate-950 p-2 text-white shadow-2xl lg:col-span-2 dark:bg-slate-900">
                        <div className="absolute top-[-20px] right-[-20px] rotate-12 opacity-10">
                            <Layers size={220} />
                        </div>
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-xs font-black tracking-[0.2em] text-slate-400 uppercase">
                                    Kekayaan Bersih (Net Worth)
                                </CardDescription>

                                <Badge
                                    className={`h-7 border-none px-3 text-[11px] font-black uppercase ${
                                        netWorth.growth_pct >= 0
                                            ? 'bg-emerald-500 text-emerald-950'
                                            : 'bg-red-500 text-red-950'
                                    }`}
                                >
                                    {netWorth.growth_pct >= 0 ? (
                                        <TrendingUp
                                            size={14}
                                            className="mr-1.5"
                                        />
                                    ) : (
                                        <TrendingDown
                                            size={14}
                                            className="mr-1.5"
                                        />
                                    )}
                                    {netWorth.growth_pct >= 0 ? '+' : ''}
                                    {netWorth.growth_pct}%
                                    <span className="ml-1 italic opacity-80">
                                        Bulan Ini
                                    </span>
                                </Badge>
                            </div>
                            <CardTitle className="text-5xl font-black tracking-tighter tabular-nums md:text-6xl">
                                {formatIDR(netWorth.total)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10 flex gap-8">
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                    Aset Likuid (Dompet)
                                </span>
                                <span className="text-lg font-black text-emerald-400 tabular-nums">
                                    {formatIDR(netWorth.liquid)}
                                </span>
                            </div>
                            <Separator
                                orientation="vertical"
                                className="h-12 bg-slate-800"
                            />
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                    Aset Tetap (Barang)
                                </span>
                                <span className="text-lg font-black text-blue-400 tabular-nums">
                                    {formatIDR(netWorth.fixed)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col justify-between overflow-hidden border-none bg-card shadow-sm ring-1 ring-border">
                        <CardHeader className="bg-muted/30 pb-4">
                            <CardDescription className="flex items-center gap-2 text-xs font-black tracking-widest text-primary uppercase">
                                <ArrowUpCircle size={16} /> Arus Kas Hari Ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 px-6 py-6">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold tracking-tight text-muted-foreground uppercase">
                                    Pemasukan
                                </span>
                                <span className="text-xl font-black text-emerald-600 tabular-nums">
                                    {formatIDR(statsToday.income)}
                                </span>
                            </div>
                            <Separator className="opacity-50" />
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold tracking-tight text-muted-foreground uppercase">
                                    Pengeluaran
                                </span>
                                <span className="text-xl font-black text-red-600 tabular-nums">
                                    {formatIDR(statsToday.spent)}
                                </span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-center border-t bg-muted/5 py-3">
                            <p className="text-[10px] font-black tracking-tighter text-muted-foreground uppercase italic opacity-60">
                                Update otomatis hari ini
                            </p>
                        </CardFooter>
                    </Card>
                </div>
                {/* --- SECTION 2: MONTHLY METRICS --- */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    <CardMetric
                        label="Cash-In (Bulan Ini)"
                        value={totals.income}
                        icon={
                            <ArrowUpCircle className="h-5 w-5 text-emerald-500" />
                        }
                        color="text-emerald-600"
                    />
                    <CardMetric
                        label="Cash-Out (Bulan Ini)"
                        value={totals.expense}
                        icon={
                            <ArrowDownCircle className="h-5 w-5 text-red-500" />
                        }
                        color="text-red-600"
                    />
                    <CardMetric
                        label="Net Cashflow"
                        value={totals.net}
                        icon={<Layers className="h-5 w-5 text-blue-500" />}
                        color="text-blue-600"
                    />

                    <Card className="flex flex-col justify-center border-none bg-slate-100 shadow-sm ring-1 ring-border dark:bg-slate-800/40">
                        <CardHeader className="p-6 pb-2">
                            <CardDescription className="text-xs font-black tracking-widest text-muted-foreground uppercase">
                                Runway Darurat
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-baseline gap-2 p-6 pt-0">
                            <div className="text-4xl font-black tracking-tighter tabular-nums">
                                {runway}
                            </div>
                            <span className="text-xs font-black text-muted-foreground uppercase">
                                Bulan
                            </span>
                        </CardContent>
                    </Card>
                </div>
                {/* --- SECTION 3: CHARTS & TRANSACTIONS --- */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <Card className="border-none shadow-sm ring-1 ring-border lg:col-span-2">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg font-black tracking-tight uppercase">
                                <TrendingDown className="h-5 w-5 text-red-500" />
                                Pengeluaran Terbesar
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 pl-2">
                            {topSpending.length > 0 ? (
                                <div className="h-[300px] w-full">
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
                                                className="uppercase"
                                            />
                                            <Bar
                                                dataKey="amount"
                                                fill="#3b82f6"
                                                radius={[6, 6, 0, 0]}
                                                barSize={50}
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

                    <Card className="flex flex-col border-none shadow-sm ring-1 ring-border">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg font-black tracking-tight uppercase">
                                <History className="h-5 w-5 text-primary" />{' '}
                                Transaksi Terbaru
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0">
                            {recentTransactions.length > 0 ? (
                                <div className="divide-y border-t">
                                    {recentTransactions.map((tx: any) => (
                                        <div
                                            key={tx.id}
                                            className="group flex items-center justify-between p-5 transition-colors hover:bg-muted/40"
                                        >
                                            <div className="flex flex-col gap-1">
                                                <span className="max-w-[140px] truncate text-[13px] font-black tracking-tight uppercase group-hover:text-primary">
                                                    {tx.category?.name ||
                                                        'Lainnya'}
                                                </span>
                                                <span className="text-[11px] font-bold tracking-tighter text-muted-foreground uppercase opacity-70">
                                                    {tx.wallet?.name}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <div
                                                    className={`text-[15px] font-black tabular-nums ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}
                                                >
                                                    {tx.type === 'income'
                                                        ? '+'
                                                        : '-'}
                                                    {formatIDR(tx.amount)}
                                                </div>
                                                <div className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">
                                                    {tx.occurred_at}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    title="Kosong"
                                    description="Belum ada transaksi."
                                />
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-center border-t bg-muted/5 p-4">
                            <Link
                                href="/transactions"
                                className="text-xs font-black tracking-widest text-primary uppercase transition-all hover:underline"
                            >
                                Lihat Semua Aktivitas
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

// --- Komponen Statis yang Dioptimasi ---

function CardMetric({ label, value, icon, color }: any) {
    return (
        <Card className="border-none bg-card shadow-sm ring-1 ring-border transition-all hover:bg-muted/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 pb-2 text-muted-foreground">
                <CardDescription className="text-[11px] font-black tracking-widest uppercase">
                    {label}
                </CardDescription>
                {icon}
            </CardHeader>
            <CardContent className="p-6 pt-1">
                <div className={`text-2xl font-black tabular-nums ${color}`}>
                    {formatIDR(value)}
                </div>
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
        <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <Inbox className="mb-3 h-10 w-10 text-muted-foreground opacity-20" />
            <h3 className="text-xs font-black tracking-widest text-foreground uppercase">
                {title}
            </h3>
            <p className="mt-1 text-[11px] text-muted-foreground italic">
                {description}
            </p>
        </div>
    );
}

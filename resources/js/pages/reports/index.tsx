import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { Input } from '@/components/ui/input';
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
import { Head, router } from '@inertiajs/react';
import {
    ArrowDownCircle,
    ArrowUpCircle,
    CalendarSearch,
    FileText,
    History,
    Inbox,
    ShieldAlert,
    ShieldCheck,
    ShieldQuestion,
    TrendingUp,
    Zap,
} from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Laporan Analisis', href: '/reports' },
];

const chartConfig = {
    income: { label: 'Pemasukan', color: '#10b981' },
    expense: { label: 'Pengeluaran', color: '#ef4444' },
} satisfies ChartConfig;

export default function ReportIndex({
    period,
    summary,
    dailyData,
    topCategories,
    insights,
    transactions,
}: any) {
    const monthStr = `${period.year}-${String(period.month).padStart(2, '0')}`;

    function applyPeriod(next: any) {
        router.get('/reports', { ...period, ...next }, { preserveState: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Analisis Finansial" />

            <div className="flex flex-col gap-6 p-6">
                {/* --- HEADER & PERIOD SELECTOR --- */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight uppercase">
                            <FileText className="h-6 w-6 text-primary" />{' '}
                            Analisis Finansial
                        </h1>
                        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                            Laporan mendalam performa keuangan Anda.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border bg-muted/50 p-1.5 shadow-sm">
                        <Input
                            type="number"
                            className="h-8 w-14 border-none bg-transparent p-0 text-center font-black"
                            value={period.month}
                            onChange={(e) =>
                                applyPeriod({ month: e.target.value })
                            }
                        />
                        <span className="text-muted-foreground opacity-30">
                            /
                        </span>
                        <Input
                            type="number"
                            className="h-8 w-20 border-none bg-transparent p-0 text-center font-black"
                            value={period.year}
                            onChange={(e) =>
                                applyPeriod({ year: e.target.value })
                            }
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                        >
                            <CalendarSearch size={16} />
                        </Button>
                    </div>
                </div>

                {/* --- SUMMARY STATS --- */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <ReportStatCard
                        label="Total Pemasukan"
                        value={summary.income}
                        icon={<ArrowUpCircle className="text-emerald-500" />}
                        color="text-emerald-600"
                    />
                    <ReportStatCard
                        label="Total Pengeluaran"
                        value={summary.expense}
                        icon={<ArrowDownCircle className="text-red-500" />}
                        color="text-red-600"
                    />
                    <ReportStatCard
                        label="Arus Kas Bersih"
                        value={summary.net}
                        icon={<Zap className="text-blue-500" />}
                        color={
                            summary.net >= 0 ? 'text-blue-600' : 'text-red-700'
                        }
                    />
                    <Card className="relative overflow-hidden border-none bg-slate-950 text-white shadow-xl dark:bg-slate-900">
                        <CardHeader className="p-4 pb-0">
                            <CardDescription className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                Savings Rate
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-3xl font-black">
                                {summary.savings_rate}%
                            </div>
                            <p className="mt-1 text-[9px] font-bold text-slate-500 uppercase">
                                Efisiensi Menabung
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* --- ANALYTICS GRID --- */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Daily Trend Chart */}
                    <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border lg:col-span-2">
                        <CardHeader className="border-b bg-muted/20 pb-4">
                            <CardTitle className="flex items-center gap-2 text-sm font-black tracking-tighter uppercase">
                                <TrendingUp
                                    size={16}
                                    className="text-primary"
                                />{' '}
                                Tren Arus Kas Harian
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <ChartContainer
                                config={chartConfig}
                                className="h-[250px] w-full"
                            >
                                <AreaChart data={dailyData}>
                                    <defs>
                                        <linearGradient
                                            id="colorIn"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#10b981"
                                                stopOpacity={0.3}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#10b981"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                        <linearGradient
                                            id="colorOut"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#ef4444"
                                                stopOpacity={0.3}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#ef4444"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        vertical={false}
                                        strokeDasharray="3 3"
                                        opacity={0.2}
                                    />
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        fontSize={10}
                                        fontWeight="bold"
                                    />
                                    <ChartTooltip
                                        content={<ChartTooltipContent />}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="income"
                                        stroke="#10b981"
                                        fill="url(#colorIn)"
                                        strokeWidth={2}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="expense"
                                        stroke="#ef4444"
                                        fill="url(#colorOut)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Emergency Runway Info */}
                    <Card className="flex flex-col items-center justify-center border-none p-6 text-center shadow-sm ring-1 ring-border">
                        <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-full border-8 border-muted p-4">
                            <div className="text-center">
                                <div className="text-4xl leading-none font-black">
                                    {summary.runway_months.toFixed(1)}
                                </div>
                                <div className="mt-1 text-[8px] font-bold text-muted-foreground uppercase">
                                    Bulan Aman
                                </div>
                            </div>
                        </div>
                        <h3 className="text-sm font-black tracking-tight uppercase">
                            Emergency Runway
                        </h3>
                        <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground uppercase">
                            Ketahanan dana darurat Anda terhadap rata-rata
                            pengeluaran bulanan.
                        </p>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Smart Insights */}
                    <div className="space-y-4">
                        <h2 className="flex items-center gap-2 px-1 text-xs font-black tracking-[0.2em] text-muted-foreground uppercase">
                            <ShieldCheck size={14} /> Smart Insights
                        </h2>
                        {insights.map((insight: any, idx: number) => (
                            <Card
                                key={idx}
                                className={`overflow-hidden border-none shadow-sm ring-1 ${
                                    insight.level === 'good'
                                        ? 'bg-emerald-50 ring-emerald-200 dark:bg-emerald-950/20'
                                        : insight.level === 'warn'
                                          ? 'bg-amber-50 ring-amber-200 dark:bg-amber-950/20'
                                          : 'bg-red-50 ring-red-200 dark:bg-red-950/20'
                                }`}
                            >
                                <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4 pb-2">
                                    <div
                                        className={`rounded-lg p-1.5 ${
                                            insight.level === 'good'
                                                ? 'bg-emerald-500/20 text-emerald-600'
                                                : insight.level === 'warn'
                                                  ? 'bg-amber-500/20 text-amber-600'
                                                  : 'bg-red-500/20 text-red-600'
                                        }`}
                                    >
                                        {insight.level === 'good' ? (
                                            <ShieldCheck size={16} />
                                        ) : insight.level === 'warn' ? (
                                            <ShieldQuestion size={16} />
                                        ) : (
                                            <ShieldAlert size={16} />
                                        )}
                                    </div>
                                    <CardTitle className="text-xs font-black tracking-tight uppercase">
                                        {insight.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <p className="text-xs leading-relaxed font-medium opacity-80">
                                        {insight.body}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Detailed Transactions */}
                    <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/10">
                            <CardTitle className="flex items-center gap-2 text-sm font-black tracking-tighter uppercase">
                                <History size={16} className="text-primary" />{' '}
                                Rincian Transaksi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/30 text-[10px] font-black tracking-widest uppercase">
                                    <TableRow>
                                        <TableHead className="px-4 py-3">
                                            Keterangan
                                        </TableHead>
                                        <TableHead>Dompet</TableHead>
                                        <TableHead className="text-right">
                                            Nominal
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.length > 0 ? (
                                        transactions.map((t: any) => (
                                            <TableRow
                                                key={t.id}
                                                className="group transition-colors hover:bg-muted/30"
                                            >
                                                <TableCell className="px-4 py-3">
                                                    <div className="text-sm leading-none font-bold">
                                                        {t.category?.name ||
                                                            'Lainnya'}
                                                    </div>
                                                    <div className="mt-1 text-[10px] font-medium text-muted-foreground uppercase">
                                                        {t.occurred_at}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-xs font-medium text-muted-foreground uppercase">
                                                    {t.wallet?.name}
                                                </TableCell>
                                                <TableCell
                                                    className={`text-right font-black ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}
                                                >
                                                    {t.type === 'income'
                                                        ? '+'
                                                        : '-'}
                                                    {formatIDR(t.amount)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={3}
                                                className="h-32 text-center text-muted-foreground italic opacity-30"
                                            >
                                                <Inbox
                                                    size={32}
                                                    className="mx-auto mb-2"
                                                />
                                                Belum ada data transaksi.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

function ReportStatCard({ label, value, icon, color }: any) {
    return (
        <Card className="border-none bg-card shadow-sm ring-1 ring-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-1 text-muted-foreground">
                <CardDescription className="text-[10px] font-black tracking-widest uppercase">
                    {label}
                </CardDescription>
                {icon}
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className={`truncate text-xl font-black ${color}`}>
                    {formatIDR(value)}
                </div>
            </CardContent>
        </Card>
    );
}

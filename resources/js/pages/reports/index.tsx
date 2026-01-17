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
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis,
} from 'recharts';

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
    function applyPeriod(next: any) {
        router.get('/reports', { ...period, ...next }, { preserveState: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Analisis Finansial" />

            <div className="flex flex-col gap-6 p-6 font-sans">
                {/* --- HEADER & PERIOD SELECTOR --- */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-3 text-3xl font-black tracking-tighter uppercase">
                            <FileText className="h-8 w-8 text-primary" />{' '}
                            Analisis Finansial
                        </h1>
                        <p className="mt-1 text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
                            Evaluasi kesehatan keuangan Anda periode ini.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-2 shadow-sm">
                        <div className="flex flex-col">
                            <Label className="ml-2 text-[9px] font-black uppercase opacity-50">
                                Bulan / Tahun
                            </Label>
                            <div className="flex items-center">
                                <Input
                                    type="number"
                                    className="h-8 w-12 border-none bg-transparent text-center text-sm font-black"
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
                                    className="h-8 w-20 border-none bg-transparent text-center text-sm font-black"
                                    value={period.year}
                                    onChange={(e) =>
                                        applyPeriod({ year: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className="mx-1 h-8 w-[1px] bg-border" />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-lg"
                        >
                            <CalendarSearch
                                size={18}
                                className="text-primary"
                            />
                        </Button>
                    </div>
                </div>

                {/* --- SUMMARY STATS --- */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <ReportStatCard
                        label="Incomes"
                        value={summary.income}
                        icon={<ArrowUpCircle className="text-emerald-500" />}
                        color="text-emerald-600"
                    />
                    <ReportStatCard
                        label="Expenses"
                        value={summary.expense}
                        icon={<ArrowDownCircle className="text-red-500" />}
                        color="text-red-600"
                    />
                    <ReportStatCard
                        label="Net Flow"
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
                        <CardContent className="flex items-baseline gap-2 p-4 pt-1">
                            <div className="text-3xl font-black tabular-nums">
                                {summary.savings_rate}%
                            </div>
                            <span className="text-[10px] font-bold tracking-tighter text-slate-500 uppercase italic">
                                of income
                            </span>
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
                                Fluktuasi Kas Harian
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <ChartContainer
                                config={chartConfig}
                                className="h-[250px] w-full"
                            >
                                <ResponsiveContainer width="100%" height="100%">
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
                                                    stopOpacity={0.2}
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
                                                    stopOpacity={0.2}
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
                                            fontWeight="black"
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
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Emergency Runway Gauge */}
                    <Card className="flex flex-col items-center justify-center border-none p-6 text-center shadow-sm ring-1 ring-border">
                        <div className="relative mb-6 flex h-36 w-36 items-center justify-center">
                            <svg className="h-full w-full rotate-[-90deg]">
                                <circle
                                    cx="72"
                                    cy="72"
                                    r="60"
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    className="text-muted/20"
                                />
                                <circle
                                    cx="72"
                                    cy="72"
                                    r="60"
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    strokeDasharray="377"
                                    strokeDashoffset={
                                        377 -
                                        (377 *
                                            Math.min(
                                                summary.runway_months,
                                                12,
                                            )) /
                                            12
                                    }
                                    strokeLinecap="round"
                                    className="text-primary transition-all duration-1000"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="text-4xl font-black tabular-nums">
                                    {summary.runway_months}
                                </div>
                                <div className="text-[8px] font-black tracking-widest text-muted-foreground uppercase">
                                    Bulan Aman
                                </div>
                            </div>
                        </div>
                        <h3 className="text-sm font-black tracking-tight uppercase">
                            Emergency Runway
                        </h3>
                        <p className="mt-2 text-[10px] leading-relaxed font-medium text-muted-foreground uppercase opacity-60">
                            Ketahanan dana darurat Anda terhadap rata-rata
                            pengeluaran.
                        </p>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Smart Insights */}
                    <div className="space-y-4">
                        <h2 className="flex items-center gap-2 px-1 text-[11px] font-black tracking-[0.2em] text-muted-foreground uppercase opacity-70">
                            <ShieldCheck size={14} /> Smart Financial Insights
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
                                    <p className="text-[11px] leading-relaxed font-bold tracking-tighter uppercase opacity-70">
                                        {insight.body}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Detailed Transactions Table */}
                    <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border lg:col-span-2">
                        <CardHeader className="border-b bg-muted/10">
                            <CardTitle className="flex items-center gap-2 text-sm font-black tracking-tighter uppercase">
                                <History size={16} className="text-primary" />{' '}
                                Rincian Mutasi Periode Ini
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow>
                                        <TableHead className="px-6 py-4 text-[10px] font-black tracking-widest uppercase">
                                            Keterangan & Tanggal
                                        </TableHead>
                                        <TableHead className="text-center text-[10px] font-black tracking-widest uppercase">
                                            Sumber
                                        </TableHead>
                                        <TableHead className="px-6 text-right text-[10px] font-black tracking-widest uppercase">
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
                                                <TableCell className="px-6 py-4">
                                                    <div className="text-sm font-black tracking-tight uppercase">
                                                        {t.category?.name ||
                                                            'Lainnya'}
                                                    </div>
                                                    <div className="mt-1 text-[10px] font-bold text-muted-foreground uppercase opacity-50">
                                                        {t.occurred_at}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge
                                                        variant="outline"
                                                        className="h-5 border-muted-foreground/20 px-2 text-[9px] font-black tracking-tighter text-muted-foreground uppercase"
                                                    >
                                                        {t.wallet?.name}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell
                                                    className={`px-6 text-right font-black tabular-nums ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}
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
                                                Data transaksi kosong.
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
        <Card className="border-none bg-card shadow-sm ring-1 ring-border transition-all hover:bg-muted/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-1 text-muted-foreground">
                <CardDescription className="text-[10px] font-black tracking-widest uppercase">
                    {label}
                </CardDescription>
                {icon}
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div
                    className={`truncate text-xl font-black tabular-nums ${color}`}
                >
                    {formatIDR(value)}
                </div>
            </CardContent>
        </Card>
    );
}

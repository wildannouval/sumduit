import AppLayout from '@/layouts/app-layout';
import { formatIDR } from '@/lib/money';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';

// Shadcn UI Components & Icons
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    CalendarSearch,
    PieChart,
    ReceiptText,
    ShieldCheck,
    TrendingDown,
    TrendingUp,
    Zap,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Reports', href: '/reports' }];

export default function ReportIndex({
    period,
    summary,
    health,
    insights,
    topCategories,
    transactions,
}: any) {
    const monthStr = `${period.year}-${String(period.month).padStart(2, '0')}`;

    function applyPeriod(next: any) {
        router.get('/reports', { ...period, ...next }, { preserveState: true });
    }

    function getLevelStyle(level: string) {
        if (level === 'good')
            return 'bg-emerald-500/10 text-emerald-700 border-emerald-200';
        if (level === 'warn')
            return 'bg-amber-500/10 text-amber-700 border-amber-200';
        return 'bg-red-500/10 text-red-700 border-red-200';
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Analisis" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header & Filter */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight uppercase">
                            Analisis Finansial
                        </h1>
                        <p className="flex items-center gap-1 text-sm text-muted-foreground">
                            <CalendarSearch className="h-3 w-3" /> Rekapitulasi
                            Data Periode {monthStr}
                        </p>
                    </div>
                    <div className="flex gap-2 rounded-xl border bg-muted/50 p-2 shadow-sm">
                        <Input
                            type="number"
                            className="h-8 w-16 border-none bg-transparent font-bold"
                            value={period.month}
                            onChange={(e) =>
                                applyPeriod({ month: e.target.value })
                            }
                        />
                        <Input
                            type="number"
                            className="h-8 w-24 border-none bg-transparent font-bold"
                            value={period.year}
                            onChange={(e) =>
                                applyPeriod({ year: e.target.value })
                            }
                        />
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <CardStat
                        label="Total Pemasukan"
                        value={summary.income}
                        icon={<TrendingUp className="h-4 w-4" />}
                        color="text-emerald-600"
                    />
                    <CardStat
                        label="Total Pengeluaran"
                        value={summary.expense}
                        icon={<TrendingDown className="h-4 w-4" />}
                        color="text-red-600"
                    />
                    <CardStat
                        label="Arus Kas Bersih"
                        value={summary.net}
                        icon={<Zap className="h-4 w-4" />}
                        color={
                            summary.net >= 0 ? 'text-blue-600' : 'text-red-700'
                        }
                    />
                    <div className="flex flex-col items-center justify-center rounded-2xl border bg-slate-900 p-5 text-white shadow-xl">
                        <span className="text-[10px] font-bold tracking-widest uppercase opacity-50">
                            Financial Score
                        </span>
                        <div className="mt-1 text-3xl font-black">
                            {health.total_score}%
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        {/* Automated Insights */}
                        <div className="rounded-2xl border bg-card p-5 shadow-sm">
                            <h2 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase opacity-70">
                                <ShieldCheck className="h-4 w-4" /> Wawasan
                                Cerdas
                            </h2>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {insights.map((insight: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className={`rounded-xl border p-4 ${getLevelStyle(insight.level)}`}
                                    >
                                        <div className="text-sm font-bold tracking-tight uppercase">
                                            {insight.title}
                                        </div>
                                        <p className="mt-1 text-xs leading-relaxed font-medium opacity-90">
                                            {insight.body}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Transaction DataTable */}
                        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                            <div className="flex items-center gap-2 border-b bg-muted/20 p-4 text-xs font-bold tracking-widest uppercase opacity-70">
                                <ReceiptText className="h-4 w-4" /> Riwayat
                                Transaksi Bulan Ini
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b bg-muted/10 text-[10px] font-bold text-muted-foreground uppercase">
                                        <tr>
                                            <th className="p-4">Tanggal</th>
                                            <th className="p-4">Kategori</th>
                                            <th className="p-4 text-right">
                                                Jumlah
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {transactions.map((t: any) => (
                                            <tr
                                                key={t.id}
                                                className="transition-colors hover:bg-muted/10"
                                            >
                                                <td className="p-4 font-medium opacity-60">
                                                    {t.occurred_at}
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-bold">
                                                        {t.category?.name ||
                                                            'Lainnya'}
                                                    </div>
                                                    <div className="text-[10px] font-bold tracking-tighter uppercase opacity-50">
                                                        {t.wallet?.name}
                                                    </div>
                                                </td>
                                                <td
                                                    className={`p-4 text-right font-black ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}
                                                >
                                                    {t.type === 'income'
                                                        ? '+'
                                                        : '-'}
                                                    {formatIDR(t.amount)}
                                                </td>
                                            </tr>
                                        ))}
                                        {transactions.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={3}
                                                    className="p-12 text-center text-muted-foreground italic"
                                                >
                                                    Tidak ada transaksi
                                                    tercatat.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Top Categories & Runway */}
                    <div className="space-y-6">
                        <div className="rounded-2xl border bg-card p-5 shadow-sm">
                            <h2 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase opacity-70">
                                <PieChart className="h-4 w-4" /> Pengeluaran
                                Terbesar
                            </h2>
                            <div className="space-y-4">
                                {topCategories.map((c: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="group flex items-center justify-between"
                                    >
                                        <div className="text-sm font-medium transition-colors group-hover:text-red-600">
                                            {c.name}
                                        </div>
                                        <div className="text-sm font-black tracking-tight">
                                            {formatIDR(c.amount)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col items-center rounded-2xl border bg-slate-100 p-6 shadow-inner dark:bg-slate-800">
                            <span className="text-center text-[10px] font-black tracking-[0.2em] uppercase opacity-60">
                                Emergency Runway
                            </span>
                            <div className="my-2 text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                                {Number(summary.runway_months).toFixed(1)}
                            </div>
                            <span className="text-[10px] font-bold uppercase opacity-60">
                                Bulan Keamanan Finansial
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                            <Button
                                variant="outline"
                                className="h-11 w-full rounded-xl font-bold"
                                onClick={() => router.visit('/transactions')}
                            >
                                Buka Arus Kas
                            </Button>
                            <Button
                                variant="outline"
                                className="h-11 w-full rounded-xl font-bold"
                                onClick={() => router.visit('/budgets')}
                            >
                                Lihat Anggaran
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// Sub-komponen Stat Card
function CardStat({ label, value, icon, color }: any) {
    return (
        <div className="rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-1 flex items-center gap-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase opacity-70">
                {icon} {label}
            </div>
            <div className={`truncate text-xl font-black ${color}`}>
                {formatIDR(value)}
            </div>
        </div>
    );
}

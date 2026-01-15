import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { formatIDR } from '@/lib/money';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';

type Insight = { title: string; body: string; level: 'good' | 'warn' | 'bad' };
type BudgetPerf = {
    id: number;
    name: string;
    budgeted: number;
    spent: number;
    remaining: number;
};
type CategoryAmount = { name: string; amount: number };

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Reports', href: '/reports' }];

function pill(level: Insight['level']) {
    if (level === 'good')
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-200';
    if (level === 'warn')
        return 'bg-amber-500/10 text-amber-700 border-amber-200';
    return 'bg-red-500/10 text-red-700 border-red-200';
}

export default function ReportIndex(props: {
    period?: { month: number; year: number };
    summary?: any;
    health?: { total_score: number };
    insights?: Insight[];
    topCategories?: CategoryAmount[];
}) {
    // Memberikan nilai awal yang aman agar tidak "Cannot read property of undefined"
    const {
        period = {
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
        },
        summary = { income: 0, expense: 0, net: 0, runway_months: 0 },
        health = { total_score: 0 },
        insights = [],
        topCategories = [],
    } = props;

    function applyPeriod(next: Partial<{ month: number; year: number }>) {
        router.get(
            '/reports',
            {
                month: next.month ?? period.month,
                year: next.year ?? period.year,
            },
            { preserveState: true, replace: true },
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Financial Reports" />
            <div className="flex flex-col gap-6 p-6">
                {/* Header Section */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Laporan Finansial
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Ringkasan performa uang Anda.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2">
                        <Input
                            type="number"
                            className="h-9 w-16"
                            value={period.month}
                            onChange={(e) =>
                                applyPeriod({ month: Number(e.target.value) })
                            }
                        />
                        <Input
                            type="number"
                            className="h-9 w-24"
                            value={period.year}
                            onChange={(e) =>
                                applyPeriod({ year: Number(e.target.value) })
                            }
                        />
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <CardSummary
                        label="Total Pemasukan"
                        value={summary.income}
                        color="text-emerald-600"
                    />
                    <CardSummary
                        label="Total Pengeluaran"
                        value={summary.expense}
                        color="text-red-600"
                    />
                    <CardSummary
                        label="Net Cashflow"
                        value={summary.net}
                        color={
                            summary.net >= 0 ? 'text-blue-600' : 'text-red-600'
                        }
                    />
                    <CardSummary
                        label="Skor Kesehatan"
                        value={`${health.total_score}/100`}
                        isCurrency={false}
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Insights & Top Categories */}
                    <div className="space-y-6 lg:col-span-2">
                        <div className="rounded-xl border bg-card p-5">
                            <h2 className="mb-4 font-bold">Wawasan Cerdas</h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {insights.map((i, idx) => (
                                    <div
                                        key={idx}
                                        className={`rounded-xl border p-4 ${pill(i.level)}`}
                                    >
                                        <div className="text-sm font-bold">
                                            {i.title}
                                        </div>
                                        <p className="mt-1 text-xs opacity-80">
                                            {i.body}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-xl border bg-card p-5">
                            <h2 className="mb-4 font-bold">
                                Pengeluaran Terbesar
                            </h2>
                            <div className="space-y-3">
                                {topCategories.map((c, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between border-b pb-2 last:border-0"
                                    >
                                        <span className="text-sm">
                                            {c.name}
                                        </span>
                                        <span className="text-sm font-semibold">
                                            {formatIDR(c.amount)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-4">
                        <div className="flex flex-col items-center rounded-xl border bg-slate-900 p-6 text-white dark:bg-slate-800">
                            <span className="text-xs tracking-widest uppercase opacity-60">
                                Runway Dana Darurat
                            </span>
                            <span className="my-3 text-5xl font-black">
                                {Number(summary.runway_months).toFixed(1)}
                            </span>
                            <span className="text-center text-xs opacity-60">
                                Bulan bertahan jika tanpa pemasukan sama sekali.
                            </span>
                        </div>
                        <Button
                            className="h-12 w-full"
                            variant="outline"
                            onClick={() => router.visit('/budgets')}
                        >
                            Kelola Budget
                        </Button>
                        <Button
                            className="h-12 w-full"
                            variant="outline"
                            onClick={() => router.visit('/transactions')}
                        >
                            Detail Transaksi
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// Sub-komponen untuk tampilan yang lebih bersih
function CardSummary({ label, value, color = '', isCurrency = true }: any) {
    return (
        <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="text-xs font-medium text-muted-foreground uppercase">
                {label}
            </div>
            <div className={`mt-1 text-xl font-bold ${color}`}>
                {isCurrency ? formatIDR(value) : value}
            </div>
        </div>
    );
}

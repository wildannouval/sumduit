import AppLayout from '@/layouts/app-layout';
import { formatIDR } from '@/lib/money';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowDownCircle,
    ArrowUpCircle,
    Calendar,
    CreditCard,
    History,
    PieChart,
    TrendingDown,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

export default function Dashboard(props: any) {
    const {
        statsToday,
        totals,
        runway,
        topSpending,
        budgetRealization,
        upcomingBills,
        recentTransactions,
    } = props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-6">
                {/* Section 1: Info Hari Ini */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <CardToday
                        label="Budget Hari Ini"
                        value={statsToday.budget}
                        icon={<Calendar className="h-4 w-4" />}
                        color="text-blue-600"
                    />
                    <CardToday
                        label="Pemasukan Hari Ini"
                        value={statsToday.income}
                        icon={<ArrowUpCircle className="h-4 w-4" />}
                        color="text-emerald-600"
                    />
                    <CardToday
                        label="Terpakai Hari Ini"
                        value={statsToday.spent}
                        icon={<ArrowDownCircle className="h-4 w-4" />}
                        color="text-red-600"
                    />
                </div>

                {/* Section 2 & 3: Total Bulanan & Runway */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                    <CardTotal
                        label="Total Pemasukan (Bulan Ini)"
                        value={totals.income}
                        color="bg-emerald-50"
                        textColor="text-emerald-700"
                    />
                    <CardTotal
                        label="Total Pengeluaran (Bulan Ini)"
                        value={totals.expense}
                        color="bg-red-50"
                        textColor="text-red-700"
                    />
                    <CardTotal
                        label="Net Cashflow"
                        value={totals.net}
                        color="bg-blue-50"
                        textColor="text-blue-700"
                    />

                    <div className="flex flex-col items-center justify-center rounded-xl border bg-slate-900 p-5 text-white shadow-lg">
                        <span className="text-xs tracking-tighter uppercase opacity-70">
                            Runway Dana Darurat
                        </span>
                        <div className="my-1 text-4xl font-black">{runway}</div>
                        <span className="text-center text-[10px] uppercase opacity-60">
                            Bulan Keamanan Finansial
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Section 5: Pengeluaran Terbesar */}
                    <div className="rounded-xl border bg-card p-5">
                        <div className="mb-4 flex items-center gap-2 font-bold">
                            <TrendingDown className="h-5 w-5 text-red-500" />
                            <h2>Pengeluaran Terbesar</h2>
                        </div>
                        <div className="space-y-4">
                            {topSpending.map((item: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between border-b pb-2 last:border-0"
                                >
                                    <span className="text-sm">{item.name}</span>
                                    <span className="text-sm font-semibold">
                                        {formatIDR(item.amount)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 6: Realisasi Anggaran */}
                    <div className="rounded-xl border bg-card p-5">
                        <div className="mb-4 flex items-center gap-2 font-bold">
                            <PieChart className="h-5 w-5 text-orange-500" />
                            <h2>Realisasi Anggaran</h2>
                        </div>
                        <div className="flex h-32 flex-col items-center justify-center">
                            <div className="text-3xl font-black">
                                {budgetRealization.pct}%
                            </div>
                            <div className="text-xs text-muted-foreground uppercase">
                                Dari {formatIDR(budgetRealization.budgeted)}
                            </div>
                            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                    className={`h-full transition-all ${budgetRealization.pct > 90 ? 'bg-red-500' : 'bg-orange-500'}`}
                                    style={{
                                        width: `${Math.min(budgetRealization.pct, 100)}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 7: Tagihan Mendatang */}
                    <div className="rounded-xl border bg-card p-5">
                        <div className="mb-4 flex items-center gap-2 font-bold">
                            <CreditCard className="h-5 w-5 text-purple-500" />
                            <h2>Alokasi Mendatang</h2>
                        </div>
                        <div className="space-y-3">
                            {upcomingBills.map((bill: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="flex flex-col gap-1 rounded-lg bg-muted/30 p-2"
                                >
                                    <span className="text-xs font-bold uppercase opacity-60">
                                        {bill.group}
                                    </span>
                                    <div className="flex justify-between text-sm">
                                        <span>{bill.name}</span>
                                        <span className="font-medium">
                                            {formatIDR(bill.amount)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Section 8: Transaksi Terbaru */}
                <div className="rounded-xl border bg-card p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold">
                            <History className="h-5 w-5 text-blue-500" />
                            <h2>Transaksi Terbaru</h2>
                        </div>
                        <Link
                            href="/transactions"
                            className="text-xs text-blue-600 hover:underline"
                        >
                            Lihat Semua
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left opacity-50">
                                    <th className="pb-2 font-medium">
                                        Tanggal
                                    </th>
                                    <th className="pb-2 font-medium">
                                        Kategori
                                    </th>
                                    <th className="pb-2 font-medium">Dompet</th>
                                    <th className="pb-2 text-right font-medium">
                                        Jumlah
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentTransactions.map((tx: any) => (
                                    <tr
                                        key={tx.id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="py-3 text-muted-foreground">
                                            {tx.occurred_at}
                                        </td>
                                        <td className="py-3 font-medium">
                                            {tx.category?.name || 'Lainnya'}
                                        </td>
                                        <td className="py-3">
                                            {tx.wallet?.name}
                                        </td>
                                        <td
                                            className={`py-3 text-right font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}
                                        >
                                            {tx.type === 'income' ? '+' : '-'}
                                            {formatIDR(tx.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// Komponen Kecil Hari Ini
function CardToday({ label, value, icon, color }: any) {
    return (
        <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
            <div className={`rounded-lg bg-muted p-2`}>{icon}</div>
            <div>
                <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    {label}
                </div>
                <div className={`text-lg font-bold ${color}`}>
                    {formatIDR(value)}
                </div>
            </div>
        </div>
    );
}

// Komponen Card Total
function CardTotal({ label, value, color, textColor }: any) {
    return (
        <div className={`rounded-xl border p-5 ${color} border-none shadow-sm`}>
            <div
                className={`text-[10px] font-bold uppercase opacity-70 ${textColor}`}
            >
                {label}
            </div>
            <div className={`mt-1 text-xl font-black ${textColor}`}>
                {formatIDR(value)}
            </div>
        </div>
    );
}

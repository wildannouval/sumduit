import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { formatIDR } from '@/lib/money';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

type Goal = {
    id: number;
    name: string;
    target_amount: number;
    current_amount: number;
    target_date: string | null;
    status: string;
    notes: string | null;
};

export default function GoalShow({ goal, stats }: { goal: Goal; stats: any }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Goals', href: '/goals' },
        { title: goal.name, href: `/goals/${goal.id}` },
    ];

    function pct(n: number) {
        if (!Number.isFinite(n)) return 0;
        return Math.max(0, Math.min(100, Math.round(n)));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Goal: ${goal.name}`} />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">{goal.name}</h1>
                        <p className="text-sm text-muted-foreground">
                            Status: {goal.status}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href={`/goals/${goal.id}/edit`}>Edit</Link>
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (confirm('Hapus?'))
                                    router.delete(`/goals/${goal.id}`);
                            }}
                        >
                            Hapus
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-xl border bg-card p-4">
                        <div className="text-sm text-muted-foreground">
                            Progress Tabungan
                        </div>
                        <div className="mt-2 text-2xl font-bold">
                            {formatIDR(goal.current_amount)} /{' '}
                            {formatIDR(goal.target_amount)}
                        </div>
                        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full bg-green-500 transition-all"
                                style={{
                                    width: `${pct(stats?.progress_pct || 0)}%`,
                                }}
                            />
                        </div>
                        <div className="mt-1 text-right text-xs font-medium">
                            {pct(stats?.progress_pct || 0)}%
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-4">
                        <div className="text-sm text-muted-foreground">
                            Sisa Target
                        </div>
                        <div className="mt-2 text-2xl font-bold text-red-500">
                            {formatIDR(stats?.remaining || 0)}
                        </div>
                    </div>
                </div>

                <Button asChild variant="ghost" className="w-fit">
                    <Link href="/goals">← Kembali</Link>
                </Button>
            </div>
        </AppLayout>
    );
}

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
    due_date: string | null;
    note: string | null;
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Goals', href: '/goals' }];

export default function GoalIndex(props: { goals?: { data: Goal[] } }) {
    // Defensive programming: berikan default value jika props kosong
    const { goals = { data: [] } } = props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Goals" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Goals</h1>
                    <Button asChild>
                        <Link href="/goals/create">Tambah Goal</Link>
                    </Button>
                </div>
                <div className="overflow-hidden rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="p-3 text-left">Nama</th>
                                <th className="p-3 text-right">Target</th>
                                <th className="p-3 text-right">Terkumpul</th>
                                <th className="p-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {goals.data.length > 0 ? (
                                goals.data.map((g) => (
                                    <tr
                                        key={g.id}
                                        className="border-b last:border-b-0"
                                    >
                                        <td className="p-3 font-medium">
                                            <div className="font-medium text-blue-600 dark:text-blue-400">
                                                {g.name}
                                            </div>
                                            {g.due_date && (
                                                <div className="text-xs text-muted-foreground">
                                                    Tempo: {g.due_date}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3 text-right">
                                            {formatIDR(Number(g.target_amount))}
                                        </td>
                                        <td className="p-3 text-right font-medium text-emerald-600">
                                            {formatIDR(
                                                Number(g.current_amount),
                                            )}
                                        </td>
                                        <td className="p-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Link
                                                        href={`/goals/${g.id}/edit`}
                                                    >
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (
                                                            confirm(
                                                                'Hapus goal ini?',
                                                            )
                                                        )
                                                            router.delete(
                                                                `/goals/${g.id}`,
                                                            );
                                                    }}
                                                >
                                                    Hapus
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="p-4 text-center text-muted-foreground"
                                    >
                                        Belum ada goal yang dibuat.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';
import {
    BarChart3,
    HandCoins,
    LayoutGrid,
    PiggyBank,
    ReceiptText,
} from 'lucide-react';
import * as React from 'react';
import AppLogo from './app-logo';

const navData = {
    navMain: [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Keuangan',
            href: '#',
            icon: ReceiptText,
            items: [
                { title: 'Arus Kas', href: '/transactions' },
                { title: 'Dompet', href: '/wallets' },
                { title: 'Tagihan Rutin', href: '/recurring' },
            ],
        },
        {
            title: 'Perencanaan',
            href: '#',
            icon: PiggyBank,
            items: [
                { title: 'Anggaran', href: '/budgets' },
                { title: 'Target Tabungan', href: '/goals' },
            ],
        },
        {
            title: 'Aset & Pinjaman',
            href: '#',
            icon: HandCoins,
            items: [
                { title: 'Aset Tetap', href: '/assets' },
                { title: 'Hutang & Piutang', href: '/debts' },
            ],
        },
        {
            title: 'Analisis & Data',
            href: '#',
            icon: BarChart3,
            items: [
                { title: 'Laporan', href: '/reports' },
                { title: 'Kategori', href: '/categories' },
            ],
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex p-2">
                            <AppLogo />
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navData.navMain} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}

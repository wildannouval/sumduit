import { Link } from '@inertiajs/react';
import {
    AlarmClock,
    BarChart3,
    BookOpen,
    Folder,
    HandCoins,
    LayoutGrid,
    Package,
    PiggyBank,
    ReceiptText,
    Tags,
    Target,
    Wallet,
} from 'lucide-react';

import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';

import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Arus Kas',
        href: '/transactions',
        icon: ReceiptText,
    },
    {
        title: 'Dompet',
        href: '/wallets',
        icon: Wallet,
    },
    {
        title: 'Anggaran',
        href: '/budgets',
        icon: PiggyBank,
    },
    {
        title: 'Target',
        href: '/goals',
        icon: Target,
    },
    {
        title: 'Aset Tetap',
        href: '/assets',
        icon: Package,
    },
    {
        title: 'Hutang & Piutang',
        href: '/debts',
        icon: HandCoins,
    },
    {
        title: 'Tagihan Rutin',
        href: '/recurring',
        icon: AlarmClock,
    },
    {
        title: 'Laporan',
        href: '/reports',
        icon: BarChart3,
    },
    {
        title: 'Kategori',
        href: '/categories',
        icon: Tags,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

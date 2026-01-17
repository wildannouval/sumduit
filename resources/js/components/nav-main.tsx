'use client';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

export function NavMain({ items }: { items: any[] }) {
    const { url } = usePage();

    return (
        <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] font-black tracking-[0.2em] text-muted-foreground/50 uppercase">
                Menu Utama
            </SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const hasChildren = item.items && item.items.length > 0;
                    const isChildActive = item.items?.some((child: any) =>
                        url.startsWith(child.href),
                    );
                    const isActive = url.startsWith(item.href) || isChildActive;

                    if (!hasChildren) {
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={item.title}
                                    isActive={url === item.href}
                                >
                                    <Link
                                        href={item.href}
                                        className="flex items-center gap-3"
                                    >
                                        {item.icon && <item.icon size={18} />}
                                        <span className="text-xs font-black tracking-tight uppercase">
                                            {item.title}
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    }

                    return (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={isActive}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        isActive={isActive}
                                    >
                                        {item.icon && <item.icon size={18} />}
                                        <span className="text-xs font-black tracking-tight uppercase">
                                            {item.title}
                                        </span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items?.map((subItem: any) => (
                                            <SidebarMenuSubItem
                                                key={subItem.title}
                                            >
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={
                                                        url === subItem.href
                                                    }
                                                >
                                                    <Link href={subItem.href}>
                                                        <span className="text-[11px] font-bold tracking-tighter uppercase">
                                                            {subItem.title}
                                                        </span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}

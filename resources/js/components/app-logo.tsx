import { cn } from '@/lib/utils';
import AppLogoIcon from './app-logo-icon';

export default function AppLogo({ className }: { className?: string }) {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-black tracking-tighter uppercase">
                    SumDuit
                </span>
                <span className="truncate text-[10px] font-bold uppercase opacity-60">
                    Smart Finance
                </span>
            </div>
        </div>
    );
}

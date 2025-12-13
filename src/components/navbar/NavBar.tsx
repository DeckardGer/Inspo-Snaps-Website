import { LinkSquare02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { BreadcrumbItemPath } from "@/components/navbar/HeaderBreadcrumbs";
import { HeaderBreadcrumbs } from "@/components/navbar/HeaderBreadcrumbs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

interface NavBarProps {
	breadrumbs: BreadcrumbItemPath[];
}

export function NavBar({ breadrumbs }: NavBarProps) {
	const { state } = useSidebar();

	return (
		<header className="flex justify-between items-center h-13 shrink-0 border-b px-4 sticky top-0 bg-background z-1">
			<div className="flex items-center gap-2">
				{state === "collapsed" && (
					<>
						<SidebarTrigger />
						<Separator
							orientation="vertical"
							className="mr-2 mt-1.5 data-[orientation=vertical]:h-4"
						/>
					</>
				)}

				<HeaderBreadcrumbs items={breadrumbs} />
			</div>
			<div className="flex items-center gap-2">
				<ThemeToggle />
				<Button>
					<HugeiconsIcon icon={LinkSquare02Icon} strokeWidth={2} />
					Download
				</Button>
			</div>
		</header>
	);
}

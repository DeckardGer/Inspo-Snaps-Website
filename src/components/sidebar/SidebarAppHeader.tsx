import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { BrandLogo } from "@/components/ui/svgs/BrandLogo";

export function SidebarAppHeader() {
	const { state } = useSidebar();

	return (
		<div className="flex items-center justify-between overflow-hidden w-full pl-0.5 pr-3 py-1">
			<div className="flex max-w-full items-center">
				<BrandLogo className="shrink-0" size={28} />
				<h4 className="ml-2.5 truncate text-base font-medium">InspoSnaps</h4>
			</div>
			<SidebarTrigger className={state === "collapsed" ? "hidden" : ""} />
		</div>
	);
}

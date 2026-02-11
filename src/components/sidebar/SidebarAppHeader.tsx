import { Link } from "@tanstack/react-router";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { BrandLogo } from "@/components/ui/svgs/BrandLogo";

export function SidebarAppHeader() {
	const { state } = useSidebar();

	return (
		<div className="flex items-center justify-between overflow-hidden w-full pl-0.5 pr-2 py-1">
			<Link
				to="/"
				className="flex max-w-full items-center rounded-md outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border border-transparent"
			>
				<BrandLogo className="shrink-0" size={28} />
				<h4 className="ml-2.5 truncate text-base font-medium">InspoSnaps</h4>
			</Link>
			<SidebarTrigger className={state === "collapsed" ? "hidden" : ""} />
		</div>
	);
}

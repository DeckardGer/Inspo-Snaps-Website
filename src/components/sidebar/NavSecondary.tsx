import { Comment01Icon, Settings01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useLocation } from "@tanstack/react-router";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";

export function NavSecondary({
	...props
}: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
	const { setOpenMobile, isMobile } = useSidebar();
	const location = useLocation();

	const handleLinkClick = () => {
		if (isMobile) setOpenMobile(false);
	};

	const isSettingsActive = location.pathname === "/settings";

	return (
		<SidebarGroup {...props}>
			<SidebarGroupContent>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							isActive={isSettingsActive}
							render={
								<Link to="/settings">
									<HugeiconsIcon icon={Settings01Icon} />
									<span>Settings</span>
								</Link>
							}
						/>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton
							render={
								<a
									href="mailto:deckardgerritsen@gmail.com"
									onClick={handleLinkClick}
								>
									<HugeiconsIcon icon={Comment01Icon} />
									Feedback
								</a>
							}
						/>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

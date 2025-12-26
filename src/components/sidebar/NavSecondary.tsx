import { Comment01Icon, Settings01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";

interface NavSecondaryProps
	extends React.ComponentPropsWithoutRef<typeof SidebarGroup> {
	onOpenSettings?: () => void;
}

export function NavSecondary({ onOpenSettings, ...props }: NavSecondaryProps) {
	const { setOpenMobile, isMobile } = useSidebar();

	const handleLinkClick = () => {
		if (isMobile) setOpenMobile(false);
	};

	const handleSettingsClick = () => {
		if (isMobile) setOpenMobile(false);
		onOpenSettings?.();
	};

	return (
		<SidebarGroup {...props}>
			<SidebarGroupContent>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton tooltip="Settings" onClick={handleSettingsClick}>
							<HugeiconsIcon icon={Settings01Icon} />
							<span>Settings</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton
							tooltip="Feedback"
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

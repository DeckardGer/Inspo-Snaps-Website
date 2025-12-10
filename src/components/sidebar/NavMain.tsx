import {
	DashboardSquare02Icon,
	Folder01Icon,
	ShareKnowledgeIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
	{
		name: "Overview",
		url: "/dashboard",
		icon: DashboardSquare02Icon,
		isActive: true,
	},
	{
		name: "My Folders",
		url: "/my-folders",
		icon: Folder01Icon,
		isActive: false,
	},
	{
		name: "Shared",
		url: "/shared",
		icon: ShareKnowledgeIcon,
		isActive: false,
	},
];

export function NavMain() {
	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.name}>
							<SidebarMenuButton asChild isActive={item.isActive}>
								<Link to={item.url}>
									<HugeiconsIcon icon={item.icon} />
									<span>{item.name}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

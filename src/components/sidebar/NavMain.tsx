import {
	Folder01Icon,
	Share08Icon,
	UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useLocation } from "@tanstack/react-router";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
	{
		name: "My folders",
		url: "/my-folders",
		icon: Folder01Icon,
	},
	{
		name: "Shared folders",
		url: "/shared-folders",
		icon: Share08Icon,
	},
	{
		name: "Team folders",
		url: "/team-folders",
		icon: UserGroupIcon,
	},
];

export function NavMain() {
	const location = useLocation();

	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => {
						const isActive = location.pathname === item.url;

						return (
							<SidebarMenuItem key={item.name}>
								<SidebarMenuButton
									isActive={isActive}
									tooltip={item.name}
									render={
										<Link to={item.url}>
											<HugeiconsIcon icon={item.icon} />
											<span>{item.name}</span>
										</Link>
									}
								/>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

import {
	ArrowDown01Icon,
	ArrowRight01Icon,
	FolderFavouriteIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavFavourites({
	favourites,
}: {
	favourites: {
		name: string;
		url: string;
		emoji: string;
	}[];
}) {
	return (
		<SidebarGroup>
			<SidebarMenu>
				<Collapsible defaultOpen className="group/collapsible">
					<SidebarMenuItem>
						<CollapsibleTrigger asChild>
							<SidebarMenuButton>
								<HugeiconsIcon icon={FolderFavouriteIcon} />
								Favourites
								<HugeiconsIcon
									icon={ArrowRight01Icon}
									className="ml-auto group-data-[state=open]/collapsible:hidden"
								/>
								<HugeiconsIcon
									icon={ArrowDown01Icon}
									className="ml-auto group-data-[state=closed]/collapsible:hidden"
								/>
							</SidebarMenuButton>
						</CollapsibleTrigger>
						{favourites.length ? (
							<CollapsibleContent>
								<div className="max-h-50 overflow-y-auto overflow-x-hidden">
									<SidebarMenuSub className="mr-0">
										{favourites.map((item) => (
											<SidebarMenuSubItem
												key={item.name}
												className="max-w-[196px]"
											>
												<SidebarMenuSubButton asChild>
													<Link to={item.url} className="h-8">
														<span>{item.name}</span>
													</Link>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								</div>
							</CollapsibleContent>
						) : null}
					</SidebarMenuItem>
				</Collapsible>
			</SidebarMenu>
		</SidebarGroup>
	);
}

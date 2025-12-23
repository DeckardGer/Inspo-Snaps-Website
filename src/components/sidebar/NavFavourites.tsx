import {
	ArrowDown01Icon,
	ArrowRight01Icon,
	Folder01Icon,
	FolderFavouriteIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useLocation } from "@tanstack/react-router";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { FOLDER_ICON_CLASSES, type FolderColor } from "@/lib/folders/constants";
import type { FavouriteFolder } from "@/lib/folders/functions";
import { cn } from "@/lib/utils";

function FolderIcon({
	color,
	emoji,
}: {
	color: FolderColor;
	emoji: string | null;
}) {
	const colorClass = FOLDER_ICON_CLASSES[color];

	return (
		<div
			className={cn(
				"flex items-center justify-center size-5 rounded-sm shrink-0",
				colorClass,
			)}
		>
			{emoji ? (
				<span className="text-xs leading-none">{emoji}</span>
			) : (
				<HugeiconsIcon
					icon={Folder01Icon}
					className="size-3"
					fill="currentColor"
				/>
			)}
		</div>
	);
}

export function NavFavourites({
	favourites,
}: {
	favourites: FavouriteFolder[];
}) {
	const { state } = useSidebar();
	const location = useLocation();

	return (
		<SidebarGroup>
			<SidebarMenu>
				{state === "collapsed" ? (
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<SidebarMenuItem>
									<SidebarMenuButton tooltip="Favourites">
										<HugeiconsIcon icon={FolderFavouriteIcon} />
									</SidebarMenuButton>
								</SidebarMenuItem>
							}
						/>
						<DropdownMenuContent
							side="right"
							align="start"
							className="min-w-[200px] max-h-[400px] overflow-y-auto"
						>
							{favourites.map((item) => (
								<DropdownMenuItem
									key={item.id}
									render={
										<Link to={item.url} className="cursor-pointer">
											<FolderIcon
												color={item.color as FolderColor}
												emoji={item.emoji}
											/>
											<span className="truncate">{item.name}</span>
										</Link>
									}
								/>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				) : (
					<Collapsible defaultOpen className="group/collapsible">
						<SidebarMenuItem>
							<CollapsibleTrigger
								render={
									<SidebarMenuButton>
										<HugeiconsIcon icon={FolderFavouriteIcon} />
										Favourites
										<HugeiconsIcon
											icon={ArrowRight01Icon}
											className="ml-auto group-has-data-[panel-open]:hidden"
										/>
										<HugeiconsIcon
											icon={ArrowDown01Icon}
											className="ml-auto hidden group-has-data-[panel-open]:block"
										/>
									</SidebarMenuButton>
								}
							/>
							{favourites.length ? (
								<CollapsibleContent>
									<div className="max-h-50 overflow-y-auto overflow-x-hidden">
										<SidebarMenuSub className="mr-0 pr-0">
											{favourites.map((item) => {
												const isActive = location.pathname === item.url;

												return (
													<SidebarMenuSubItem key={item.id}>
														<SidebarMenuSubButton
															isActive={isActive}
															render={
																<Link to={item.url} className="h-8">
																	<FolderIcon
																		color={item.color as FolderColor}
																		emoji={item.emoji}
																	/>
																	<span className="truncate">{item.name}</span>
																</Link>
															}
														/>
													</SidebarMenuSubItem>
												);
											})}
										</SidebarMenuSub>
									</div>
								</CollapsibleContent>
							) : null}
						</SidebarMenuItem>
					</Collapsible>
				)}
			</SidebarMenu>
		</SidebarGroup>
	);
}

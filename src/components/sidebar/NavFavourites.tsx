import {
	ArrowDown01Icon,
	ArrowRight01Icon,
	Folder01Icon,
	FolderFavouriteIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useLocation } from "@tanstack/react-router";
import {
	FolderActionsMenu,
	type FolderForActions,
} from "@/components/folders/FolderActionsMenu";
import {
	SharedFolderActionsMenu,
	type SharedFolderForActions,
} from "@/components/sharing";
import {
	TeamFolderActionsMenu,
	type TeamFolderForActions,
} from "@/components/teams/TeamFolderActionsMenu";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuAction,
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

function toFolderForActions(item: FavouriteFolder): FolderForActions {
	return {
		id: item.id,
		parentId: item.parentId,
		name: item.name,
		color: (item.color ?? "indigo") as FolderColor,
		emoji: item.emoji,
		isFavourited: true,
	};
}

function toSharedFolderForActions(
	item: FavouriteFolder,
): SharedFolderForActions {
	return {
		id: item.id,
		name: item.name,
		color: (item.color ?? "indigo") as FolderColor,
		emoji: item.emoji,
		isFavourited: true,
	};
}

function toTeamFolderForActions(item: FavouriteFolder): TeamFolderForActions {
	return {
		id: item.id,
		parentId: item.parentId,
		name: item.name,
		color: (item.color ?? "indigo") as FolderColor,
		emoji: item.emoji,
		isFavourited: true,
	};
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
							<DropdownMenuGroup>
								<DropdownMenuLabel>Favourites</DropdownMenuLabel>
								{favourites.length > 0 ? (
									favourites.map((item) => (
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
									))
								) : (
									<p className="px-2 py-1.5 text-sm text-muted-foreground">
										No favourites yet...
									</p>
								)}
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				) : (
					<Collapsible defaultOpen className="group/collapsible">
						<SidebarMenuItem>
							<CollapsibleTrigger
								render={
									<SidebarMenuButton className="pr-[6px]!">
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
															className="pr-3"
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
														{item.isTeamFolder && item.organizationId ? (
															<TeamFolderActionsMenu
																folder={toTeamFolderForActions(item)}
																organizationId={item.organizationId}
																side="right"
																align="start"
																trigger={
																	<SidebarMenuAction className="peer-data-active/menu-sub-button:text-sidebar-accent-foreground group-focus-within/menu-sub-item:opacity-100 group-hover/menu-sub-item:opacity-100 data-popup-open:opacity-100 md:opacity-0" />
																}
															/>
														) : item.isShared ? (
															<SharedFolderActionsMenu
																folder={toSharedFolderForActions(item)}
																side="right"
																align="start"
																showRemoveFromShared={item.isRootShared}
																trigger={
																	<SidebarMenuAction className="peer-data-active/menu-sub-button:text-sidebar-accent-foreground group-focus-within/menu-sub-item:opacity-100 group-hover/menu-sub-item:opacity-100 data-popup-open:opacity-100 md:opacity-0" />
																}
															/>
														) : (
															<FolderActionsMenu
																folder={toFolderForActions(item)}
																side="right"
																align="start"
																trigger={
																	<SidebarMenuAction className="peer-data-active/menu-sub-button:text-sidebar-accent-foreground group-focus-within/menu-sub-item:opacity-100 group-hover/menu-sub-item:opacity-100 data-popup-open:opacity-100 md:opacity-0" />
																}
															/>
														)}
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

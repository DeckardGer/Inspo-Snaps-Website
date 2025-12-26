import {
	ArrowDown01Icon,
	FolderFavouriteIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import type * as React from "react";
import { Suspense, useState } from "react";
import { SettingsModal } from "@/components/settings/SettingsModal";
import { NavFavourites } from "@/components/sidebar/NavFavourites";
import { NavMain } from "@/components/sidebar/NavMain";
import { NavSecondary } from "@/components/sidebar/NavSecondary";
import { SidebarAppFooter } from "@/components/sidebar/SidebarAppFooter";
import { SidebarAppHeader } from "@/components/sidebar/SidebarAppHeader";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarRail,
} from "@/components/ui/sidebar";
import { favouriteFoldersQueryOptions } from "@/lib/folders/queries";

function FavouritesFallback() {
	return (
		<SidebarGroup>
			<SidebarMenu>
				<SidebarMenuButton>
					<HugeiconsIcon icon={FolderFavouriteIcon} />
					Favourites
					<HugeiconsIcon icon={ArrowDown01Icon} className="ml-auto" />
				</SidebarMenuButton>
			</SidebarMenu>
		</SidebarGroup>
	);
}

function FavouritesContent() {
	const { data: folders } = useSuspenseQuery(favouriteFoldersQueryOptions());

	return <NavFavourites favourites={folders} />;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const [settingsOpen, setSettingsOpen] = useState(false);

	return (
		<>
			<Sidebar {...props} collapsible="icon">
				<SidebarHeader className="flex-row items-center pr-0">
					<SidebarAppHeader />
				</SidebarHeader>
				<SidebarContent>
					<NavMain />
					<Suspense fallback={<FavouritesFallback />}>
						<FavouritesContent />
					</Suspense>
					<NavSecondary
						className="mt-auto"
						onOpenSettings={() => setSettingsOpen(true)}
					/>
				</SidebarContent>
				<SidebarFooter>
					<SidebarAppFooter />
				</SidebarFooter>
				<SidebarRail />
			</Sidebar>

			<SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
		</>
	);
}

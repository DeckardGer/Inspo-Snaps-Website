import {
	ArrowDown01Icon,
	FolderFavouriteIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import type * as React from "react";
import { Suspense } from "react";
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
import type { AuthQueryResult } from "@/lib/auth/queries";
import { favouriteFoldersQueryOptions } from "@/lib/folders/queries";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	user: NonNullable<AuthQueryResult>;
}

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

// TODO: Don't import user and instead use route context
export function AppSidebar({ user, ...props }: AppSidebarProps) {
	return (
		<Sidebar {...props} collapsible="icon">
			<SidebarHeader className="flex-row items-center pr-0">
				<SidebarAppHeader />
			</SidebarHeader>
			<SidebarContent>
				<NavMain />
				<Suspense fallback={<FavouritesFallback />}>
					<FavouritesContent />
				</Suspense>
				<NavSecondary className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<SidebarAppFooter user={user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}

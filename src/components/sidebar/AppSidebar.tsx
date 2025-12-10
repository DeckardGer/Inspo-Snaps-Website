import type * as React from "react";
import { NavFavourites } from "@/components/sidebar/NavFavourites";
import { NavMain } from "@/components/sidebar/NavMain";
import { NavSecondary } from "@/components/sidebar/NavSecondary";
import { SidebarAppFooter } from "@/components/sidebar/SidebarAppFooter";
import { SidebarAppHeader } from "@/components/sidebar/SidebarAppHeader";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.

const favourites = [
	{
		name: "Project Management & Task Tracking",
		url: "#",
		emoji: "📊",
	},
	{
		name: "Family Recipe Collection & Meal Planning",
		url: "#",
		emoji: "🍳",
	},
	{
		name: "Fitness Tracker & Workout Routines",
		url: "#",
		emoji: "💪",
	},
	{
		name: "Book Notes & Reading List",
		url: "#",
		emoji: "📚",
	},
	{
		name: "Sustainable Gardening Tips & Plant Care",
		url: "#",
		emoji: "🌱",
	},
	{
		name: "Language Learning Progress & Resources",
		url: "#",
		emoji: "🗣️",
	},
	{
		name: "Home Renovation Ideas & Budget Tracker",
		url: "#",
		emoji: "🏠",
	},
	{
		name: "Personal Finance & Investment Portfolio",
		url: "#",
		emoji: "💰",
	},
	{
		name: "Movie & TV Show Watchlist with Reviews",
		url: "#",
		emoji: "🎬",
	},
	{
		name: "Daily Habit Tracker & Goal Setting",
		url: "#",
		emoji: "✅",
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar {...props} collapsible="icon">
			<SidebarHeader className="flex-row items-center pr-0">
				<SidebarAppHeader />
			</SidebarHeader>
			<SidebarContent>
				<NavMain />
				<NavFavourites favourites={favourites} />
				<NavSecondary className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<SidebarAppFooter
					user={{
						name: "shadcn",
						email: "m@example.com",
						avatar: "/avatars/shadcn.jpg",
					}}
				/>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}

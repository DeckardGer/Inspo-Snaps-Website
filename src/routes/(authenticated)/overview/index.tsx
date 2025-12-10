import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { ImageGallery } from "@/components/gallery/ImageGallery";
import { NavBar } from "@/components/navbar/NavBar";
import { StatsCards } from "@/components/overview/StatsCards";
import { StatsCardsSkeleton } from "@/components/overview/StatsCardsSkeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { overviewStatsQueryOptions } from "@/lib/stats/queries";

export const Route = createFileRoute("/(authenticated)/overview/")({
	component: RouteComponent,
	beforeLoad: ({ context }) => {
		// Prefetch stats without blocking the page render
		context.queryClient.prefetchQuery(overviewStatsQueryOptions());
	},
});

function RouteComponent() {
	return (
		<>
			<NavBar
				breadrumbs={[
					{
						name: "Overview",
						link: "/overview",
					},
				]}
			/>
			<div className="flex flex-1 flex-col gap-8 p-4">
				<h2 className="text-2xl font-medium mt-4">Welcome back, 👋</h2>
				<Suspense fallback={<StatsCardsSkeleton />}>
					<StatsCards />
				</Suspense>
				<div className="flex flex-col gap-4">
					<h3 className="text-lg font-medium">All Images</h3>
					<Tabs defaultValue="all">
						<TabsList>
							<TabsTrigger value="all">All</TabsTrigger>
							<TabsTrigger value="favourites">Favourites</TabsTrigger>
							<TabsTrigger value="shared">Shared</TabsTrigger>
							<TabsTrigger value="team">Teams</TabsTrigger>
						</TabsList>
						<TabsContent value="all" className="mt-6">
							<ImageGallery />
						</TabsContent>
						<TabsContent value="favourites" className="mt-6">
							<ImageGallery />
						</TabsContent>
						<TabsContent value="shared" className="mt-6">
							<ImageGallery />
						</TabsContent>
						<TabsContent value="team" className="mt-6">
							<ImageGallery />
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</>
	);
}

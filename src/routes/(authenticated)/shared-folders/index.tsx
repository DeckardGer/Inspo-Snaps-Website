import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { FoldersGridSkeleton } from "@/components/folders";
import { NavBar } from "@/components/navbar/NavBar";
import { SharedFolderCard, SharedFoldersEmptyState } from "@/components/sharing";
import { sharedWithMeQueryOptions } from "@/lib/sharing/queries";

export const Route = createFileRoute("/(authenticated)/shared-folders/")({
	beforeLoad: async ({ context }) => {
		await context.queryClient.prefetchQuery(sharedWithMeQueryOptions());
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<NavBar
				breadrumbs={[
					{
						name: "Shared Folders",
						link: "/shared-folders",
					},
				]}
			/>
			<div className="flex flex-1 flex-col">
				<div className="flex items-center justify-between gap-2 px-4 mt-4 h-9">
					<h1 className="text-xl font-semibold">Shared Folders</h1>
				</div>

				<div className="flex flex-1 flex-col gap-4 p-4">
					<Suspense fallback={<FoldersGridSkeleton />}>
						<SharedFoldersContent />
					</Suspense>
				</div>
			</div>
		</>
	);
}

function SharedFoldersContent() {
	const { data: sharedFolders } = useSuspenseQuery(sharedWithMeQueryOptions());

	const hasFolders = sharedFolders && sharedFolders.length > 0;

	if (!hasFolders) {
		return <SharedFoldersEmptyState />;
	}

	return (
		<section>
			<h2 className="mb-3 text-sm font-medium text-muted-foreground">
				Folders
			</h2>
			<div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
				{sharedFolders.map((share) => (
					<SharedFolderCard
						key={share.folder.id}
						folder={share.folder}
						sharedBy={share.sharedBy}
					/>
				))}
			</div>
		</section>
	);
}

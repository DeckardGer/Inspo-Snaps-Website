import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { FolderCard } from "@/components/folders/FolderCard";
import { FoldersGridSkeleton } from "@/components/folders/FoldersSkeleton";
import { NavBar } from "@/components/navbar/NavBar";
import { SharedFolderCard } from "@/components/sharing/SharedFolderCard";
import { SharedFoldersEmptyState } from "@/components/sharing/SharedFoldersEmptyState";
import {
	sharedByMeQueryOptions,
	sharedWithMeQueryOptions,
} from "@/lib/sharing/queries";

export const Route = createFileRoute("/(authenticated)/shared-folders/")({
	beforeLoad: ({ context }) => {
		context.queryClient.prefetchQuery(sharedWithMeQueryOptions());
		context.queryClient.prefetchQuery(sharedByMeQueryOptions());
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
	const { data: sharedWithMe } = useSuspenseQuery(sharedWithMeQueryOptions());
	const { data: sharedByMe } = useQuery(sharedByMeQueryOptions());

	const hasSharedWithMe = sharedWithMe && sharedWithMe.length > 0;
	const hasSharedByMe = sharedByMe && sharedByMe.length > 0;

	if (!hasSharedWithMe && !hasSharedByMe) {
		return <SharedFoldersEmptyState />;
	}

	return (
		<div className="space-y-8">
			{/* Folders shared with me */}
			{hasSharedWithMe && (
				<section>
					<h2 className="mb-3 text-sm font-medium text-muted-foreground">
						Shared with me
					</h2>
					<div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
						{sharedWithMe.map((share) => (
							<SharedFolderCard
								key={share.folder.id}
								folder={share.folder}
								sharedBy={share.sharedBy}
							/>
						))}
					</div>
				</section>
			)}

			{/* Folders I've shared */}
			{hasSharedByMe && (
				<section>
					<h2 className="mb-3 text-sm font-medium text-muted-foreground">
						Shared by me
					</h2>
					<div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
						{sharedByMe.map((share) => (
							<FolderCard key={share.folder.id} folder={share.folder} />
						))}
					</div>
				</section>
			)}
		</div>
	);
}

import { FolderAddIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import {
	FolderGrid,
	FolderModal,
	FolderNotFound,
	FoldersEmptyState,
	FoldersGridSkeleton,
} from "@/components/folders";
import { ImageGrid } from "@/components/images";
import { NavBar } from "@/components/navbar/NavBar";
import { Button } from "@/components/ui/button";
import { DropZone } from "@/components/upload";
import {
	folderPathQueryOptions,
	foldersQueryOptions,
} from "@/lib/folders/queries";
import { folderImagesQueryOptions } from "@/lib/images/queries";

export const Route = createFileRoute(
	"/(authenticated)/my-folders/{-$folderId}",
)({
	beforeLoad: async ({ context, params }) => {
		const { folderId } = params;

		if (folderId) {
			await Promise.all([
				context.queryClient.prefetchQuery(foldersQueryOptions(folderId)),
				context.queryClient.prefetchQuery(folderPathQueryOptions(folderId)),
				context.queryClient.prefetchQuery(folderImagesQueryOptions(folderId)),
			]);
		} else {
			context.queryClient.prefetchQuery(foldersQueryOptions());
		}
	},
	component: RouteComponent,
});

const BASE_BREADCRUMBS = [{ name: "My Folders", link: "/my-folders" }];

function RouteComponent() {
	const { folderId } = Route.useParams();

	// Only fetch path for nested folders
	const { data: path, isLoading } = useQuery({
		...folderPathQueryOptions(folderId ?? ""),
		enabled: !!folderId,
	});

	// For root, always valid. For nested, valid if path has items
	const isValidFolder = !folderId || (path && path.length > 0);

	// Build breadcrumbs from path
	const breadcrumbs =
		path && path.length > 0
			? [
					...BASE_BREADCRUMBS,
					...path.map((item) => ({
						name: item.name,
						link: `/my-folders/${item.id}`,
					})),
				]
			: BASE_BREADCRUMBS;

	return (
		<>
			<NavBar breadrumbs={breadcrumbs} />
			<div className="flex flex-1 flex-col">
				{/* Toolbar - always visible */}
				<div className="flex items-center justify-between gap-2 p-4 pb-0">
					<h1 className="text-xl font-semibold">
						{path && path.length > 0
							? path[path.length - 1].name
							: "My Folders"}
					</h1>
					<FolderModal
						parentId={folderId}
						trigger={
							<Button>
								<HugeiconsIcon icon={FolderAddIcon} data-icon="inline-start" />
								New Folder
							</Button>
						}
					/>
				</div>

				{/* Folder content */}
				<div className="flex flex-1 flex-col gap-4 p-4">
					{folderId && isLoading ? (
						<FoldersGridSkeleton />
					) : folderId && !isValidFolder ? (
						<FolderNotFound />
					) : (
						<Suspense fallback={<FoldersGridSkeleton />}>
							<FolderContents folderId={folderId} />
						</Suspense>
					)}
				</div>
			</div>
		</>
	);
}

function FolderContents({ folderId }: { folderId?: string }) {
	const { data: folders } = useSuspenseQuery(foldersQueryOptions(folderId));

	// Only fetch images for subfolders (not root)
	const { data: images = [] } = useQuery({
		...folderImagesQueryOptions(folderId ?? ""),
		enabled: !!folderId,
	});

	const hasContent = folders.length > 0 || images.length > 0;

	// Empty state - only when no folders AND no images
	if (!hasContent) {
		return (
			<div className="space-y-6">
				{folderId && <DropZone folderId={folderId} />}
				<FoldersEmptyState parentId={folderId} />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Folders Section */}
			{folders.length > 0 && (
				<section>
					<h2 className="mb-3 text-sm font-medium text-muted-foreground">
						Folders
					</h2>
					<FolderGrid folders={folders} />
				</section>
			)}

			{/* Drop Zone - always visible in subfolders */}
			{folderId && <DropZone folderId={folderId} />}

			{/* Images Section */}
			{images.length > 0 && folderId && (
				<section>
					<h2 className="mb-3 text-sm font-medium text-muted-foreground">
						Images
					</h2>
					<ImageGrid images={images} folderId={folderId} />
				</section>
			)}
		</div>
	);
}

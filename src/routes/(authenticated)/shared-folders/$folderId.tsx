import { ArrowLeft01Icon, Share08Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense } from "react";
import { FoldersGridSkeleton } from "@/components/folders";
import { ImageGrid } from "@/components/images";
import { NavBar } from "@/components/navbar/NavBar";
import {
	SharedFolderCard,
	SharedFolderEmptyState,
	SharedFolderError,
} from "@/components/sharing";
import { Button } from "@/components/ui/button";
import type { FolderColor } from "@/lib/folders/constants";
import {
	sharedFolderContentsQueryOptions,
	sharedFolderImagesQueryOptions,
	sharedFolderPathQueryOptions,
} from "@/lib/sharing/queries";

export const Route = createFileRoute(
	"/(authenticated)/shared-folders/$folderId",
)({
	beforeLoad: async ({ context, params }) => {
		const folderId = params.folderId;
		await Promise.all([
			context.queryClient.prefetchQuery(
				sharedFolderContentsQueryOptions(folderId),
			),
			context.queryClient.prefetchQuery(
				sharedFolderImagesQueryOptions(folderId),
			),
			context.queryClient.prefetchQuery(sharedFolderPathQueryOptions(folderId)),
		]);
	},
	component: RouteComponent,
	errorComponent: SharedFolderError,
});

const BASE_BREADCRUMBS = [{ name: "Shared Folders", link: "/shared-folders" }];

function RouteComponent() {
	const params = Route.useParams();
	const folderId = params.folderId;

	const { data: folder, isLoading: folderLoading } = useQuery(
		sharedFolderContentsQueryOptions(folderId),
	);

	const { data: path } = useQuery(sharedFolderPathQueryOptions(folderId));

	// Build breadcrumbs from the path
	const breadcrumbs =
		path && path.length > 0
			? [
					...BASE_BREADCRUMBS,
					...path.map((item) => ({
						name: item.name,
						link: `/shared-folders/${item.id}`,
					})),
				]
			: BASE_BREADCRUMBS;

	return (
		<>
			<NavBar breadrumbs={breadcrumbs} />
			<div className="flex flex-1 flex-col">
				<div className="flex items-center justify-between gap-2 px-4 mt-4 h-9">
					<div className="flex items-center gap-2 min-w-0">
						<Button
							variant="ghost"
							size="icon"
							render={
								<Link
									to={
										path && path.length > 1
											? "/shared-folders/$folderId"
											: "/shared-folders"
									}
									params={
										path && path.length > 1
											? { folderId: path[path.length - 2].id }
											: undefined
									}
								/>
							}
						>
							<HugeiconsIcon icon={ArrowLeft01Icon} />
							<span className="sr-only">Go back</span>
						</Button>
						<h1 className="min-w-0 truncate text-xl font-semibold">
							{folder?.name ?? "Shared Folder"}
						</h1>
						<span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
							<HugeiconsIcon icon={Share08Icon} className="size-3" />
							Read-only
						</span>
					</div>
				</div>

				<div className="flex flex-1 flex-col gap-4 p-4">
					{folderLoading ? (
						<FoldersGridSkeleton />
					) : folder ? (
						<Suspense fallback={<FoldersGridSkeleton />}>
							<SharedFolderContents folderId={folderId} folder={folder} />
						</Suspense>
					) : (
						<SharedFolderError />
					)}
				</div>
			</div>
		</>
	);
}

interface FolderData {
	id: string;
	name: string;
	children: Array<{
		id: string;
		name: string;
		color: FolderColor;
		emoji: string | null;
		parentId: string | null;
		userId: string;
		createdAt: Date;
		updatedAt: Date;
		isFavourited: boolean;
	}>;
	owner: { id: string; name: string | null; image: string | null } | null;
}

function SharedFolderContents({
	folderId,
	folder,
}: {
	folderId: string;
	folder: FolderData;
}) {
	const { data: images = [] } = useSuspenseQuery(
		sharedFolderImagesQueryOptions(folderId),
	);

	const hasContent = folder.children.length > 0 || images.length > 0;

	if (!hasContent) {
		return <SharedFolderEmptyState />;
	}

	return (
		<div className="space-y-6">
			{folder.children.length > 0 && (
				<section>
					<h2 className="mb-3 text-sm font-medium text-muted-foreground">
						Folders
					</h2>
					<div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
						{folder.children.map((child) => (
							<SharedFolderCard
								key={child.id}
								folder={{
									id: child.id,
									name: child.name,
									color: child.color,
									emoji: child.emoji,
									isFavourited: child.isFavourited,
								}}
								sharedBy={{
									id: folder.owner?.id ?? "",
									name: folder.owner?.name ?? null,
								}}
								showRemoveFromShared={false}
							/>
						))}
					</div>
				</section>
			)}

			{images.length > 0 && (
				<section>
					<h2 className="mb-3 text-sm font-medium text-muted-foreground">
						Images
					</h2>
					<ImageGrid images={images} folderId={folderId} readOnly />
				</section>
			)}
		</div>
	);
}

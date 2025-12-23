import { Share08Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { FolderGrid, FoldersGridSkeleton } from "@/components/folders";
import { ImageGrid } from "@/components/images";
import { NavBar } from "@/components/navbar/NavBar";
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
					<div className="flex items-center gap-2">
						<h1 className="text-xl font-semibold">
							{folder?.name ?? "Shared Folder"}
						</h1>
						<span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
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
		color:
			| "slate"
			| "red"
			| "orange"
			| "yellow"
			| "green"
			| "blue"
			| "indigo"
			| "purple"
			| "rose";
		emoji: string | null;
		parentId: string | null;
		userId: string;
		createdAt: Date;
		updatedAt: Date;
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

	// Transform children to match Folder type expected by FolderGrid
	const folders = folder.children.map((child) => ({
		...child,
		imageCount: 0,
		isShared: false,
		isFavourited: false,
	}));

	const hasContent = folders.length > 0 || images.length > 0;

	if (!hasContent) {
		return <SharedFolderEmptyState />;
	}

	return (
		<div className="space-y-6">
			{folders.length > 0 && (
				<section>
					<h2 className="mb-3 text-sm font-medium text-muted-foreground">
						Folders
					</h2>
					<FolderGrid folders={folders} readOnly linkPrefix="/shared-folders" />
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

function SharedFolderEmptyState() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
			<div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
				<HugeiconsIcon
					icon={Share08Icon}
					className="size-8 text-muted-foreground"
				/>
			</div>
			<div>
				<h3 className="text-lg font-semibold">This folder is empty</h3>
				<p className="text-sm text-muted-foreground">
					No folders or images in this shared folder yet.
				</p>
			</div>
		</div>
	);
}

function SharedFolderError() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
			<div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
				<HugeiconsIcon icon={Share08Icon} className="size-8 text-destructive" />
			</div>
			<div>
				<h3 className="text-lg font-semibold">Access Denied</h3>
				<p className="text-sm text-muted-foreground">
					You don't have access to this folder, or it doesn't exist.
				</p>
			</div>
		</div>
	);
}

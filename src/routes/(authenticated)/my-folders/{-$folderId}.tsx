import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense } from "react";
import {
	FolderGrid,
	FoldersEmptyState,
	FoldersGridSkeleton,
} from "@/components/folders";
import { NavBar } from "@/components/navbar/NavBar";
import {
	folderPathQueryOptions,
	foldersQueryOptions,
} from "@/lib/folders/queries";

export const Route = createFileRoute(
	"/(authenticated)/my-folders/{-$folderId}",
)({
	beforeLoad: async ({ context, params }) => {
		const { folderId } = params;

		if (folderId) {
			await Promise.all([
				context.queryClient.prefetchQuery(foldersQueryOptions(folderId)),
				context.queryClient.prefetchQuery(folderPathQueryOptions(folderId)),
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
		</>
	);
}

function FolderContents({ folderId }: { folderId?: string }) {
	const { data: folders } = useSuspenseQuery(foldersQueryOptions(folderId));

	if (folders.length === 0) {
		return <FoldersEmptyState parentId={folderId} />;
	}

	return <FolderGrid folders={folders} />;
}

function FolderNotFound() {
	return (
		<div className="flex flex-col items-center justify-center gap-4 py-20">
			<h2 className="text-xl font-semibold">Folder not found</h2>
			<p className="text-muted-foreground">
				This folder doesn't exist or you don't have access to it.
			</p>
			<Link
				to="/my-folders/{-$folderId}"
				params={{ folderId: undefined }}
				className="text-primary underline"
			>
				Go back to My Folders
			</Link>
		</div>
	);
}

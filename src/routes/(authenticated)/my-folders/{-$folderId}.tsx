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
	folderQueryOptions,
	foldersQueryOptions,
} from "@/lib/folders/queries";

export const Route = createFileRoute(
	"/(authenticated)/my-folders/{-$folderId}",
)({
	beforeLoad: async ({ context, params }) => {
		const { folderId } = params;

		if (folderId) {
			// Nested folder: prefetch contents, details, and path
			await Promise.all([
				context.queryClient.prefetchQuery(foldersQueryOptions(folderId)),
				context.queryClient.prefetchQuery(folderQueryOptions(folderId)),
				context.queryClient.prefetchQuery(folderPathQueryOptions(folderId)),
			]);
		} else {
			// Root: just prefetch root folders
			context.queryClient.prefetchQuery(foldersQueryOptions());
		}
	},
	component: RouteComponent,
});

const baseBreadcrumbs = [{ name: "My Folders", link: "/my-folders" }];

function RouteComponent() {
	const { folderId } = Route.useParams();

	// Root folder - no validation needed
	if (!folderId) {
		return (
			<>
				<NavBar breadrumbs={baseBreadcrumbs} />
				<div className="flex flex-1 flex-col gap-4 p-4">
					<Suspense fallback={<FoldersGridSkeleton />}>
						<FolderContents />
					</Suspense>
				</div>
			</>
		);
	}

	// Nested folder - needs validation
	return <NestedFolderView folderId={folderId} />;
}

function NestedFolderView({ folderId }: { folderId: string }) {
	const {
		data: folder,
		isLoading,
		error,
	} = useQuery(folderQueryOptions(folderId));

	const folderExists = !isLoading && !error && folder;

	return (
		<>
			{folderExists ? (
				<FolderBreadcrumbs folderId={folderId} />
			) : (
				<NavBar breadrumbs={baseBreadcrumbs} />
			)}
			<div className="flex flex-1 flex-col gap-4 p-4">
				<FolderPageContent
					folderId={folderId}
					isLoading={isLoading}
					error={error}
					folder={folder}
				/>
			</div>
		</>
	);
}

function FolderBreadcrumbs({ folderId }: { folderId: string }) {
	const { data: path } = useSuspenseQuery(folderPathQueryOptions(folderId));

	const breadcrumbs = [
		...baseBreadcrumbs,
		...path.map((item) => ({
			name: item.name,
			link: `/my-folders/${item.id}`,
		})),
	];

	return <NavBar breadrumbs={breadcrumbs} />;
}

function FolderPageContent({
	folderId,
	isLoading,
	error,
	folder,
}: {
	folderId: string;
	isLoading: boolean;
	error: Error | null;
	folder: unknown;
}) {
	if (isLoading) {
		return <FoldersGridSkeleton />;
	}

	if (error || !folder) {
		return <FolderNotFound />;
	}

	return (
		<Suspense fallback={<FoldersGridSkeleton />}>
			<FolderContents folderId={folderId} />
		</Suspense>
	);
}

export function FolderContents({ folderId }: { folderId?: string | null }) {
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

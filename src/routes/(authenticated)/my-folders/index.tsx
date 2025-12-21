import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import {
	FolderGrid,
	FoldersEmptyState,
	FoldersGridSkeleton,
} from "@/components/folders";
import { NavBar } from "@/components/navbar/NavBar";
import { foldersQueryOptions } from "@/lib/folders/queries";

export const Route = createFileRoute("/(authenticated)/my-folders/")({
	beforeLoad: ({ context }) => {
		context.queryClient.prefetchQuery(foldersQueryOptions());
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<NavBar
				breadrumbs={[
					{
						name: "My Folders",
						link: "/my-folders",
					},
				]}
			/>
			<div className="flex flex-1 flex-col gap-4 p-4">
				<Suspense fallback={<FoldersGridSkeleton />}>
					<MyFoldersContent />
				</Suspense>
			</div>
		</>
	);
}

function MyFoldersContent() {
	const { data: folders } = useSuspenseQuery(foldersQueryOptions());

	if (folders.length === 0) {
		return <FoldersEmptyState />;
	}

	return <FolderGrid folders={folders} />;
}

// function FoldersContent() {
// 	const navigate = useNavigate({ from: Route.fullPath });
// 	const { search, sort, sortDir, filter, view } = Route.useSearch();

// 	const { data: folders } = useSuspenseQuery(foldersQueryOptions());

// 	const processedFolders = useMemo(() => {
// 		let result = folders;
// 		result = filterFolders(result, filter, search);
// 		result = sortFolders(result, sort, sortDir);
// 		return result;
// 	}, [folders, filter, search, sort, sortDir]);

// 	const updateSearch = (
// 		updates: Partial<z.infer<typeof myFoldersSearchSchema>>,
// 	) => {
// 		navigate({
// 			search: (prev) => ({ ...prev, ...updates }),
// 			replace: true,
// 		});
// 	};

// 	if (processedFolders.length === 0) {
// 		return (
// 			<>
// 				<FoldersToolbar
// 					search={search}
// 					sort={sort}
// 					sortDir={sortDir}
// 					filter={filter}
// 					view={view}
// 					onSearchChange={(s) => updateSearch({ search: s })}
// 					onSortChange={(s) => updateSearch({ sort: s })}
// 					onSortDirChange={(d) => updateSearch({ sortDir: d })}
// 					onFilterChange={(f) => updateSearch({ filter: f })}
// 					onViewChange={(v) => updateSearch({ view: v })}
// 				/>
// 				<FoldersEmptyState hasSearch={!!search || filter !== "all"} />
// 			</>
// 		);
// 	}

// 	return (
// 		<>
// 			<FoldersToolbar
// 				search={search}
// 				sort={sort}
// 				sortDir={sortDir}
// 				filter={filter}
// 				view={view}
// 				onSearchChange={(s) => updateSearch({ search: s })}
// 				onSortChange={(s) => updateSearch({ sort: s })}
// 				onSortDirChange={(d) => updateSearch({ sortDir: d })}
// 				onFilterChange={(f) => updateSearch({ filter: f })}
// 				onViewChange={(v) => updateSearch({ view: v })}
// 			/>
// 			{view === "grid" ? (
// 				<FolderGrid folders={processedFolders} />
// 			) : (
// 				<Suspense fallback={<FoldersTableSkeleton />}>
// 					<FolderTable folders={processedFolders} />
// 				</Suspense>
// 			)}
// 		</>
// 	);
// }

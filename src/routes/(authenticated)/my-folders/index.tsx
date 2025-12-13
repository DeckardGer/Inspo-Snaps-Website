import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Suspense, useMemo } from "react";
import { z } from "zod";
import {
	FolderGrid,
	FoldersEmptyState,
	FoldersGridSkeleton,
	FoldersTableSkeleton,
	FoldersToolbar,
	FolderTable,
} from "@/components/my-folders";
import { NavBar } from "@/components/navbar/NavBar";
import { foldersWithStatsQueryOptions } from "@/lib/folders/queries";
import { filterFolders, sortFolders } from "@/lib/folders/utils";

const myFoldersSearchSchema = z.object({
	search: z.string().optional(),
	sort: z.enum(["name", "created", "updated", "images"]).default("name"),
	sortDir: z.enum(["asc", "desc"]).default("asc"),
	filter: z.enum(["all", "private", "shared"]).default("all"),
	view: z.enum(["grid", "table"]).default("grid"),
});

export const Route = createFileRoute("/(authenticated)/my-folders/")({
	validateSearch: myFoldersSearchSchema,
	beforeLoad: ({ context }) => {
		context.queryClient.prefetchQuery(foldersWithStatsQueryOptions());
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
				<Suspense
					fallback={
						<>
							<div className="h-10" />
							<FoldersGridSkeleton />
						</>
					}
				>
					<FoldersContent />
				</Suspense>
			</div>
		</>
	);
}

function FoldersContent() {
	const navigate = useNavigate({ from: Route.fullPath });
	const { search, sort, sortDir, filter, view } = Route.useSearch();

	const { data: folders } = useSuspenseQuery(foldersWithStatsQueryOptions());

	const processedFolders = useMemo(() => {
		let result = folders;
		result = filterFolders(result, filter, search);
		result = sortFolders(result, sort, sortDir);
		return result;
	}, [folders, filter, search, sort, sortDir]);

	const updateSearch = (
		updates: Partial<z.infer<typeof myFoldersSearchSchema>>,
	) => {
		navigate({
			search: (prev) => ({ ...prev, ...updates }),
			replace: true,
		});
	};

	if (processedFolders.length === 0) {
		return (
			<>
				<FoldersToolbar
					search={search}
					sort={sort}
					sortDir={sortDir}
					filter={filter}
					view={view}
					onSearchChange={(s) => updateSearch({ search: s })}
					onSortChange={(s) => updateSearch({ sort: s })}
					onSortDirChange={(d) => updateSearch({ sortDir: d })}
					onFilterChange={(f) => updateSearch({ filter: f })}
					onViewChange={(v) => updateSearch({ view: v })}
				/>
				<FoldersEmptyState hasSearch={!!search || filter !== "all"} />
			</>
		);
	}

	return (
		<>
			<FoldersToolbar
				search={search}
				sort={sort}
				sortDir={sortDir}
				filter={filter}
				view={view}
				onSearchChange={(s) => updateSearch({ search: s })}
				onSortChange={(s) => updateSearch({ sort: s })}
				onSortDirChange={(d) => updateSearch({ sortDir: d })}
				onFilterChange={(f) => updateSearch({ filter: f })}
				onViewChange={(v) => updateSearch({ view: v })}
			/>
			{view === "grid" ? (
				<FolderGrid folders={processedFolders} />
			) : (
				<Suspense fallback={<FoldersTableSkeleton />}>
					<FolderTable folders={processedFolders} />
				</Suspense>
			)}
		</>
	);
}

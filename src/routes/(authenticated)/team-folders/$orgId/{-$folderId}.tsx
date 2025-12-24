import { FolderAddIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useEffect } from "react";
import { FolderNotFound, FoldersGridSkeleton } from "@/components/folders";
import { NavBar } from "@/components/navbar/NavBar";
import { TeamFolderGrid } from "@/components/teams/TeamFolderGrid";
import { TeamFolderModal } from "@/components/teams/TeamFolderModal";
import { TeamSwitcher } from "@/components/teams/TeamSwitcher";
import { Button } from "@/components/ui/button";
import authClient from "@/lib/auth/auth-client";
import {
	teamFolderPathQueryOptions,
	teamFoldersQueryOptions,
} from "@/lib/folders/queries";
import { organizationByIdQueryOptions } from "@/lib/organizations/queries";

export const Route = createFileRoute(
	"/(authenticated)/team-folders/$orgId/{-$folderId}",
)({
	beforeLoad: async ({ context, params }) => {
		const { orgId, folderId } = params;

		// Prefetch organization details
		const org = await context.queryClient.fetchQuery(
			organizationByIdQueryOptions(orgId),
		);

		if (folderId) {
			await Promise.all([
				context.queryClient.prefetchQuery(
					teamFoldersQueryOptions(org.id, folderId),
				),
				context.queryClient.prefetchQuery(
					teamFolderPathQueryOptions(org.id, folderId),
				),
			]);
		} else {
			await context.queryClient.prefetchQuery(teamFoldersQueryOptions(org.id));
		}

		return { organization: org };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { orgId, folderId } = Route.useParams();
	const { organization } = Route.useRouteContext();

	// Set active organization when entering this route
	useEffect(() => {
		authClient.organization.setActive({ organizationId: organization.id });
	}, [organization.id]);

	// Fetch folder path for breadcrumbs
	const { data: path, isLoading } = useQuery({
		...teamFolderPathQueryOptions(organization.id, folderId ?? ""),
		enabled: !!folderId,
	});

	// For root, always valid. For nested, valid if path has items
	const isValidFolder = !folderId || (path && path.length > 0);

	// Build breadcrumbs - simplified since team switcher handles org name
	const baseBreadcrumbs = [{ name: "Team Folders", link: "/team-folders" }];

	const breadcrumbs =
		path && path.length > 0
			? [
					...baseBreadcrumbs,
					...path.map((item) => ({
						name: item.name,
						link: `/team-folders/${orgId}/${item.id}`,
					})),
				]
			: baseBreadcrumbs;

	// Determine if we're at root level (no folder selected) or in a subfolder
	const isRootLevel = !folderId;

	// Page title for subfolders
	const subfolderTitle =
		path && path.length > 0 ? path[path.length - 1].name : null;

	return (
		<>
			<NavBar breadrumbs={breadcrumbs} />
			<div className="flex flex-1 flex-col">
				{/* Toolbar */}
				<div className="flex items-center justify-between gap-2 px-4 mt-4 h-9">
					{isRootLevel ? (
						<TeamSwitcher
							currentOrgId={orgId}
							currentOrgName={organization.name}
						/>
					) : (
						<h1 className="text-xl font-semibold">{subfolderTitle}</h1>
					)}
					<TeamFolderModal
						organizationId={organization.id}
						parentId={folderId}
						trigger={
							<Button>
								<HugeiconsIcon icon={FolderAddIcon} data-icon="inline-start" />
								New Folder
							</Button>
						}
					/>
				</div>

				{/* Content */}
				<div className="flex flex-1 flex-col gap-4 p-4">
					{folderId && isLoading ? (
						<FoldersGridSkeleton />
					) : folderId && !isValidFolder ? (
						<FolderNotFound />
					) : (
						<Suspense fallback={<FoldersGridSkeleton />}>
							<TeamFolderContents
								organizationId={organization.id}
								orgId={orgId}
								folderId={folderId}
							/>
						</Suspense>
					)}
				</div>
			</div>
		</>
	);
}

function TeamFolderContents({
	organizationId,
	orgId,
	folderId,
}: {
	organizationId: string;
	orgId: string;
	folderId?: string;
}) {
	const { data: folders } = useSuspenseQuery(
		teamFoldersQueryOptions(organizationId, folderId),
	);

	if (folders.length === 0) {
		return (
			<TeamFoldersEmptyState
				organizationId={organizationId}
				parentId={folderId}
			/>
		);
	}

	return (
		<section>
			<h2 className="mb-3 text-sm font-medium text-muted-foreground">
				Folders
			</h2>
			<TeamFolderGrid folders={folders} orgId={orgId} />
		</section>
	);
}

function TeamFoldersEmptyState({
	organizationId,
	parentId,
}: {
	organizationId: string;
	parentId?: string;
}) {
	const isNested = !!parentId;

	return (
		<div className="flex flex-col items-center justify-center gap-8 py-20">
			<div className="text-center">
				<h3 className="text-xl font-semibold tracking-tight">
					{isNested ? "This folder is empty" : "No folders yet"}
				</h3>
				<p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
					{isNested
						? "Add subfolders to organize this folder's content."
						: "Create your first folder in this team to start organizing content together."}
				</p>
			</div>

			<TeamFolderModal
				organizationId={organizationId}
				parentId={parentId}
				trigger={
					<Button size="lg" className="gap-2">
						<HugeiconsIcon icon={FolderAddIcon} className="size-5" />
						{isNested ? "Create Subfolder" : "Create Folder"}
					</Button>
				}
			/>
		</div>
	);
}

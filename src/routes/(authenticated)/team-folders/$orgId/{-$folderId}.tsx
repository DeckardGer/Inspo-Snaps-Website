import { FolderAddIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useEffect } from "react";
import { FolderNotFound, FoldersGridSkeleton } from "@/components/folders";
import { NavBar } from "@/components/navbar/NavBar";
import {
	TeamFolderError,
	TeamFolderGrid,
	TeamFolderModal,
	TeamFoldersEmptyState,
	TeamSwitcher,
} from "@/components/teams";
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

		try {
			// Fetch organization details - throws if not found or no permission
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
				await context.queryClient.prefetchQuery(
					teamFoldersQueryOptions(org.id),
				);
			}

			return { organization: org, hasError: false as const };
		} catch {
			// Return null organization on error - no sensitive data exposed
			return { organization: null, hasError: true as const };
		}
	},
	component: RouteComponent,
});

const BASE_BREADCRUMBS = [{ name: "Team Folders", link: "/team-folders" }];

function RouteComponent() {
	const { orgId, folderId } = Route.useParams();
	const { organization, hasError } = Route.useRouteContext();

	// Set active organization when entering this route
	useEffect(() => {
		if (organization) {
			authClient.organization.setActive({ organizationId: organization.id });
		}
	}, [organization]);

	// Fetch folder path for breadcrumbs (only if we have a valid org)
	const { data: path, isLoading } = useQuery({
		...teamFolderPathQueryOptions(organization?.id ?? "", folderId ?? ""),
		enabled: !!folderId && !!organization,
	});

	// Handle error state - render within layout with NavBar
	if (hasError || !organization) {
		return (
			<>
				<NavBar breadrumbs={BASE_BREADCRUMBS} />
				<TeamFolderError />
			</>
		);
	}

	// For root, always valid. For nested, valid if path has items
	const isValidFolder = !folderId || (path && path.length > 0);

	// Build breadcrumbs - simplified since team switcher handles org name
	const breadcrumbs =
		path && path.length > 0
			? [
					...BASE_BREADCRUMBS,
					...path.map((item) => ({
						name: item.name,
						link: `/team-folders/${orgId}/${item.id}`,
					})),
				]
			: BASE_BREADCRUMBS;

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
						<h1 className="min-w-0 truncate text-xl font-semibold">
							{subfolderTitle}
						</h1>
					)}
					<div className="shrink-0">
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

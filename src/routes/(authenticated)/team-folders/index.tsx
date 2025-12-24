import { createFileRoute, redirect } from "@tanstack/react-router";
import { NavBar } from "@/components/navbar/NavBar";
import { TeamsEmptyState } from "@/components/teams";
import { userOrganizationsWithActiveQueryOptions } from "@/lib/organizations/queries";

export const Route = createFileRoute("/(authenticated)/team-folders/")({
	beforeLoad: async ({ context }) => {
		const data = await context.queryClient.fetchQuery(
			userOrganizationsWithActiveQueryOptions(),
		);

		const { organizations, activeOrganizationId } = data;

		// No teams - show empty state (handled in component)
		if (organizations.length === 0) {
			return { shouldShowEmptyState: true };
		}

		// 1 team - redirect directly to it
		if (organizations.length === 1) {
			throw redirect({
				to: "/team-folders/$orgId/{-$folderId}",
				params: { orgId: organizations[0].id },
			});
		}

		// 2+ teams - redirect to active org or first org
		const activeOrg = activeOrganizationId
			? organizations.find((org) => org.id === activeOrganizationId)
			: null;

		const targetOrg = activeOrg ?? organizations[0];

		throw redirect({
			to: "/team-folders/$orgId/{-$folderId}",
			params: { orgId: targetOrg.id },
		});
	},
	component: RouteComponent,
});

function RouteComponent() {
	// This only renders if user has 0 teams
	return (
		<>
			<NavBar
				breadrumbs={[
					{
						name: "Team Folders",
						link: "/team-folders",
					},
				]}
			/>
			<div className="flex flex-1 flex-col">
				<div className="flex items-center justify-between gap-2 px-4 mt-4 h-9">
					<h1 className="text-xl font-semibold">Team Folders</h1>
				</div>

				<div className="flex flex-1 flex-col gap-4 p-4">
					<TeamsEmptyState />
				</div>
			</div>
		</>
	);
}

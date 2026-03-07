import {
	Cancel01Icon,
	CheckmarkCircle02Icon,
	Loading03Icon,
	UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { NavBar } from "@/components/navbar/NavBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	acceptTeamInvitation,
	rejectTeamInvitation,
} from "@/lib/organizations/functions";
import { teamInvitationDetailsQueryOptions } from "@/lib/organizations/queries";

export const Route = createFileRoute(
	"/(authenticated)/team-invite/$invitationId",
)({
	beforeLoad: async ({ context, params }) => {
		const invitationId = params.invitationId;
		await context.queryClient.prefetchQuery(
			teamInvitationDetailsQueryOptions(invitationId),
		);
	},
	component: RouteComponent,
});

const BREADCRUMBS = [{ name: "Team Invitation", link: "" }];

function RouteComponent() {
	const { invitationId } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const {
		data: invitation,
		isLoading,
		error,
	} = useQuery(teamInvitationDetailsQueryOptions(invitationId));

	const acceptMutation = useMutation({
		mutationFn: () => acceptTeamInvitation({ data: { invitationId } }),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["organizations"] });
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			// Remove from cache instead of invalidating - refetching would fail since status is no longer "pending"
			queryClient.removeQueries({
				queryKey: ["teamInvitation", invitationId],
			});
			toast.success(`Welcome to ${data.organizationName}!`);
			navigate({
				to: "/team-folders",
			});
		},
		onError: (err) => {
			toast.error("Failed to accept invitation", { description: err.message });
		},
	});

	const declineMutation = useMutation({
		mutationFn: () => rejectTeamInvitation({ data: { invitationId } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			// Remove from cache instead of invalidating - refetching would fail since status is no longer "pending"
			queryClient.removeQueries({
				queryKey: ["teamInvitation", invitationId],
			});
			toast.success("Invitation declined");
			navigate({ to: "/team-folders" });
		},
		onError: (err) => {
			toast.error("Failed to decline invitation", { description: err.message });
		},
	});

	if (isLoading) {
		return (
			<>
				<NavBar breadrumbs={BREADCRUMBS} />
				<div className="flex flex-1 items-center justify-center">
					<HugeiconsIcon
						icon={Loading03Icon}
						className="size-8 animate-spin text-muted-foreground"
					/>
				</div>
			</>
		);
	}

	if (error || !invitation) {
		return (
			<>
				<NavBar breadrumbs={BREADCRUMBS} />
				<div className="flex flex-1 flex-col items-center justify-center p-4">
					<div className="w-full max-w-md space-y-6 text-center">
						<div className="flex justify-center">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
								<HugeiconsIcon
									icon={UserGroupIcon}
									className="size-8 text-muted-foreground"
								/>
							</div>
						</div>
						<h1 className="text-2xl font-semibold">Invitation not found</h1>
						<p className="text-muted-foreground">
							This invitation may have expired, been declined, or the team may
							no longer exist.
						</p>
						<Button onClick={() => navigate({ to: "/team-folders" })}>
							Go to Team Folders
						</Button>
					</div>
				</div>
			</>
		);
	}

	const { organization, role, invitedBy } = invitation;
	const isPending = acceptMutation.isPending || declineMutation.isPending;

	const formatRole = (role: string) => {
		return role.charAt(0).toUpperCase() + role.slice(1);
	};

	return (
		<>
			<NavBar breadrumbs={BREADCRUMBS} />
			<div className="flex flex-1 flex-col items-center justify-center p-4">
				<div className="w-full max-w-md space-y-6">
					{/* Header */}
					<div className="text-center space-y-2">
						<div className="flex justify-center">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
								<HugeiconsIcon
									icon={UserGroupIcon}
									className="size-8 text-muted-foreground"
								/>
							</div>
						</div>
						<h1 className="text-2xl font-semibold">You've been invited</h1>
						<p className="text-muted-foreground">
							{invitedBy?.name ?? "Someone"} has invited you to join a team
						</p>
					</div>

					{/* Team Preview Card */}
					<div className="rounded-xl border bg-card p-4 shadow-sm">
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 flex items-center justify-center bg-accent rounded-xl">
								<HugeiconsIcon
									icon={UserGroupIcon}
									className="size-8 text-muted-foreground"
								/>
							</div>
							<div className="min-w-0 flex-1">
								<h2 className="font-semibold truncate">{organization.name}</h2>
								<div className="flex items-center gap-2 mt-1">
									<span className="text-sm text-muted-foreground">
										Invited by {invitedBy?.name ?? "Unknown"}
									</span>
								</div>
							</div>
							<Badge variant="secondary">{formatRole(role)}</Badge>
						</div>
					</div>

					{/* Info */}
					<div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
						<p>
							By accepting this invitation, you'll join{" "}
							<strong>{organization.name}</strong> as a{" "}
							<strong>{formatRole(role)}</strong>. You'll have access to the
							team's shared folders and be able to collaborate with other
							members.
						</p>
					</div>

					{/* Actions */}
					<div className="flex gap-3">
						<Button
							variant="outline"
							className="flex-1"
							onClick={() => declineMutation.mutate()}
							disabled={isPending}
						>
							{declineMutation.isPending ? (
								<HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
							) : (
								<HugeiconsIcon icon={Cancel01Icon} />
							)}
							Decline
						</Button>
						<Button
							className="flex-1"
							onClick={() => acceptMutation.mutate()}
							disabled={isPending}
						>
							{acceptMutation.isPending ? (
								<HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
							) : (
								<HugeiconsIcon icon={CheckmarkCircle02Icon} />
							)}
							Join Team
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}

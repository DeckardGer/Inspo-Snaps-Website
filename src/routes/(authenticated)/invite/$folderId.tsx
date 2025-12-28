import {
	Cancel01Icon,
	CheckmarkCircle02Icon,
	Folder01Icon,
	FolderShared02Icon,
	Loading03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { NavBar } from "@/components/navbar/NavBar";
import { InvitationError } from "@/components/sharing/InvitationError";
import { Button } from "@/components/ui/button";
import { FOLDER_CLASSES } from "@/lib/folders/constants";
import { acceptInvitation, cancelInvitation } from "@/lib/sharing/functions";
import { invitationDetailsQueryOptions } from "@/lib/sharing/queries";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/(authenticated)/invite/$folderId")({
	beforeLoad: async ({ context, params }) => {
		const folderId = params.folderId;
		await context.queryClient.prefetchQuery(
			invitationDetailsQueryOptions(folderId),
		);
	},
	component: RouteComponent,
	errorComponent: InvitationError,
});

const BREADCRUMBS = [{ name: "Folder Invitation", link: "" }];

function RouteComponent() {
	const { folderId } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const {
		data: invitation,
		isLoading,
		error,
	} = useQuery(invitationDetailsQueryOptions(folderId));

	const acceptMutation = useMutation({
		mutationFn: () => acceptInvitation({ data: { folderId } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["pendingInvitations"] });
			queryClient.invalidateQueries({ queryKey: ["sharedWithMe"] });
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			// Remove from cache instead of invalidating - refetching would fail since status is no longer "pending"
			queryClient.removeQueries({ queryKey: ["invitationDetails", folderId] });
			toast.success(
				"Invitation accepted! Folder added to your shared folders.",
			);
			navigate({
				to: "/shared-folders/$folderId",
				params: { folderId },
			});
		},
		onError: (err) => {
			toast.error("Failed to accept invitation", { description: err.message });
		},
	});

	const declineMutation = useMutation({
		mutationFn: () => cancelInvitation({ data: { folderId } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["pendingInvitations"] });
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			// Remove from cache instead of invalidating - refetching would fail since status is no longer "pending"
			queryClient.removeQueries({ queryKey: ["invitationDetails", folderId] });
			toast.success("Invitation declined");
			navigate({ to: "/shared-folders" });
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
				<InvitationError />
			</>
		);
	}

	const { folder, sharedBy } = invitation;
	const colors = FOLDER_CLASSES[folder.color];
	const isPending = acceptMutation.isPending || declineMutation.isPending;

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
									icon={FolderShared02Icon}
									className="size-8 text-muted-foreground"
								/>
							</div>
						</div>
						<h1 className="text-2xl font-semibold">You've been invited</h1>
						<p className="text-muted-foreground">
							{sharedBy.name ?? "Someone"} has shared a folder with you
						</p>
					</div>

					{/* Folder Preview Card */}
					<div className="rounded-xl border bg-card p-4 shadow-sm">
						<div className="flex items-center gap-4">
							<div
								className={cn(
									"flex h-16 w-16 shrink-0 items-center justify-center rounded-xl",
									colors.background,
								)}
							>
								<div
									className={cn(
										"flex h-10 w-10 items-center justify-center rounded-full",
										colors.foreground,
									)}
								>
									{folder.emoji ? (
										<span className="text-xl">{folder.emoji}</span>
									) : (
										<HugeiconsIcon
											icon={Folder01Icon}
											className={cn("size-5", colors.icon)}
											fill="currentColor"
										/>
									)}
								</div>
							</div>
							<div className="min-w-0 flex-1">
								<h2 className="font-semibold truncate">{folder.name}</h2>
								<p className="text-sm text-muted-foreground">
									Shared by {sharedBy.name ?? "Unknown"}
								</p>
							</div>
						</div>
					</div>

					{/* Info */}
					<div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
						<p>
							By accepting this invitation, you'll get{" "}
							<strong>read-only access</strong> to view this folder and its
							contents. The folder will appear in your Shared Folders.
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
							Accept Invite
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}

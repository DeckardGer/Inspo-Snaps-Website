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
import { ShareLinkError } from "@/components/sharing/ShareLinkError";
import { Button } from "@/components/ui/button";
import { clientEnv } from "@/config/env/client";
import { FOLDER_CLASSES } from "@/lib/folders/constants";
import { acceptShareLinkInvite } from "@/lib/sharing/functions";
import { sharedLinkAccessQueryOptions } from "@/lib/sharing/queries";
import { cn } from "@/lib/utils";

const OG_IMAGE_URL = `${clientEnv.VITE_BASE_URL}/og-image.png`;

export const Route = createFileRoute("/(authenticated)/share/$linkId")({
	loader: async ({ context, params }) => {
		const linkId = params.linkId;
		try {
			const shareAccess = await context.queryClient.ensureQueryData(
				sharedLinkAccessQueryOptions(linkId),
			);
			return { shareAccess };
		} catch {
			return { shareAccess: null };
		}
	},
	head: ({ loaderData }) => {
		const folder = loaderData?.shareAccess?.folder;
		const ownerName = folder?.owner?.name ?? "Someone";
		const folderName = folder?.name ?? "Shared Folder";

		return {
			meta: [
				{ title: `${folderName} - Shared on Inspo Snaps` },
				{
					name: "description",
					content: `View "${folderName}" shared by ${ownerName} on Inspo Snaps.`,
				},
				{ name: "robots", content: "noindex, nofollow" },
				// Open Graph for social sharing previews
				{ property: "og:title", content: `${folderName} - Shared on Inspo Snaps` },
				{
					property: "og:description",
					content: `View "${folderName}" shared by ${ownerName} on Inspo Snaps.`,
				},
				{ property: "og:image", content: OG_IMAGE_URL },
				// Twitter Card
				{ name: "twitter:title", content: `${folderName} - Shared on Inspo Snaps` },
				{
					name: "twitter:description",
					content: `View "${folderName}" shared by ${ownerName} on Inspo Snaps.`,
				},
				{ name: "twitter:image", content: OG_IMAGE_URL },
			],
		};
	},
	component: RouteComponent,
	errorComponent: ShareLinkError,
});

const BREADCRUMBS = [{ name: "Share Invite", link: "" }];

function RouteComponent() {
	const { linkId } = Route.useParams();
	const { shareAccess: loaderShareAccess } = Route.useLoaderData();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	// Use loader data if available, otherwise fetch
	const {
		data: queryShareAccess,
		isLoading,
		error,
	} = useQuery({
		...sharedLinkAccessQueryOptions(linkId),
		// Skip query if we already have loader data
		enabled: !loaderShareAccess,
	});

	const shareAccess = loaderShareAccess ?? queryShareAccess;

	const acceptMutation = useMutation({
		mutationFn: () => acceptShareLinkInvite({ data: { linkId } }),
		onSuccess: (result) => {
			queryClient.invalidateQueries({ queryKey: ["sharedWithMe"] });
			if (result.alreadyAccepted) {
				toast.info("You already have access to this folder");
			} else {
				toast.success("Invite accepted! Folder added to your shared folders.");
			}
			navigate({
				to: "/shared-folders/$folderId",
				params: { folderId: result.folderId },
			});
		},
		onError: (err) => {
			toast.error("Failed to accept invite", { description: err.message });
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

	if (error || !shareAccess) {
		return (
			<>
				<NavBar breadrumbs={BREADCRUMBS} />
				<ShareLinkError />
			</>
		);
	}

	const { folder, expiresAt } = shareAccess;
	const colors = FOLDER_CLASSES[folder.color];

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
							{folder.owner?.name ?? "Someone"} has shared a folder with you
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
									Shared by {folder.owner?.name ?? "Unknown"}
								</p>
								{expiresAt && (
									<p className="text-xs text-muted-foreground mt-1">
										Link expires {new Date(expiresAt).toLocaleDateString()}
									</p>
								)}
							</div>
						</div>
					</div>

					{/* Info */}
					<div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
						<p>
							By accepting this invite, you'll get{" "}
							<strong>read-only access</strong> to view this folder and its
							contents. The folder will appear in your Shared Folders.
						</p>
					</div>

					{/* Actions */}
					<div className="flex gap-3">
						<Button
							variant="outline"
							className="flex-1"
							onClick={() => navigate({ to: "/shared-folders" })}
						>
							<HugeiconsIcon icon={Cancel01Icon} />
							Decline
						</Button>
						<Button
							className="flex-1"
							onClick={() => acceptMutation.mutate()}
							disabled={acceptMutation.isPending}
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

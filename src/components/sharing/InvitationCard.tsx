import { Folder01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FOLDER_CLASSES, type FolderColor } from "@/lib/folders/constants";
import { acceptInvitation, cancelInvitation } from "@/lib/sharing/functions";
import { cn } from "@/lib/utils";

interface InvitationFolder {
	id: string;
	name: string;
	color: FolderColor;
	emoji: string | null;
}

interface InvitationSharedBy {
	id: string;
	name: string | null;
	image: string | null;
}

interface InvitationCardProps {
	folder: InvitationFolder;
	sharedBy: InvitationSharedBy;
}

export function InvitationCard({ folder, sharedBy }: InvitationCardProps) {
	const colors = FOLDER_CLASSES[folder.color];
	const queryClient = useQueryClient();

	const acceptMutation = useMutation({
		mutationFn: () => acceptInvitation({ data: { folderId: folder.id } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["pendingInvitations"] });
			queryClient.invalidateQueries({ queryKey: ["sharedWithMe"] });
			toast.success(`Accepted invitation to "${folder.name}"`);
		},
		onError: (error) => {
			toast.error(
				error instanceof Error ? error.message : "Failed to accept invitation",
			);
		},
	});

	const cancelMutation = useMutation({
		mutationFn: () => cancelInvitation({ data: { folderId: folder.id } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["pendingInvitations"] });
			toast.success(`Declined invitation to "${folder.name}"`);
		},
		onError: (error) => {
			toast.error(
				error instanceof Error ? error.message : "Failed to decline invitation",
			);
		},
	});

	const isLoading = acceptMutation.isPending || cancelMutation.isPending;

	return (
		<div
			className={cn(
				"group relative bg-card rounded-xl shadow-md border border-dashed border-primary/30",
				colors.glow,
			)}
		>
			<div className="p-3">
				<div className="flex items-center gap-3">
					{/* Folder icon */}
					<div
						className={cn(
							"flex shrink-0 justify-center items-center size-12 rounded-lg",
							colors.background,
						)}
					>
						<div
							className={cn(
								"flex justify-center items-center size-8 rounded-full",
								colors.foreground,
							)}
						>
							{folder.emoji ? (
								<span className="text-base leading-none">{folder.emoji}</span>
							) : (
								<HugeiconsIcon
									icon={Folder01Icon}
									className={cn("size-4", colors.icon)}
									fill="currentColor"
								/>
							)}
						</div>
					</div>

					{/* Folder info */}
					<div className="flex-1 min-w-0">
						<div className="text-sm font-semibold truncate">{folder.name}</div>
						<div className="text-xs text-muted-foreground truncate">
							From @{sharedBy.name ?? "Unknown"}
						</div>
					</div>
				</div>

				{/* Action buttons */}
				<div className="flex gap-2 mt-3">
					<Button
						variant="outline"
						size="sm"
						className="flex-1"
						onClick={() => cancelMutation.mutate()}
						disabled={isLoading}
					>
						Decline
					</Button>
					<Button
						size="sm"
						className="flex-1"
						onClick={() => acceptMutation.mutate()}
						disabled={isLoading}
					>
						Accept
					</Button>
				</div>
			</div>
		</div>
	);
}

import {
	Delete02Icon,
	FolderFavouriteIcon,
	FolderRemoveIcon,
	Loading03Icon,
	MoreVerticalIcon,
	PencilEdit01Icon,
	Share08Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ShareDialog } from "@/components/sharing";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { FolderColor } from "@/lib/folders/constants";
import {
	addFolderToFavourites,
	deleteFolder,
	removeFolderFromFavourites,
} from "@/lib/folders/functions";
import { folderStatsQueryOptions } from "@/lib/folders/queries";
import { FolderModal } from "./FolderModal";

export type FolderForActions = {
	id: string;
	parentId: string | null;
	name: string;
	color: FolderColor;
	emoji: string | null;
	isFavourited: boolean;
};

type FolderActionsMenuProps = {
	folder: FolderForActions;
	trigger: React.ReactElement;
	onOpenChange?: (open: boolean) => void;
	align?: "start" | "center" | "end";
	side?: "top" | "right" | "bottom" | "left";
};

export function FolderActionsMenu({
	folder,
	trigger,
	onOpenChange,
	align = "end",
	side,
}: FolderActionsMenuProps) {
	const [menuOpen, setMenuOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [shareDialogOpen, setShareDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const queryClient = useQueryClient();

	const handleOpenChange = (open: boolean) => {
		setMenuOpen(open);
		onOpenChange?.(open);
	};

	// Fetch stats only when delete dialog is open
	const { data: stats, isLoading: statsLoading } = useQuery({
		...folderStatsQueryOptions(folder.id),
		enabled: deleteDialogOpen,
	});

	const favouriteMutation = useMutation({
		mutationFn: () =>
			folder.isFavourited
				? removeFolderFromFavourites({ data: { id: folder.id } })
				: addFolderToFavourites({ data: { id: folder.id } }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["folders", folder.parentId ?? "root"],
				exact: true,
			});
			queryClient.invalidateQueries({
				queryKey: ["favouriteFolders"],
				exact: true,
			});
			queryClient.invalidateQueries({
				queryKey: ["sharedByMe"],
			});
			toast.success(
				folder.isFavourited ? "Removed from favourites" : "Added to favourites",
			);
		},
		onError: (error) => {
			toast.error(
				folder.isFavourited
					? "Failed to remove from favourites"
					: "Failed to add to favourites",
				{ description: error.message },
			);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: () => deleteFolder({ data: { id: folder.id } }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["folders", folder.parentId ?? "root"],
				exact: true,
			});
			queryClient.invalidateQueries({
				queryKey: ["favouriteFolders"],
				exact: true,
			});
			queryClient.invalidateQueries({
				queryKey: ["sharedByMe"],
			});
			toast.success("Folder deleted", {
				description: `"${folder.name}" has been permanently deleted.`,
			});
			setDeleteDialogOpen(false);
		},
		onError: (error) => {
			toast.error("Failed to delete folder", {
				description: error.message,
			});
		},
	});

	return (
		<>
			<DropdownMenu open={menuOpen} onOpenChange={handleOpenChange}>
				<DropdownMenuTrigger render={trigger}>
					<HugeiconsIcon icon={MoreVerticalIcon} />
				</DropdownMenuTrigger>
				<DropdownMenuContent align={align} side={side} className="w-48">
					<DropdownMenuItem
						onClick={() => {
							setMenuOpen(false);
							setEditModalOpen(true);
						}}
					>
						<HugeiconsIcon icon={PencilEdit01Icon} />
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							setMenuOpen(false);
							favouriteMutation.mutate();
						}}
						disabled={favouriteMutation.isPending}
					>
						<HugeiconsIcon
							icon={
								folder.isFavourited ? FolderRemoveIcon : FolderFavouriteIcon
							}
						/>
						{folder.isFavourited ? "Unfavourite" : "Favourite"}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							setMenuOpen(false);
							setShareDialogOpen(true);
						}}
					>
						<HugeiconsIcon icon={Share08Icon} />
						Share
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						variant="destructive"
						onClick={() => {
							setMenuOpen(false);
							setDeleteDialogOpen(true);
						}}
					>
						<HugeiconsIcon icon={Delete02Icon} />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Edit modal */}
			<FolderModal
				folder={folder}
				parentId={folder.parentId}
				open={editModalOpen}
				onOpenChange={setEditModalOpen}
			/>

			{/* Share dialog */}
			<ShareDialog
				folder={folder}
				open={shareDialogOpen}
				onOpenChange={setShareDialogOpen}
			/>

			{/* Delete confirmation dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete this
							folder and all its contents.
							{statsLoading ? (
								<span className="mt-2 block text-muted-foreground">
									Loading folder contents...
								</span>
							) : stats &&
								(stats.nestedFolderCount > 0 || stats.imageCount > 0) ? (
								<span className="mt-2 block font-medium text-destructive">
									This will delete{" "}
									{stats.nestedFolderCount > 0 && (
										<>
											{stats.nestedFolderCount} nested folder
											{stats.nestedFolderCount !== 1 && "s"}
										</>
									)}
									{stats.nestedFolderCount > 0 &&
										stats.imageCount > 0 &&
										" and "}
									{stats.imageCount > 0 && (
										<>
											{stats.imageCount} image
											{stats.imageCount !== 1 && "s"}
										</>
									)}
									.
								</span>
							) : null}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={deleteMutation.isPending}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							variant="destructive"
							onClick={() => deleteMutation.mutate()}
							disabled={deleteMutation.isPending}
						>
							{deleteMutation.isPending ? (
								<>
									<HugeiconsIcon
										icon={Loading03Icon}
										className="animate-spin"
									/>
									Deleting...
								</>
							) : (
								"Delete"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

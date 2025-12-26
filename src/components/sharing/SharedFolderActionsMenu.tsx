import {
	Copy01Icon,
	FolderFavouriteIcon,
	FolderRemoveIcon,
	Loading03Icon,
	MoreVerticalIcon,
	UserRemove01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
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
	removeFolderFromFavourites,
} from "@/lib/folders/functions";
import { cloneSharedFolder, removeFromShared } from "@/lib/sharing/functions";

export type SharedFolderForActions = {
	id: string;
	name: string;
	color: FolderColor;
	emoji: string | null;
	isFavourited: boolean;
};

type SharedFolderActionsMenuProps = {
	folder: SharedFolderForActions;
	trigger: React.ReactElement;
	onOpenChange?: (open: boolean) => void;
	align?: "start" | "center" | "end";
	side?: "top" | "right" | "bottom" | "left";
	showRemoveFromShared?: boolean;
};

export function SharedFolderActionsMenu({
	folder,
	trigger,
	onOpenChange,
	align = "end",
	side,
	showRemoveFromShared = true,
}: SharedFolderActionsMenuProps) {
	const [menuOpen, setMenuOpen] = useState(false);
	const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
	const queryClient = useQueryClient();

	const handleOpenChange = (open: boolean) => {
		setMenuOpen(open);
		onOpenChange?.(open);
	};

	const favouriteMutation = useMutation({
		mutationFn: () =>
			folder.isFavourited
				? removeFolderFromFavourites({ data: { id: folder.id } })
				: addFolderToFavourites({ data: { id: folder.id } }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["sharedWithMe"],
			});
			queryClient.invalidateQueries({
				queryKey: ["sharedFolderContents"],
			});
			queryClient.invalidateQueries({
				queryKey: ["favouriteFolders"],
				exact: true,
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

	const removeFromSharedMutation = useMutation({
		mutationFn: () => removeFromShared({ data: { folderId: folder.id } }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["sharedWithMe"],
			});
			queryClient.invalidateQueries({
				queryKey: ["favouriteFolders"],
				exact: true,
			});
			toast.success("Removed from shared folders", {
				description: `"${folder.name}" has been removed from your shared folders.`,
			});
			setRemoveDialogOpen(false);
		},
		onError: (error) => {
			toast.error("Failed to remove from shared folders", {
				description: error.message,
			});
		},
	});

	const cloneMutation = useMutation({
		mutationFn: () => cloneSharedFolder({ data: { folderId: folder.id } }),
		onSuccess: (result) => {
			queryClient.invalidateQueries({ queryKey: ["folders", "root"] });
			toast.success(`Cloned "${result.folderName}" to My Folders`, {
				description: "The folder and all its contents have been copied.",
			});
		},
		onError: (error) => {
			toast.error("Failed to clone folder", {
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
							cloneMutation.mutate();
						}}
						disabled={cloneMutation.isPending}
					>
						<HugeiconsIcon icon={Copy01Icon} />
						Clone to My Folders
					</DropdownMenuItem>
					{showRemoveFromShared && (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								variant="destructive"
								onClick={() => {
									setMenuOpen(false);
									setRemoveDialogOpen(true);
								}}
							>
								<HugeiconsIcon icon={UserRemove01Icon} />
								Remove from shared
							</DropdownMenuItem>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Remove from shared confirmation dialog */}
			<AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Remove from shared folders?</AlertDialogTitle>
						<AlertDialogDescription>
							You will no longer have access to "{folder.name}" or any of its
							contents. The folder owner would need to share it with you again
							for you to regain access.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={removeFromSharedMutation.isPending}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							variant="destructive"
							onClick={() => removeFromSharedMutation.mutate()}
							disabled={removeFromSharedMutation.isPending}
						>
							{removeFromSharedMutation.isPending ? (
								<>
									<HugeiconsIcon
										icon={Loading03Icon}
										className="animate-spin"
									/>
									Removing...
								</>
							) : (
								"Remove"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

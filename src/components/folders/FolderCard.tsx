import {
	Delete02Icon,
	Folder01Icon,
	FolderFavouriteIcon,
	FolderRemoveIcon,
	FolderTransferIcon,
	Loading03Icon,
	MoreVerticalIcon,
	PencilEdit01Icon,
	Share08Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
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
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FOLDER_CLASSES } from "@/lib/folders/constants";
import {
	addFolderToFavourites,
	deleteFolder,
	type Folder,
	removeFolderFromFavourites,
} from "@/lib/folders/functions";
import { folderStatsQueryOptions } from "@/lib/folders/queries";
import { cn } from "@/lib/utils";
import { FolderModal } from "./FolderModal";

type FolderCardProps = {
	folder: Folder;
};

export function FolderCard({ folder }: FolderCardProps) {
	const [menuOpen, setMenuOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const colors = FOLDER_CLASSES[folder.color];
	const queryClient = useQueryClient();

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
		<div
			data-menu-open={menuOpen || undefined}
			className={cn(
				"group relative bg-card rounded-xl shadow-md transition-[scale,box-shadow] duration-200 ease-out hover:scale-[1.02] hover:shadow-lg data-[menu-open]:scale-[1.02] data-[menu-open]:shadow-lg",
				colors.glow,
			)}
		>
			{/* Menu button - positioned absolutely */}
			<DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
				<DropdownMenuTrigger
					render={
						<Button
							size="icon-sm"
							variant="secondary"
							className="absolute top-2 right-2 z-10 shadow-lg hover:bg-tertiary opacity-0 group-hover:opacity-100 group-data-[menu-open]:opacity-100 transition-[opacity,background-color] focus-visible:opacity-100"
						/>
					}
				>
					<HugeiconsIcon icon={MoreVerticalIcon} />
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48">
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
					<DropdownMenuItem>
						<HugeiconsIcon icon={Share08Icon} />
						Share
					</DropdownMenuItem>
					<DropdownMenuItem>
						<HugeiconsIcon icon={FolderTransferIcon} />
						Move to...
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

			{/* Card link - covers the entire card */}
			<Link
				to="/my-folders/{-$folderId}"
				params={{ folderId: folder.id }}
				className="block focus-visible:ring-ring/50 focus-visible:ring-[3px] rounded-xl outline-none h-full"
			>
				<div
					className={cn(
						"flex justify-center items-center h-32 w-full rounded-xl",
						colors.background,
					)}
				>
					<div
						className={cn(
							"flex justify-center items-center w-20 h-20 rounded-full",
							colors.foreground,
						)}
					>
						{folder.emoji ? (
							<span className="text-[2rem] leading-none">{folder.emoji}</span>
						) : (
							<HugeiconsIcon
								icon={Folder01Icon}
								className={cn("size-8", colors.icon)}
								fill="currentColor"
							/>
						)}
					</div>
				</div>
				<div className="flex justify-between items-center m-2">
					<div className="text-sm font-semibold truncate pr-2">
						{folder.name}
					</div>
					<div className="text-xs font-medium text-quaternary-foreground">
						{folder.imageCount}
					</div>
				</div>
			</Link>

			{/* Edit modal */}
			<FolderModal
				folder={folder}
				parentId={folder.parentId}
				open={editModalOpen}
				onOpenChange={setEditModalOpen}
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
		</div>
	);
}

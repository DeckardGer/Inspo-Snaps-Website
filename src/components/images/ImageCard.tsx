import {
	Alert01Icon,
	Delete02Icon,
	Download04Icon,
	Loading03Icon,
	MoreVerticalIcon,
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
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useImageUrl } from "@/hooks/use-image-url";
import { removeImageFromFolder } from "@/lib/images/functions";

export interface Image {
	id: string;
	storageKey: string;
	filename: string;
	originUrl?: string | null;
	addedAt: Date;
}

interface FolderImageCardProps {
	image: Image;
	folderId: string;
}

export function ImageCard({ image, folderId }: FolderImageCardProps) {
	const [menuOpen, setMenuOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const queryClient = useQueryClient();
	const { data: imageUrl, isLoading: isLoadingUrl } = useImageUrl(
		image.storageKey,
	);

	const deleteMutation = useMutation({
		mutationFn: () =>
			removeImageFromFolder({ data: { imageId: image.id, folderId } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["folderImages", folderId] });
			queryClient.invalidateQueries({ queryKey: ["folders"] });

			toast.success("Image removed from folder");

			setDeleteDialogOpen(false);
		},
		onError: (error) => {
			toast.error("Failed to remove image", {
				description: error.message,
			});
		},
	});

	const handleDownload = async () => {
		if (!imageUrl) return;

		try {
			const response = await fetch(imageUrl);
			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = image.filename;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch {
			toast.error("Failed to download image");
		}
	};

	// // Extract domain from originUrl if present
	// const originDomain = image.originUrl
	// 	? new URL(image.originUrl).hostname.replace("www.", "")
	// 	: null;

	return (
		<div
			data-menu-open={menuOpen || undefined}
			className="group relative bg-card rounded-xl shadow-md overflow-hidden h-32"
		>
			{/* Image Container */}
			{isLoadingUrl ? (
				<Skeleton className="w-full h-full" />
			) : imageUrl ? (
				<>
					{/* Menu button - positioned absolutely */}
					<DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
						<DropdownMenuTrigger
							render={
								<Button
									size="icon-sm"
									variant="secondary"
									className="absolute top-2 right-2 z-10 shadow-sm hover:bg-tertiary opacity-0 group-hover:opacity-100 group-data-[menu-open]:opacity-100 transition-[opacity,background-color] focus-visible:opacity-100"
								/>
							}
						>
							<HugeiconsIcon icon={MoreVerticalIcon} />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-48">
							<DropdownMenuItem onClick={handleDownload} disabled={!imageUrl}>
								<HugeiconsIcon icon={Download04Icon} />
								Download
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
								Remove from folder
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<img
						src={imageUrl}
						alt={image.filename}
						className="w-full h-full object-cover group-hover:scale-105 group-data-[menu-open]:scale-105 transition-transform duration-200 cursor-pointer"
					/>

					{/* Shadow Overlay on Hover */}
					<div className="absolute inset-0 rounded-xl shadow-[inset_0_0_20px_rgba(0,0,0,0.3)] opacity-0 group-hover:opacity-100 group-data-[menu-open]:opacity-100 transition-opacity duration-200 pointer-events-none" />
				</>
			) : (
				<div className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground">
					<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-destructive/10">
						<HugeiconsIcon
							icon={Alert01Icon}
							className="size-5 text-destructive"
						/>
					</div>
					<span className="text-sm">Failed to load</span>
				</div>
			)}

			{/* Delete confirmation dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will remove the image from this folder. If this is the only
							folder containing this image, it will be permanently deleted.
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

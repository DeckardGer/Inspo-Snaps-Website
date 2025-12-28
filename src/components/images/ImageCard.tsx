import {
	Alert01Icon,
	Delete02Icon,
	Download04Icon,
	Loading03Icon,
	MoreVerticalIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
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
import {
	removeImageFromFolder,
	removeTeamImageFromFolder,
} from "@/lib/images/functions";

export interface Image {
	id: string;
	storageKey: string;
	filename: string;
	imageUrl: string;
	originUrl?: string | null;
	addedAt: Date;
}

interface FolderImageCardProps {
	image: Image;
	folderId: string;
	organizationId?: string;
	readOnly?: boolean;
	onOpenLightbox?: (rect: DOMRect | null) => void;
	registerRef?: (element: HTMLDivElement | null) => void;
}

export function ImageCard({
	image,
	folderId,
	organizationId,
	readOnly,
	onOpenLightbox,
	registerRef,
}: FolderImageCardProps) {
	const [menuOpen, setMenuOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const imageContainerRef = useRef<HTMLDivElement>(null);
	const queryClient = useQueryClient();

	const imageUrl = image.imageUrl;

	const deleteMutation = useMutation({
		mutationFn: () =>
			organizationId
				? removeTeamImageFromFolder({
						data: { imageId: image.id, folderId, organizationId },
					})
				: removeImageFromFolder({ data: { imageId: image.id, folderId } }),
		onSuccess: () => {
			if (organizationId) {
				queryClient.invalidateQueries({
					queryKey: ["teamFolderImages", organizationId, folderId],
					exact: true,
				});
				queryClient.invalidateQueries({
					queryKey: ["teamFolders", organizationId],
					refetchType: "active",
				});
			} else {
				queryClient.invalidateQueries({
					queryKey: ["folderImages", folderId],
					exact: true,
				});
				queryClient.invalidateQueries({
					queryKey: ["folders"],
					refetchType: "active",
				});
			}

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

	const handleImageClick = () => {
		const rect = imageContainerRef.current?.getBoundingClientRect() ?? null;
		onOpenLightbox?.(rect);
	};

	const setRefs = (element: HTMLDivElement | null) => {
		(
			imageContainerRef as React.MutableRefObject<HTMLDivElement | null>
		).current = element;
		registerRef?.(element);
	};

	return (
		<div
			ref={setRefs}
			data-menu-open={menuOpen || undefined}
			className="group relative bg-card rounded-xl shadow-md h-32"
		>
			{/* Image Container */}
			{imageUrl ? (
				<>
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
							<DropdownMenuItem onClick={handleDownload} disabled={!imageUrl}>
								<HugeiconsIcon icon={Download04Icon} />
								Download
							</DropdownMenuItem>
							{!readOnly && (
								<>
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
								</>
							)}
						</DropdownMenuContent>
					</DropdownMenu>

					<button
						type="button"
						onClick={handleImageClick}
						aria-label={`View ${image.filename} full size`}
						className="w-full h-full cursor-pointer rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 overflow-hidden"
					>
						<img
							src={imageUrl}
							alt={image.filename}
							loading="lazy"
							decoding="async"
							className="w-full h-full object-cover group-hover:scale-105 group-data-[menu-open]:scale-105 transition-transform duration-200 cursor-pointer"
						/>
					</button>

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

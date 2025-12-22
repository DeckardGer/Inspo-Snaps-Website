import {
	Folder01Icon,
	Globe02Icon,
	MoreVerticalIcon,
	StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface ImageCardData {
	id: string;
	imageUrl: string;
	directory: string;
	savedFrom: string;
	isFavorite: boolean;
}

interface ImageCardProps {
	image: ImageCardData;
	onToggleFavorite: (id: string) => void;
}

export function ImageCard({ image, onToggleFavorite }: ImageCardProps) {
	const [isHovered, setIsHovered] = React.useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
	const shouldShowButtons = isHovered || isDropdownOpen;

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: Needs to be
		<div
			className="group overflow-hidden rounded-xl border bg-card shadow-md transition-[box-shadow] duration-300 hover:shadow-xl"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Image Container */}
			<div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50 rounded-[calc(var(--radius)_+3px)] cursor-pointer">
				<img
					src={image.imageUrl}
					alt="Saved"
					className="h-full w-full object-cover transition-all duration-300 group-hover:scale-110"
				/>

				{/* Gradient Overlay on Hover */}
				<div
					className={cn(
						"absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/30 transition-opacity duration-300",
						"opacity-0 group-hover:opacity-100",
					)}
				/>

				{/* Top Overlay Actions */}
				<div
					className={cn(
						"absolute top-2 right-2 bg-card rounded-md transition-opacity duration-300",
						shouldShowButtons
							? "opacity-100 pointer-events-auto"
							: "opacity-0 pointer-events-none",
					)}
				>
					<Button
						size="icon"
						variant="ghost"
						className="rounded-r-none"
						onClick={() => onToggleFavorite(image.id)}
						tabIndex={shouldShowButtons ? 0 : -1}
					>
						<HugeiconsIcon
							icon={StarIcon}
							className={cn(
								"transition-all duration-200",
								image.isFavorite && "fill-yellow-500 text-yellow-500 scale-110",
							)}
						/>
					</Button>
					<DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
						<DropdownMenuTrigger
							render={
								<Button
									size="icon"
									variant="ghost"
									className="rounded-l-none"
									tabIndex={shouldShowButtons ? 0 : -1}
								>
									<HugeiconsIcon icon={MoreVerticalIcon} />
								</Button>
							}
						/>
						<DropdownMenuContent align="end" className="w-48">
							<DropdownMenuItem>View Full Size</DropdownMenuItem>
							<DropdownMenuItem>Download</DropdownMenuItem>
							<DropdownMenuItem>Share</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Info Footer */}
			<div className="py-2 px-4 space-y-1.5">
				<div className="flex items-center">
					<HugeiconsIcon
						icon={Folder01Icon}
						size={12}
						className="shrink-0 fill-foreground"
					/>
					<span className="truncate text-xs text-secondary-foreground leading-tight ml-2">
						{image.directory}
					</span>
				</div>
				<div className="flex items-center">
					<HugeiconsIcon icon={Globe02Icon} size={12} className="shrink-0" />
					<span className="truncate text-xs text-secondary-foreground leading-tight ml-2">
						{image.savedFrom}
					</span>
				</div>
			</div>
		</div>
	);
}

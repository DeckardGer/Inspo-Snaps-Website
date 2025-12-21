import { Folder01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { FOLDER_CLASSES } from "@/lib/folders/constants";
import type { Folder } from "@/lib/folders/functions";
import { cn } from "@/lib/utils";

type FolderCardProps = {
	folder: Folder;
};

export function FolderCard({ folder }: FolderCardProps) {
	const colors = FOLDER_CLASSES[folder.color];

	return (
		<Link
			to="/my-folders/{-$folderId}"
			params={{ folderId: folder.id }}
			className={cn(
				"block group bg-card rounded-xl shadow-md transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-lg cursor-pointer focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none",
				colors.glow,
			)}
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
				<div className="text-sm font-semibold">{folder.name}</div>
				<div className="text-xs font-medium text-quaternary-foreground">
					{folder.imageCount}
				</div>
			</div>
		</Link>
	);
}

import { Folder01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { FOLDER_CLASSES, type FolderColor } from "@/lib/folders/constants";
import { cn } from "@/lib/utils";

interface SharedFolder {
	id: string;
	name: string;
	color: FolderColor;
	emoji: string | null;
	imageCount?: number;
}

interface SharedBy {
	id: string;
	name: string | null;
}

interface SharedFolderCardProps {
	folder: SharedFolder;
	sharedBy: SharedBy;
}

export function SharedFolderCard({ folder, sharedBy }: SharedFolderCardProps) {
	const colors = FOLDER_CLASSES[folder.color];

	return (
		<div
			className={cn(
				"group relative bg-card rounded-xl shadow-md transition-[scale,box-shadow] duration-200 ease-out hover:scale-[1.02] hover:shadow-lg",
				colors.glow,
			)}
		>
			<Link
				to="/shared-folders/$folderId"
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
				<div className="m-2">
					<div className="flex justify-between items-center">
						<div className="text-sm font-semibold truncate pr-2">
							{folder.name}
						</div>
						{folder.imageCount !== undefined && (
							<div className="text-xs font-medium text-quaternary-foreground">
								{folder.imageCount}
							</div>
						)}
					</div>
					<div className="text-xs text-muted-foreground truncate">
						Shared by @{sharedBy.name ?? "Unknown"}
					</div>
				</div>
			</Link>
		</div>
	);
}

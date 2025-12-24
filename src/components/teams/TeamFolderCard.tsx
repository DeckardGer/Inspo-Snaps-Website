import { Folder01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { FOLDER_CLASSES } from "@/lib/folders/constants";
import type { TeamFolder } from "@/lib/folders/functions";
import { cn } from "@/lib/utils";

type TeamFolderCardProps = {
	folder: TeamFolder;
	orgId: string;
};

export function TeamFolderCard({ folder, orgId }: TeamFolderCardProps) {
	const colors = FOLDER_CLASSES[folder.color];

	return (
		<div
			className={cn(
				"group relative bg-card rounded-xl shadow-md transition-[scale,box-shadow] duration-200 ease-out hover:scale-[1.02] hover:shadow-lg",
				colors.glow,
			)}
		>
			<Link
				to="/team-folders/$orgId/{-$folderId}"
				params={{ orgId, folderId: folder.id }}
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
		</div>
	);
}

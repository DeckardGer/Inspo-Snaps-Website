import { Folder01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FOLDER_CLASSES } from "@/lib/folders/constants";
import type { TeamFolder } from "@/lib/folders/functions";
import { cn } from "@/lib/utils";
import { TeamFolderActionsMenu } from "./TeamFolderActionsMenu";

type TeamFolderCardProps = {
	folder: TeamFolder;
	orgId: string;
	organizationId: string;
};

export function TeamFolderCard({
	folder,
	orgId,
	organizationId,
}: TeamFolderCardProps) {
	const [menuOpen, setMenuOpen] = useState(false);
	const colors = FOLDER_CLASSES[folder.color];

	return (
		<div
			data-menu-open={menuOpen || undefined}
			className={cn(
				"group relative bg-card rounded-xl shadow-md transition-[scale,box-shadow] duration-200 ease-out hover:scale-[1.02] hover:shadow-lg data-[menu-open]:scale-[1.02] data-[menu-open]:shadow-lg",
				colors.glow,
			)}
		>
			{/* Menu button - positioned absolutely */}
			<TeamFolderActionsMenu
				folder={folder}
				organizationId={organizationId}
				onOpenChange={setMenuOpen}
				trigger={
					<Button
						size="icon-sm"
						variant="secondary"
						className="absolute top-2 right-2 z-10 shadow-lg hover:bg-tertiary opacity-0 group-hover:opacity-100 group-data-[menu-open]:opacity-100 transition-[opacity,background-color] focus-visible:opacity-100"
					/>
				}
			/>

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

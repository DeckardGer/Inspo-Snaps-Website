import { Folder01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FOLDER_CLASSES, type FolderColor } from "@/lib/folders/constants";
import { cn } from "@/lib/utils";

export interface BaseFolderCardFolder {
	name: string;
	color: FolderColor;
	emoji: string | null;
	imageCount?: number;
}

export interface BaseFolderCardProps {
	/** Core folder display data */
	folder: BaseFolderCardFolder;
	/** Link destination */
	linkTo: string;
	/** Link params (optional) */
	linkParams?: Record<string, string | undefined>;
	/** Actions menu render prop - receives trigger button and onOpenChange */
	actionsMenu?: (props: {
		trigger: React.ReactElement;
		onOpenChange: (open: boolean) => void;
	}) => React.ReactNode;
	/** Optional subtitle below folder name (e.g., "Shared by @user") */
	subtitle?: React.ReactNode;
	/** Additional class names */
	className?: string;
}

export function BaseFolderCard({
	folder,
	linkTo,
	linkParams,
	actionsMenu,
	subtitle,
	className,
}: BaseFolderCardProps) {
	const [menuOpen, setMenuOpen] = useState(false);
	const colors = FOLDER_CLASSES[folder.color];

	const menuTrigger = (
		<Button
			size="icon-sm"
			variant="secondary"
			className="absolute top-2 right-2 z-10 shadow-lg hover:bg-tertiary opacity-0 group-hover:opacity-100 group-data-[menu-open]:opacity-100 transition-[opacity,background-color] focus-visible:opacity-100"
		/>
	);

	return (
		<div
			data-menu-open={menuOpen || undefined}
			className={cn(
				"group relative bg-card rounded-xl shadow-md transition-[scale,box-shadow] duration-200 ease-out hover:scale-[1.02] hover:shadow-lg data-[menu-open]:scale-[1.02] data-[menu-open]:shadow-lg",
				colors.glow,
				className,
			)}
		>
			{/* Actions menu - positioned absolutely */}
			{actionsMenu?.({ trigger: menuTrigger, onOpenChange: setMenuOpen })}

			{/* Card link - covers the entire card */}
			<Link
				to={linkTo}
				params={linkParams}
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
					{subtitle && (
						<div className="text-xs text-muted-foreground truncate">
							{subtitle}
						</div>
					)}
				</div>
			</Link>
		</div>
	);
}

import { Folder01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { FOLDER_ICON_CLASSES, type FolderColor } from "@/lib/folders/constants";
import { cn } from "@/lib/utils";

type FolderIconProps = {
	color?: FolderColor | null;
	emoji?: string | null;
	size?: "sm" | "md" | "lg";
	className?: string;
};

const sizeClasses = {
	sm: {
		container: "size-8",
		icon: "size-4",
		emoji: "text-base",
	},
	md: {
		container: "size-10",
		icon: "size-5",
		emoji: "text-lg",
	},
	lg: {
		container: "size-12",
		icon: "size-6",
		emoji: "text-xl",
	},
};

export function FolderIcon({
	color = "indigo",
	emoji,
	size = "md",
	className,
}: FolderIconProps) {
	const folderColor: FolderColor = color || "indigo";
	const colorClass = FOLDER_ICON_CLASSES[folderColor];
	const sizeClass = sizeClasses[size];

	return (
		<div
			className={cn(
				"flex items-center justify-center rounded-md",
				sizeClass.container,
				colorClass,
				className,
			)}
		>
			{emoji ? (
				<span className={sizeClass.emoji}>{emoji}</span>
			) : (
				<HugeiconsIcon icon={Folder01Icon} className={sizeClass.icon} />
			)}
		</div>
	);
}

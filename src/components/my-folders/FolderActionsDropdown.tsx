import {
	Delete02Icon,
	FolderOpenIcon,
	MoreVerticalIcon,
	Motorbike02Icon,
	PencilIcon,
	Share01Icon,
	StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Folder } from "@/lib/folders/functions";

type FolderActionsDropdownProps = {
	folder: Folder;
	isFavourited?: boolean;
	onOpen?: () => void;
	onRename?: () => void;
	onShare?: () => void;
	onToggleFavourite?: () => void;
	onMove?: () => void;
	onDelete?: () => void;
};

export function FolderActionsDropdown({
	folder,
	isFavourited = false,
	onOpen,
	onRename,
	onShare,
	onToggleFavourite,
	onMove,
	onDelete,
}: FolderActionsDropdownProps) {
	const [isOpen, setIsOpen] = useState(false);

	// folder will be used when implementing action handlers
	void folder;

	return (
		<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuTrigger asChild>
				<Button size="icon-sm" variant="ghost">
					<HugeiconsIcon icon={MoreVerticalIcon} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48">
				<DropdownMenuItem
					onClick={() => {
						setIsOpen(false);
						onOpen?.();
					}}
				>
					<HugeiconsIcon icon={FolderOpenIcon} />
					Open
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						setIsOpen(false);
						onRename?.();
					}}
				>
					<HugeiconsIcon icon={PencilIcon} />
					Rename
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						setIsOpen(false);
						onShare?.();
					}}
				>
					<HugeiconsIcon icon={Share01Icon} />
					Share
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						setIsOpen(false);
						onToggleFavourite?.();
					}}
				>
					<HugeiconsIcon icon={StarIcon} />
					{isFavourited ? "Remove from" : "Add to"} Favourites
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						setIsOpen(false);
						onMove?.();
					}}
				>
					<HugeiconsIcon icon={Motorbike02Icon} />
					Move to...
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					variant="destructive"
					onClick={() => {
						setIsOpen(false);
						onDelete?.();
					}}
				>
					<HugeiconsIcon icon={Delete02Icon} />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

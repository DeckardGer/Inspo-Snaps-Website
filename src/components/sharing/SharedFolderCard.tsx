import { BaseFolderCard } from "@/components/folders/BaseFolderCard";
import type { FolderColor } from "@/lib/folders/constants";
import { SharedFolderActionsMenu } from "./SharedFolderActionsMenu";

interface SharedFolder {
	id: string;
	name: string;
	color: FolderColor;
	emoji: string | null;
	imageCount?: number;
	isFavourited?: boolean;
}

interface SharedBy {
	id: string;
	name: string | null;
}

interface SharedFolderCardProps {
	folder: SharedFolder;
	sharedBy: SharedBy;
	showRemoveFromShared?: boolean;
}

export function SharedFolderCard({
	folder,
	sharedBy,
	showRemoveFromShared = true,
}: SharedFolderCardProps) {
	return (
		<BaseFolderCard
			folder={folder}
			linkTo="/shared-folders/$folderId"
			linkParams={{ folderId: folder.id }}
			subtitle={`Shared by @${sharedBy.name ?? "Unknown"}`}
			actionsMenu={({ trigger, onOpenChange }) => (
				<SharedFolderActionsMenu
					folder={{
						id: folder.id,
						name: folder.name,
						color: folder.color,
						emoji: folder.emoji,
						isFavourited: folder.isFavourited ?? false,
					}}
					showRemoveFromShared={showRemoveFromShared}
					onOpenChange={onOpenChange}
					trigger={trigger}
				/>
			)}
		/>
	);
}

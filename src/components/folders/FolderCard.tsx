import type { Folder } from "@/lib/folders/functions";
import { BaseFolderCard } from "./BaseFolderCard";
import { FolderActionsMenu } from "./FolderActionsMenu";

type FolderCardProps = {
	folder: Folder;
	readOnly?: boolean;
	linkPrefix?: string;
};

export function FolderCard({ folder, readOnly, linkPrefix }: FolderCardProps) {
	// Build the link path - use linkPrefix if provided, otherwise default to my-folders
	const linkTo = linkPrefix
		? `${linkPrefix}/${folder.id}`
		: "/my-folders/{-$folderId}";

	return (
		<BaseFolderCard
			folder={folder}
			linkTo={linkTo}
			linkParams={linkPrefix ? undefined : { folderId: folder.id }}
			actionsMenu={
				readOnly
					? undefined
					: ({ trigger, onOpenChange }) => (
							<FolderActionsMenu
								folder={folder}
								onOpenChange={onOpenChange}
								trigger={trigger}
							/>
						)
			}
		/>
	);
}

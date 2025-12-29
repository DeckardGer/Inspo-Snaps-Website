import { BaseFolderCard } from "@/components/folders/BaseFolderCard";
import type { TeamFolder } from "@/lib/folders/functions";
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
	return (
		<BaseFolderCard
			folder={folder}
			linkTo="/team-folders/$orgId/{-$folderId}"
			linkParams={{ orgId, folderId: folder.id }}
			actionsMenu={({ trigger, onOpenChange }) => (
				<TeamFolderActionsMenu
					folder={folder}
					organizationId={organizationId}
					onOpenChange={onOpenChange}
					trigger={trigger}
				/>
			)}
		/>
	);
}

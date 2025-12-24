import type { TeamFolder } from "@/lib/folders/functions";
import { TeamFolderCard } from "./TeamFolderCard";

type TeamFolderGridProps = {
	folders: TeamFolder[];
	orgId: string;
};

export function TeamFolderGrid({ folders, orgId }: TeamFolderGridProps) {
	return (
		<div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
			{folders.map((folder) => (
				<TeamFolderCard key={folder.id} folder={folder} orgId={orgId} />
			))}
		</div>
	);
}

import type { Folder } from "@/lib/folders/functions";
import { FolderCard } from "./FolderCard";

type FolderGridProps = {
	folders: Folder[];
	readOnly?: boolean;
	linkPrefix?: string;
};

export function FolderGrid({ folders, readOnly, linkPrefix }: FolderGridProps) {
	return (
		<div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
			{folders.map((folder) => (
				<FolderCard
					key={folder.id}
					folder={folder}
					readOnly={readOnly}
					linkPrefix={linkPrefix}
				/>
			))}
		</div>
	);
}

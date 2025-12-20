import type { Folder } from "@/lib/folders/functions";
import { FolderCard } from "./FolderCard";

type FolderGridProps = {
	folders: Folder[];
	favouritedFolderIds?: Set<string>;
};

export function FolderGrid({ folders, favouritedFolderIds }: FolderGridProps) {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{folders.map((folder) => (
				<FolderCard
					key={folder.id}
					folder={folder}
					isFavourited={favouritedFolderIds?.has(folder.id)}
				/>
			))}
		</div>
	);
}

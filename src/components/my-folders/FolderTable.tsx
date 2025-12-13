import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { FolderWithStats } from "@/lib/folders/functions";
import { FolderTableRow } from "./FolderTableRow";

type FolderTableProps = {
	folders: FolderWithStats[];
	favouritedFolderIds?: Set<string>;
};

export function FolderTable({
	folders,
	favouritedFolderIds,
}: FolderTableProps) {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Folder</TableHead>
						<TableHead>Date Created</TableHead>
						<TableHead>Last Updated</TableHead>
						<TableHead>Images</TableHead>
						<TableHead>Visibility</TableHead>
						<TableHead className="w-[50px]">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{folders.map((folder) => (
						<FolderTableRow
							key={folder.id}
							folder={folder}
							isFavourited={favouritedFolderIds?.has(folder.id)}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

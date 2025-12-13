import { format } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import type { FolderWithStats } from "@/lib/folders/functions";
import { FolderActionsDropdown } from "./FolderActionsDropdown";
import { FolderIcon } from "./FolderIcon";

type FolderTableRowProps = {
	folder: FolderWithStats;
	isFavourited?: boolean;
};

export function FolderTableRow({ folder, isFavourited }: FolderTableRowProps) {
	return (
		<TableRow className="group cursor-pointer">
			<TableCell>
				<div className="flex items-center gap-3">
					<FolderIcon color={folder.color} emoji={folder.emoji} size="sm" />
					<span className="font-medium">{folder.name}</span>
				</div>
			</TableCell>
			<TableCell>{format(folder.createdAt, "MMM d, yyyy")}</TableCell>
			<TableCell>{format(folder.updatedAt, "MMM d, yyyy")}</TableCell>
			<TableCell>
				<div className="inline-flex items-center justify-center rounded-full bg-bg-secondary px-2 py-1 text-xs font-medium">
					{folder.totalImageCount}
				</div>
			</TableCell>
			<TableCell>
				<div
					className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium ${
						folder.isShared
							? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
							: "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300"
					}`}
				>
					{folder.isShared ? "Shared" : "Private"}
				</div>
			</TableCell>
			<TableCell>
				<FolderActionsDropdown folder={folder} isFavourited={isFavourited} />
			</TableCell>
		</TableRow>
	);
}

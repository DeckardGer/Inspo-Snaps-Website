import { Card, CardContent } from "@/components/ui/card";
import type { FolderWithStats } from "@/lib/folders/functions";
import { FolderActionsDropdown } from "./FolderActionsDropdown";
import { FolderIcon } from "./FolderIcon";

type FolderCardProps = {
	folder: FolderWithStats;
	isFavourited?: boolean;
};

export function FolderCard({ folder, isFavourited }: FolderCardProps) {
	return (
		<Card className="group relative cursor-pointer transition-colors hover:border">
			<CardContent className="flex flex-col items-center gap-2 p-6">
				<FolderIcon color={folder.color} emoji={folder.emoji} size="lg" />
				<h3 className="text-center text-sm font-medium line-clamp-2">
					{folder.name}
				</h3>
				{folder.totalImageCount > 0 && (
					<span className="text-xs text-secondary-foreground">
						{folder.totalImageCount}{" "}
						{folder.totalImageCount === 1 ? "image" : "images"}
					</span>
				)}
			</CardContent>
			<div className="absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
				<FolderActionsDropdown folder={folder} isFavourited={isFavourited} />
			</div>
		</Card>
	);
}

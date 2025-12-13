import { FolderAddIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";

type FoldersEmptyStateProps = {
	hasSearch: boolean;
	onCreateFolder?: () => void;
};

export function FoldersEmptyState({
	hasSearch,
	onCreateFolder,
}: FoldersEmptyStateProps) {
	if (hasSearch) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 py-16">
				<div className="flex size-16 items-center justify-center rounded-full bg-bg-secondary">
					<HugeiconsIcon
						icon={Search01Icon}
						className="size-8 text-text-quaternary"
					/>
				</div>
				<div className="text-center">
					<h3 className="text-lg font-semibold">No folders found</h3>
					<p className="text-sm text-text-tertiary">
						Try adjusting your search or filters
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center gap-4 py-16">
			<div className="flex size-16 items-center justify-center rounded-full bg-bg-secondary">
				<HugeiconsIcon
					icon={FolderAddIcon}
					className="size-8 text-text-quaternary"
				/>
			</div>
			<div className="text-center">
				<h3 className="text-lg font-semibold">No folders yet</h3>
				<p className="text-sm text-text-tertiary">
					Create your first folder to organize your images
				</p>
			</div>
			<Button onClick={onCreateFolder}>
				<HugeiconsIcon icon={FolderAddIcon} />
				Create Folder
			</Button>
		</div>
	);
}

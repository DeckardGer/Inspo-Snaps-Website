import { Share08Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function SharedFolderEmptyState() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
			<div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
				<HugeiconsIcon
					icon={Share08Icon}
					className="size-8 text-muted-foreground"
				/>
			</div>
			<div>
				<h3 className="text-lg font-semibold">This folder is empty</h3>
				<p className="text-sm text-muted-foreground">
					No folders or images in this shared folder yet.
				</p>
			</div>
		</div>
	);
}

import { Share08Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function SharedFolderError() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
			<div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
				<HugeiconsIcon icon={Share08Icon} className="size-8 text-destructive" />
			</div>
			<div>
				<h3 className="text-lg font-semibold">Access Denied</h3>
				<p className="text-sm text-muted-foreground">
					You don't have access to this folder, or it doesn't exist.
				</p>
			</div>
		</div>
	);
}

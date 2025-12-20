import { FolderAddIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { FolderIcon } from "./FolderIcon";

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
			<div className="flex flex-col items-center justify-center gap-6 py-20">
				<div className="relative">
					{/* Decorative ring */}
					<div className="absolute -inset-4 rounded-full border border-dashed border-muted-foreground/20" />
					<div className="absolute -inset-8 rounded-full border border-dashed border-muted-foreground/10" />

					<div className="relative flex size-20 items-center justify-center rounded-full bg-muted/50">
						<HugeiconsIcon
							icon={Search01Icon}
							className="size-8 text-muted-foreground"
						/>
					</div>
				</div>

				<div className="text-center">
					<h3 className="text-xl font-semibold tracking-tight">
						No folders found
					</h3>
					<p className="mt-2 max-w-sm text-sm text-muted-foreground">
						We couldn't find any folders matching your search. Try adjusting
						your filters or search terms.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center gap-8 py-20">
			{/* Floating folders illustration */}
			<div className="relative flex h-32 w-64 items-center justify-center">
				{/* Background glow */}
				<div className="absolute size-32 rounded-full bg-primary/5 blur-2xl" />

				{/* Floating folder icons - positioned with wrapper, animated inside */}
				<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
					<div
						className="animate-[float_3s_ease-in-out_infinite]"
						style={{ animationDelay: "0s" }}
					>
						<FolderIcon color="indigo" size="lg" className="shadow-lg" />
					</div>
				</div>

				<div className="absolute left-[15%] top-[20%]">
					<div
						className="animate-[float_3s_ease-in-out_infinite] opacity-60"
						style={{ animationDelay: "-1s" }}
					>
						<FolderIcon color="violet" size="md" className="shadow-md" />
					</div>
				</div>

				<div className="absolute right-[15%] top-[30%]">
					<div
						className="animate-[float_3s_ease-in-out_infinite] opacity-60"
						style={{ animationDelay: "-2s" }}
					>
						<FolderIcon color="rose" size="md" className="shadow-md" />
					</div>
				</div>

				<div className="absolute bottom-[10%] left-[25%]">
					<div
						className="animate-[float_3s_ease-in-out_infinite] opacity-40"
						style={{ animationDelay: "-0.5s" }}
					>
						<FolderIcon color="sky" size="sm" className="shadow-sm" />
					</div>
				</div>

				<div className="absolute bottom-[15%] right-[20%]">
					<div
						className="animate-[float_3s_ease-in-out_infinite] opacity-40"
						style={{ animationDelay: "-1.5s" }}
					>
						<FolderIcon color="emerald" size="sm" className="shadow-sm" />
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="text-center">
				<h3 className="text-xl font-semibold tracking-tight">
					Create your first folder
				</h3>
				<p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
					Organize your inspiration into folders. Group images by project,
					theme, mood, or however you like.
				</p>
			</div>

			{/* CTA */}
			<Button onClick={onCreateFolder} size="lg" className="gap-2">
				<HugeiconsIcon icon={FolderAddIcon} className="size-5" />
				Create Folder
			</Button>
		</div>
	);
}

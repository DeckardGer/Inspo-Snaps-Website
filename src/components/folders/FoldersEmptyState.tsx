import { FolderAddIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { FolderIcon } from "./FolderIcon";
import { FolderModal } from "./FolderModal";

export function FoldersEmptyState() {
	return (
		<div className="flex flex-col items-center justify-center gap-8 py-20">
			{/* Floating folders illustration */}
			<div className="relative flex h-32 w-64 items-center justify-center">
				{/* Background glow */}
				<div className="absolute size-32 rounded-full bg-primary/20 blur-2xl" />

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
						<FolderIcon color="purple" size="md" className="shadow-md" />
					</div>
				</div>

				<div className="absolute right-[15%] top-[26%]">
					<div
						className="animate-[float_3s_ease-in-out_infinite] opacity-60"
						style={{ animationDelay: "-1.8s" }}
					>
						<FolderIcon color="rose" size="md" className="shadow-md" />
					</div>
				</div>

				<div className="absolute bottom-[10%] left-[25%]">
					<div
						className="animate-[float_3s_ease-in-out_infinite] opacity-40"
						style={{ animationDelay: "-0.5s" }}
					>
						<FolderIcon color="yellow" size="sm" className="shadow-sm" />
					</div>
				</div>

				<div className="absolute bottom-[12%] right-[20%]">
					<div
						className="animate-[float_3s_ease-in-out_infinite] opacity-40"
						style={{ animationDelay: "-1.5s" }}
					>
						<FolderIcon color="green" size="sm" className="shadow-sm" />
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
			<FolderModal
				trigger={
					<Button size="lg" className="gap-2">
						<HugeiconsIcon icon={FolderAddIcon} className="size-5" />
						Create Folder
					</Button>
				}
			/>
		</div>
	);
}

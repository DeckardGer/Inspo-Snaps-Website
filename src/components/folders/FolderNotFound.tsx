import { Folder01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	DriftingIcon,
	ErrorIllustrationContainer,
	ErrorState,
} from "@/components/ui/error-state";

function FolderNotFoundIllustration() {
	return (
		<ErrorIllustrationContainer glowColor="bg-muted/40">
			{/* Center folder with question mark overlay */}
			<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
				<div className="animate-[pulse_3s_ease-in-out_infinite] opacity-80">
					<div className="relative flex size-14 items-center justify-center rounded-xl bg-muted shadow-lg">
						<HugeiconsIcon
							icon={Folder01Icon}
							className="size-7 text-muted-foreground/60"
						/>
						<div className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-muted-foreground/20 text-xs font-bold text-muted-foreground">
							?
						</div>
					</div>
				</div>
			</div>

			{/* Drifting folder fragments */}
			<DriftingIcon
				icon={Folder01Icon}
				position={{ left: "10%", top: "15%" }}
				delay="0s"
				opacity={0.3}
				containerSize="size-8"
				iconSize="size-4"
				bgColor="bg-muted/60"
			/>

			<DriftingIcon
				icon={Folder01Icon}
				position={{ right: "12%", top: "20%" }}
				delay="-1.5s"
				opacity={0.25}
				rotation="rotate-12"
				containerSize="size-7"
				iconSize="size-3.5"
				bgColor="bg-muted/50"
			/>

			<DriftingIcon
				icon={Folder01Icon}
				position={{ bottom: "15%", left: "20%" }}
				delay="-0.8s"
				opacity={0.2}
				rotation="-rotate-6"
				containerSize="size-6"
				iconSize="size-3"
				bgColor="bg-muted/40"
			/>

			<DriftingIcon
				icon={Folder01Icon}
				position={{ bottom: "18%", right: "18%" }}
				delay="-2.2s"
				opacity={0.2}
				rotation="rotate-3"
				containerSize="size-6"
				iconSize="size-3"
				bgColor="bg-muted/40"
			/>
		</ErrorIllustrationContainer>
	);
}

export function FolderNotFound() {
	return (
		<ErrorState
			illustration={<FolderNotFoundIllustration />}
			title="Folder not found"
			description="This folder doesn't exist or you don't have permission to view it."
			backLink="/my-folders/{-$folderId}"
			backLabel="Back to My Folders"
		/>
	);
}

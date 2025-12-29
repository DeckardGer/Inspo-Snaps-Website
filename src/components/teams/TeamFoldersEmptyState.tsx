import { FolderAddIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { FolderIcon } from "@/components/folders/FolderIcon";
import { Button } from "@/components/ui/button";
import {
	EmptyState,
	FloatingIcon,
	IllustrationContainer,
} from "@/components/ui/empty-state";
import { ImageDropPlaceholder } from "@/components/upload/ImageDropPlaceholder";
import { TeamFolderModal } from "./TeamFolderModal";

interface TeamFoldersEmptyStateProps {
	organizationId: string;
	parentId?: string;
	onFilesDropped?: (files: File[]) => void;
}

function TeamFoldersIllustration() {
	return (
		<IllustrationContainer>
			{/* Center folder icon */}
			<FloatingIcon
				position={{ left: "50%", top: "50%" }}
				className="-translate-x-1/2 -translate-y-1/2"
			>
				<FolderIcon color="indigo" size="lg" className="shadow-lg" />
			</FloatingIcon>

			{/* Floating secondary folder icons */}
			<FloatingIcon
				position={{ left: "15%", top: "20%" }}
				delay="-1s"
				opacity={0.6}
			>
				<FolderIcon color="purple" size="md" className="shadow-md" />
			</FloatingIcon>

			<FloatingIcon
				position={{ right: "15%", top: "26%" }}
				delay="-1.8s"
				opacity={0.6}
			>
				<FolderIcon color="red" size="md" className="shadow-md" />
			</FloatingIcon>

			<FloatingIcon
				position={{ bottom: "10%", left: "25%" }}
				delay="-0.5s"
				opacity={0.4}
			>
				<FolderIcon color="yellow" size="sm" className="shadow-sm" />
			</FloatingIcon>

			<FloatingIcon
				position={{ bottom: "12%", right: "20%" }}
				delay="-1.5s"
				opacity={0.4}
			>
				<FolderIcon color="green" size="sm" className="shadow-sm" />
			</FloatingIcon>
		</IllustrationContainer>
	);
}

export function TeamFoldersEmptyState({
	organizationId,
	parentId,
	onFilesDropped,
}: TeamFoldersEmptyStateProps) {
	const isNested = !!parentId;

	return (
		<EmptyState
			illustration={<TeamFoldersIllustration />}
			title={isNested ? "This folder is empty" : "Create your first folder"}
			description={
				isNested
					? "Add images or create subfolders to organize your content."
					: "Organize your team's inspiration into folders. Everyone in the team can access and contribute."
			}
			actions={
				<>
					{isNested && onFilesDropped && (
						<ImageDropPlaceholder onFilesDropped={onFilesDropped} />
					)}
					<TeamFolderModal
						organizationId={organizationId}
						parentId={parentId}
						trigger={
							<Button size="lg" className="gap-2">
								<HugeiconsIcon icon={FolderAddIcon} className="size-5" />
								{isNested ? "Create Subfolder" : "Create Folder"}
							</Button>
						}
					/>
				</>
			}
		/>
	);
}

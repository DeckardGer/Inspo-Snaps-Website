import { CloudUploadIcon, ImageAdd02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { validateFile } from "@/hooks/use-image-upload";
import { useTeamImageUpload } from "@/hooks/use-team-image-upload";
import { cn } from "@/lib/utils";

interface TeamUploadButtonProps {
	organizationId: string;
	folderId: string;
}

export function TeamUploadButton({
	organizationId,
	folderId,
}: TeamUploadButtonProps) {
	const [isDragOver, setIsDragOver] = useState(false);
	const dragCounter = useRef(0);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { uploadFiles, isUploading } = useTeamImageUpload(
		organizationId,
		folderId,
	);

	const handleClick = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	const handleFileSelect = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const files = Array.from(e.target.files || []).filter((file) => {
				const validation = validateFile(file);
				return validation.valid;
			});

			if (files.length > 0) {
				uploadFiles(files);
			}

			// Reset input so the same file can be selected again
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		},
		[uploadFiles],
	);

	const handleDragEnter = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		dragCounter.current++;

		if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
			const hasValidImages = Array.from(e.dataTransfer.items).some(
				(item) =>
					item.kind === "file" &&
					["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
						item.type,
					),
			);
			if (hasValidImages) {
				setIsDragOver(true);
			}
		}
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		dragCounter.current--;

		if (dragCounter.current === 0) {
			setIsDragOver(false);
		}
	}, []);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			dragCounter.current = 0;
			setIsDragOver(false);

			const files = Array.from(e.dataTransfer.files).filter((file) => {
				const validation = validateFile(file);
				return validation.valid;
			});

			if (files.length > 0) {
				uploadFiles(files);
			}
		},
		[uploadFiles],
	);

	return (
		<>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/jpeg,image/png,image/gif,image/webp"
				multiple
				onChange={handleFileSelect}
				className="sr-only"
				tabIndex={-1}
				aria-label="Upload images"
			/>
			<Button
				variant="outline"
				onClick={handleClick}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				disabled={isUploading}
				className={cn(
					"transition-all duration-200",
					isDragOver &&
						"ring-2 ring-primary ring-offset-2 bg-primary/10 border-primary scale-105",
				)}
			>
				<HugeiconsIcon
					icon={isDragOver ? CloudUploadIcon : ImageAdd02Icon}
					data-icon="inline-start"
				/>
				{isUploading ? "Uploading..." : isDragOver ? "Drop here" : "Add Images"}
			</Button>
		</>
	);
}

import { CloudUploadIcon, ImageAdd02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useRef, useState } from "react";
import { useImageUpload, validateFile } from "@/hooks/use-image-upload";
import { cn } from "@/lib/utils";
import { UploadProgress } from "./UploadProgress";

interface DropZoneProps {
	folderId: string;
	className?: string;
}

type DragState = "idle" | "valid" | "invalid";

export function DropZone({ folderId, className }: DropZoneProps) {
	const [dragState, setDragState] = useState<DragState>("idle");
	const dragCounter = useRef(0);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { uploads, uploadFiles, clearCompleted, isUploading } =
		useImageUpload(folderId);

	const handleDragEnter = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		dragCounter.current++;

		if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
			// Check if any files are valid images
			const hasValidImages = Array.from(e.dataTransfer.items).some(
				(item) =>
					item.kind === "file" &&
					["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
						item.type,
					),
			);
			setDragState(hasValidImages ? "valid" : "invalid");
		}
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		dragCounter.current--;

		if (dragCounter.current === 0) {
			setDragState("idle");
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
			setDragState("idle");

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

	const handleClick = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	const hasActiveUploads = uploads.length > 0;

	return (
		<div className={cn("space-y-4", className)}>
			{/* Drop Zone */}
			<button
				type="button"
				tabIndex={0}
				onClick={handleClick}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						handleClick();
					}
				}}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				className={cn(
					"relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-all duration-200 cursor-pointer w-full",
					"hover:border-primary/50 hover:bg-primary/5",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
					dragState === "idle" && "border-muted-foreground/30 bg-muted/30",
					dragState === "valid" &&
						"border-primary bg-primary/10 scale-[1.01] shadow-lg",
					dragState === "invalid" && "border-destructive bg-destructive/10",
				)}
			>
				<input
					ref={fileInputRef}
					type="file"
					accept="image/jpeg,image/png,image/gif,image/webp"
					multiple
					onChange={handleFileSelect}
					className="sr-only"
					aria-label="Upload images"
				/>

				<div
					className={cn(
						"flex h-14 w-14 items-center justify-center rounded-full transition-colors",
						dragState === "idle" && "bg-muted text-muted-foreground",
						dragState === "valid" && "bg-primary/20 text-primary",
						dragState === "invalid" && "bg-destructive/20 text-destructive",
					)}
				>
					<HugeiconsIcon
						icon={dragState === "valid" ? CloudUploadIcon : ImageAdd02Icon}
						className="size-7"
						strokeWidth={1.5}
					/>
				</div>

				<div className="text-center">
					<p
						className={cn(
							"text-sm font-medium",
							dragState === "valid" && "text-primary",
							dragState === "invalid" && "text-destructive",
						)}
					>
						{dragState === "valid"
							? "Drop to upload"
							: dragState === "invalid"
								? "Only image files allowed"
								: "Drop images here or click to upload"}
					</p>
					<p className="mt-1 text-xs text-muted-foreground">
						JPG, PNG, GIF, WebP up to 10MB
					</p>
				</div>
			</button>

			{/* Upload Progress */}
			{hasActiveUploads && (
				<UploadProgress
					uploads={uploads}
					onClearCompleted={clearCompleted}
					isUploading={isUploading}
				/>
			)}
		</div>
	);
}

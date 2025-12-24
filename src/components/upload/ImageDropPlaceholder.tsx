import { CloudUploadIcon, ImageAdd02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useRef, useState } from "react";
import { validateFile } from "@/hooks/use-image-upload";
import { cn } from "@/lib/utils";

interface ImageDropPlaceholderProps {
	onFilesDropped: (files: File[]) => void;
	className?: string;
}

export function ImageDropPlaceholder({
	onFilesDropped,
	className,
}: ImageDropPlaceholderProps) {
	const [isDragOver, setIsDragOver] = useState(false);
	const dragCounter = useRef(0);
	const fileInputRef = useRef<HTMLInputElement>(null);

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
				onFilesDropped(files);
			}

			// Reset input so the same file can be selected again
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		},
		[onFilesDropped],
	);

	const handleDragEnter = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		dragCounter.current++;
		setIsDragOver(true);
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
				onFilesDropped(files);
			}
		},
		[onFilesDropped],
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
			<button
				type="button"
				onClick={handleClick}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				className={cn(
					"relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed h-32 transition-all duration-200 cursor-pointer w-full",
					"hover:border-primary/50 hover:bg-primary/5",
					"focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
					isDragOver
						? "border-primary bg-primary/10 scale-[1.02]"
						: "border-muted-foreground/30 bg-muted/30 hover:border-muted-foreground/50 hover:bg-muted/50",
					className,
				)}
			>
				<div
					className={cn(
						"flex h-10 w-10 items-center justify-center rounded-full transition-colors",
						isDragOver
							? "bg-primary/20 text-primary"
							: "bg-muted text-muted-foreground",
					)}
				>
					<HugeiconsIcon
						icon={isDragOver ? CloudUploadIcon : ImageAdd02Icon}
						className="size-5"
						strokeWidth={1.5}
					/>
				</div>
				<p
					className={cn(
						"text-xs font-medium transition-colors",
						isDragOver ? "text-primary" : "text-muted-foreground",
					)}
				>
					{isDragOver ? "Drop to upload" : "Drop images here"}
				</p>
			</button>
		</>
	);
}

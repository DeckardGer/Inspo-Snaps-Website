import { ImageDropPlaceholder } from "@/components/upload/ImageDropPlaceholder";
import { type Image, ImageCard } from "./ImageCard";

interface FolderImageGridProps {
	images: Image[];
	folderId: string;
	readOnly?: boolean;
	onFilesDropped?: (files: File[]) => void;
}

export function ImageGrid({
	images,
	folderId,
	readOnly,
	onFilesDropped,
}: FolderImageGridProps) {
	return (
		<div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
			{onFilesDropped && (
				<ImageDropPlaceholder onFilesDropped={onFilesDropped} />
			)}
			{images.map((image) => (
				<ImageCard
					key={image.id}
					image={image}
					folderId={folderId}
					readOnly={readOnly}
				/>
			))}
		</div>
	);
}

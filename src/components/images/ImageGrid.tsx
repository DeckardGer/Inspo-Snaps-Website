import { type Image, ImageCard } from "./ImageCard";

interface FolderImageGridProps {
	images: Image[];
	folderId: string;
	readOnly?: boolean;
}

export function ImageGrid({ images, folderId, readOnly }: FolderImageGridProps) {
	return (
		<div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
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

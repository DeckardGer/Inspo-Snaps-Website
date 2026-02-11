import { useCallback, useRef, useState } from "react";
import { ImageDropPlaceholder } from "@/components/upload/ImageDropPlaceholder";
import { type Image, ImageCard } from "./ImageCard";
import { ImageLightbox, type LightboxImage } from "./ImageLightbox";

interface FolderImageGridProps {
	images: Image[];
	folderId: string;
	organizationId?: string;
	readOnly?: boolean;
	onFilesDropped?: (files: File[]) => void;
}

export function ImageGrid({
	images,
	folderId,
	organizationId,
	readOnly,
	onFilesDropped,
}: FolderImageGridProps) {
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [originRect, setOriginRect] = useState<DOMRect | null>(null);
	const cardRefsMap = useRef<Map<number, HTMLDivElement>>(new Map());

	const registerCardRef = useCallback(
		(index: number, element: HTMLDivElement | null) => {
			if (element) {
				cardRefsMap.current.set(index, element);
			} else {
				cardRefsMap.current.delete(index);
			}
		},
		[],
	);

	const handleOpenLightbox = useCallback(
		(index: number, rect: DOMRect | null) => {
			setOriginRect(rect);
			setCurrentIndex(index);
			setLightboxOpen(true);
		},
		[],
	);

	const handleCloseLightbox = useCallback(() => {
		// Get the current image's card position for the close animation
		const currentCard = cardRefsMap.current.get(currentIndex);
		if (currentCard) {
			setOriginRect(currentCard.getBoundingClientRect());
		}
		setLightboxOpen(false);
	}, [currentIndex]);

	const handleNavigate = useCallback((index: number) => {
		setCurrentIndex(index);
	}, []);

	// Convert images to lightbox format
	const lightboxImages: LightboxImage[] = images.map((img) => ({
		id: img.id,
		src: img.imageUrl,
		alt: img.filename,
		addedAt: img.addedAt,
	}));

	return (
		<>
			<div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
				{onFilesDropped && (
					<ImageDropPlaceholder onFilesDropped={onFilesDropped} />
				)}
				{images.map((image, index) => (
					<ImageCard
						key={image.id}
						image={image}
						folderId={folderId}
						organizationId={organizationId}
						readOnly={readOnly}
						onOpenLightbox={(rect) => handleOpenLightbox(index, rect)}
						registerRef={(el) => registerCardRef(index, el)}
					/>
				))}
			</div>

			<ImageLightbox
				images={lightboxImages}
				currentIndex={currentIndex}
				isOpen={lightboxOpen}
				onClose={handleCloseLightbox}
				onNavigate={handleNavigate}
				originRect={originRect}
			/>
		</>
	);
}

import { useState } from "react";
import { ImageCard, type ImageCardData } from "@/components/gallery/ImageCard";

// Mock data for demonstration
const mockImages: ImageCardData[] = [
	{
		id: "1",
		imageUrl: "/TEST.png",
		directory: "Design Inspiration",
		savedFrom: "dribbble.com",
		isFavorite: true,
	},
	{
		id: "2",
		imageUrl: "/TEST.png",
		directory: "UI Components",
		savedFrom: "behance.net",
		isFavorite: false,
	},
	{
		id: "3",
		imageUrl: "/TEST.png",
		directory: "Product Photos",
		savedFrom: "unsplash.com",
		isFavorite: false,
	},
	{
		id: "4",
		imageUrl: "/TEST.png",
		directory: "Brand Assets",
		savedFrom: "pinterest.com",
		isFavorite: true,
	},
	{
		id: "5",
		imageUrl: "/TEST.png",
		directory: "Design Inspiration",
		savedFrom: "awwwards.com",
		isFavorite: false,
	},
	{
		id: "6",
		imageUrl: "/TEST.png",
		directory: "Social Media",
		savedFrom: "instagram.com",
		isFavorite: false,
	},
	{
		id: "7",
		imageUrl: "/TEST.png",
		directory: "UI Components",
		savedFrom: "figma.com",
		isFavorite: true,
	},
	{
		id: "8",
		imageUrl: "/TEST.png",
		directory: "Landing Pages",
		savedFrom: "landingfolio.com",
		isFavorite: false,
	},
];

export function ImageGallery() {
	const [images, setImages] = useState<ImageCardData[]>(mockImages);

	const handleToggleFavorite = (id: string) => {
		setImages((prevImages) =>
			prevImages.map((img) =>
				img.id === id ? { ...img, isFavorite: !img.isFavorite } : img,
			),
		);
	};

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{images.map((image) => (
				<ImageCard
					key={image.id}
					image={image}
					onToggleFavorite={handleToggleFavorite}
				/>
			))}
		</div>
	);
}

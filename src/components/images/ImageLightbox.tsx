import {
	ArrowLeft01Icon,
	ArrowRight01Icon,
	Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface LightboxImage {
	id: string;
	src: string;
	alt: string;
}

interface ImageLightboxProps {
	images: LightboxImage[];
	currentIndex: number;
	isOpen: boolean;
	onClose: () => void;
	onNavigate: (index: number) => void;
	originRect?: DOMRect | null;
}

type AnimationState = "closed" | "opening" | "open" | "closing";

export function ImageLightbox({
	images,
	currentIndex,
	isOpen,
	onClose,
	onNavigate,
	originRect,
}: ImageLightboxProps) {
	const [animationState, setAnimationState] =
		useState<AnimationState>("closed");
	const backdropRef = useRef<HTMLDivElement>(null);
	const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const currentImage = images[currentIndex];
	const hasPrevious = currentIndex > 0;
	const hasNext = currentIndex < images.length - 1;

	// Main state machine effect
	useEffect(() => {
		if (isOpen) {
			// Should be open
			if (animationState === "closed" || animationState === "closing") {
				// Cancel any pending close
				if (closeTimeoutRef.current) {
					clearTimeout(closeTimeoutRef.current);
					closeTimeoutRef.current = null;
				}
				// Start opening
				setAnimationState("opening");
				// Schedule transition to open
				openTimeoutRef.current = setTimeout(() => {
					setAnimationState("open");
				}, 20);
			}
		} else {
			// Should be closed
			if (animationState === "open" || animationState === "opening") {
				// Cancel any pending open
				if (openTimeoutRef.current) {
					clearTimeout(openTimeoutRef.current);
					openTimeoutRef.current = null;
				}
				// Start closing
				setAnimationState("closing");
				// Schedule transition to closed
				closeTimeoutRef.current = setTimeout(() => {
					setAnimationState("closed");
				}, 300);
			}
		}
	}, [isOpen, animationState]);

	// Cleanup on unmount only
	useEffect(() => {
		return () => {
			if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
			if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
		};
	}, []);

	// Handle close action
	const handleClose = useCallback(() => {
		onClose();
	}, [onClose]);

	// Handle navigation
	const handlePrevious = useCallback(() => {
		if (hasPrevious) {
			onNavigate(currentIndex - 1);
		}
	}, [hasPrevious, currentIndex, onNavigate]);

	const handleNext = useCallback(() => {
		if (hasNext) {
			onNavigate(currentIndex + 1);
		}
	}, [hasNext, currentIndex, onNavigate]);

	// Handle keyboard navigation
	useEffect(() => {
		if (animationState === "closed") return;

		const handleKeyDown = (e: KeyboardEvent) => {
			switch (e.key) {
				case "Escape":
					handleClose();
					break;
				case "ArrowLeft":
					e.preventDefault();
					handlePrevious();
					break;
				case "ArrowRight":
					e.preventDefault();
					handleNext();
					break;
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [animationState, handleClose, handlePrevious, handleNext]);

	// Handle backdrop click
	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === backdropRef.current) {
			handleClose();
		}
	};

	// Lock body scroll when visible
	useEffect(() => {
		if (animationState !== "closed") {
			const originalOverflow = document.body.style.overflow;
			document.body.style.overflow = "hidden";
			return () => {
				document.body.style.overflow = originalOverflow;
			};
		}
	}, [animationState]);

	// Don't render if closed or no image
	if (animationState === "closed" || !currentImage) return null;

	const isExpanded = animationState === "open";
	const isClosing = animationState === "closing";

	// Calculate transform origin from the source element position
	const getTransformStyles = (): React.CSSProperties => {
		if (!originRect) {
			return {};
		}

		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		// Calculate center of origin element relative to viewport center
		const originCenterX = originRect.left + originRect.width / 2;
		const originCenterY = originRect.top + originRect.height / 2;
		const viewportCenterX = viewportWidth / 2;
		const viewportCenterY = viewportHeight / 2;

		// Offset from center
		const offsetX = originCenterX - viewportCenterX;
		const offsetY = originCenterY - viewportCenterY;

		// Scale based on origin size vs target size (90% of viewport)
		const targetWidth = viewportWidth * 0.9;
		const targetHeight = viewportHeight * 0.9;
		const scaleX = originRect.width / targetWidth;
		const scaleY = originRect.height / targetHeight;
		const scale = Math.max(scaleX, scaleY);

		if (!isExpanded) {
			// Initial/closing state - position at origin
			return {
				transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
				opacity: 0.9,
			};
		}

		// Expanded state
		return {
			transform: "translate(0, 0) scale(1)",
			opacity: 1,
		};
	};

	return createPortal(
		// biome-ignore lint/a11y/useKeyWithClickEvents: Keyboard handler is separate
		<div
			ref={backdropRef}
			onClick={handleBackdropClick}
			className={cn(
				"fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300",
				isExpanded ? "opacity-100" : "opacity-0",
				// Allow clicks through during closing animation
				isClosing && "pointer-events-none",
			)}
			aria-modal="true"
			role="dialog"
		>
			{/* Close button */}
			<Button
				variant="ghost"
				size="icon"
				onClick={handleClose}
				className={cn(
					"absolute top-4 right-4 z-10 bg-background/80 hover:bg-background transition-all duration-300",
					isExpanded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
				)}
			>
				<HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
				<span className="sr-only">Close</span>
			</Button>

			{/* Previous button */}
			{hasPrevious && (
				<Button
					variant="ghost"
					size="icon"
					onClick={handlePrevious}
					className={cn(
						"absolute left-4 z-10 bg-background/80 hover:bg-background transition-all duration-300 size-12",
						isExpanded
							? "opacity-100 translate-x-0"
							: "opacity-0 -translate-x-4",
					)}
				>
					<HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} size={24} />
					<span className="sr-only">Previous image</span>
				</Button>
			)}

			{/* Next button */}
			{hasNext && (
				<Button
					variant="ghost"
					size="icon"
					onClick={handleNext}
					className={cn(
						"absolute right-4 z-10 bg-background/80 hover:bg-background transition-all duration-300 size-12",
						isExpanded
							? "opacity-100 translate-x-0"
							: "opacity-0 translate-x-4",
					)}
				>
					<HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} size={24} />
					<span className="sr-only">Next image</span>
				</Button>
			)}

			{/* Image counter */}
			{images.length > 1 && (
				<div
					className={cn(
						"absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-full bg-background/80 text-sm font-medium transition-all duration-300",
						isExpanded
							? "opacity-100 translate-y-0"
							: "opacity-0 translate-y-4",
					)}
				>
					{currentIndex + 1} / {images.length}
				</div>
			)}

			{/* Image container */}
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: Keyboard handler is on parent */}
			{/** biome-ignore lint/a11y/noStaticElementInteractions: Click handler is sufficient for accessibility */}
			<div
				onClick={handleClose}
				className="relative flex items-center justify-center transition-all duration-300 ease-out"
				style={{
					width: "90vw",
					height: "90vh",
					...getTransformStyles(),
				}}
			>
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: Click only prevents propagation */}
				<img
					src={currentImage.src}
					alt={currentImage.alt}
					onClick={(e) => e.stopPropagation()}
					className="max-w-full max-h-full object-contain rounded-lg shadow-2xl cursor-default"
				/>
			</div>
		</div>,
		document.body,
	);
}

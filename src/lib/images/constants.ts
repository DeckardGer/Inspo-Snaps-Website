/** Maximum image file size: 20 MB */
export const MAX_IMAGE_SIZE_BYTES = 20 * 1024 * 1024;

/** Maximum avatar file size: 5 MB */
export const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_MIME_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif",
	"image/avif",
] as const;

export type AllowedImageMimeType = (typeof ALLOWED_IMAGE_MIME_TYPES)[number];

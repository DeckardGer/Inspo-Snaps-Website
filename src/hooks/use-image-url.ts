import { useQuery } from "@tanstack/react-query";
import { getDownloadUrl } from "@/lib/storage/functions";

/**
 * Hook to fetch a presigned download URL for an image.
 *
 * CACHING STRATEGY:
 * Our presigned URLs are generated with hourly rounding (see s3.ts), meaning
 * all requests within the same hour get the EXACT same URL. This enables:
 *
 * 1. React Query cache (this hook): Stores the URL string for 1 hour
 * 2. Browser HTTP cache: Caches the actual image bytes (based on Cache-Control)
 *
 * Flow when user views an image:
 * 1. React Query checks if URL is cached → if yes, use it (no server call)
 * 2. Browser checks if image is cached for that URL → if yes, use it (no S3 call)
 * 3. Only if both miss: fetch URL from server, then fetch image from S3
 *
 * After first load, subsequent views use cached URL + cached image = instant.
 */
export function useImageUrl(storageKey: string) {
	return useQuery({
		queryKey: ["imageUrl", storageKey],
		queryFn: async () => {
			const { downloadUrl } = await getDownloadUrl({
				data: { storageKey },
			});
			return downloadUrl;
		},
		// Cache URL for 1 hour (matches our hourly URL rounding interval)
		// After 1 hour, we'll fetch a new URL, but it will be the same if
		// we're still in the same hour window
		staleTime: 1000 * 60 * 55, // 55 minutes (slightly less than 1 hour)
		gcTime: 1000 * 60 * 60, // Keep in garbage collection for 1 hour
		enabled: !!storageKey,
	});
}

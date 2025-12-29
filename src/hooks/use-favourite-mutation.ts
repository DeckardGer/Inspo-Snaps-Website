import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	addFolderToFavourites,
	removeFolderFromFavourites,
} from "@/lib/folders/functions";

type FavouriteContext = "personal" | "shared" | "team";

interface UseFavouriteMutationOptions {
	/** The folder ID */
	folderId: string;
	/** Whether the folder is currently favourited */
	isFavourited: boolean;
	/** The context determines which queries to invalidate */
	context: FavouriteContext;
	/** Parent folder ID (for personal folders) */
	parentId?: string | null;
	/** Organization ID (for team folders) */
	organizationId?: string;
}

/**
 * Hook for managing folder favourite state with proper query invalidation.
 * Reduces duplication across action menus.
 */
export function useFavouriteMutation({
	folderId,
	isFavourited,
	context,
	parentId,
	organizationId,
}: UseFavouriteMutationOptions) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () =>
			isFavourited
				? removeFolderFromFavourites({ data: { id: folderId } })
				: addFolderToFavourites({ data: { id: folderId } }),
		onSuccess: () => {
			// Always invalidate favourites list
			queryClient.invalidateQueries({
				queryKey: ["favouriteFolders"],
				exact: true,
			});

			// Context-specific invalidations
			switch (context) {
				case "personal":
					queryClient.invalidateQueries({
						queryKey: ["folders", parentId ?? "root"],
						exact: true,
					});
					queryClient.invalidateQueries({
						queryKey: ["sharedByMe"],
					});
					break;
				case "shared":
					queryClient.invalidateQueries({
						queryKey: ["sharedWithMe"],
					});
					queryClient.invalidateQueries({
						queryKey: ["sharedFolderContents"],
					});
					break;
				case "team":
					if (organizationId) {
						queryClient.invalidateQueries({
							queryKey: ["teamFolders", organizationId],
						});
					}
					break;
			}

			toast.success(
				isFavourited ? "Removed from favourites" : "Added to favourites",
			);
		},
		onError: (error) => {
			toast.error(
				isFavourited
					? "Failed to remove from favourites"
					: "Failed to add to favourites",
				{ description: error.message },
			);
		},
	});
}

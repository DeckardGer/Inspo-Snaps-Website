import { queryOptions } from "@tanstack/react-query";
import { getFavouriteFolders } from "@/lib/folders/functions";

export const favouriteFoldersQueryOptions = () =>
	queryOptions({
		queryKey: ["favouriteFolders"],
		queryFn: ({ signal }) => getFavouriteFolders({ signal }),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

export type FavouriteFoldersQueryResult = Awaited<
	ReturnType<typeof getFavouriteFolders>
>;

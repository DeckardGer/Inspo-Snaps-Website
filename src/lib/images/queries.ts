import { queryOptions } from "@tanstack/react-query";
import { getFolderImages, getImage } from "./functions";

export const folderImagesQueryOptions = (folderId: string) =>
	queryOptions({
		queryKey: ["folderImages", folderId],
		queryFn: ({ signal }) => getFolderImages({ data: { folderId }, signal }),
		staleTime: 1000 * 60 * 2,
	});

export const imageQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["image", id],
		queryFn: ({ signal }) => getImage({ data: { id }, signal }),
		staleTime: 1000 * 60 * 5,
	});

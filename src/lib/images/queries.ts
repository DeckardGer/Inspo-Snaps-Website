import { queryOptions } from "@tanstack/react-query";
import { getFolderImages, getImage, getTeamFolderImages } from "./functions";

export const folderImagesQueryOptions = (folderId: string) =>
	queryOptions({
		queryKey: ["folderImages", folderId],
		queryFn: ({ signal }) => getFolderImages({ data: { folderId }, signal }),
		staleTime: 1000 * 60 * 2,
	});

export const teamFolderImagesQueryOptions = (
	organizationId: string,
	folderId: string,
) =>
	queryOptions({
		queryKey: ["teamFolderImages", organizationId, folderId],
		queryFn: ({ signal }) =>
			getTeamFolderImages({ data: { organizationId, folderId }, signal }),
		staleTime: 1000 * 60 * 2,
	});

export const imageQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["image", id],
		queryFn: ({ signal }) => getImage({ data: { id }, signal }),
		staleTime: 1000 * 60 * 5,
	});

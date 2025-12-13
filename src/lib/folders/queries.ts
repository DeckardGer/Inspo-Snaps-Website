import { queryOptions } from "@tanstack/react-query";
import {
	getFavouriteFolders,
	getFolder,
	getFolderPath,
	getFolders,
	getFoldersWithStats,
	isFolderFavourited,
} from "./functions";

export const foldersQueryOptions = (parentId?: string | null) =>
	queryOptions({
		queryKey: ["folders", parentId ?? "root"],
		queryFn: ({ signal }) => getFolders({ data: { parentId }, signal }),
		staleTime: 1000 * 60 * 5,
	});

export const folderQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["folder", id],
		queryFn: ({ signal }) => getFolder({ data: { id }, signal }),
		staleTime: 1000 * 60 * 5,
	});

export const folderPathQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["folderPath", id],
		queryFn: ({ signal }) => getFolderPath({ data: { id }, signal }),
		staleTime: 1000 * 60 * 5,
	});

export const favouriteFoldersQueryOptions = () =>
	queryOptions({
		queryKey: ["favouriteFolders"],
		queryFn: ({ signal }) => getFavouriteFolders({ signal }),
		staleTime: 1000 * 60 * 5,
	});

export const isFolderFavouritedQueryOptions = (folderId: string) =>
	queryOptions({
		queryKey: ["isFolderFavourited", folderId],
		queryFn: ({ signal }) =>
			isFolderFavourited({ data: { id: folderId }, signal }),
		staleTime: 1000 * 60 * 2,
	});

export const foldersWithStatsQueryOptions = (parentId?: string | null) =>
	queryOptions({
		queryKey: ["foldersWithStats", parentId ?? "root"],
		queryFn: ({ signal }) =>
			getFoldersWithStats({ data: { parentId }, signal }),
		staleTime: 1000 * 60 * 5,
	});

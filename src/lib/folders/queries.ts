import { queryOptions } from "@tanstack/react-query";
import {
	getFavouriteFolders,
	getFolder,
	getFolderPath,
	getFolderStats,
	getFolders,
	getTeamFolderPath,
	getTeamFolders,
	getTeamFolderStats,
} from "./functions";

export const foldersQueryOptions = (parentId?: string | null) =>
	queryOptions({
		queryKey: ["folders", parentId ?? "root"],
		queryFn: ({ signal }) => getFolders({ data: { parentId }, signal }),
		staleTime: 1000 * 60 * 5,
	});

// TODO: Not currently used
export const folderQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["folder", id],
		queryFn: ({ signal }) => getFolder({ data: { id }, signal }),
		staleTime: 1000 * 60 * 5,
	});

// TODO: Not currently used
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

export const folderStatsQueryOptions = (folderId: string) =>
	queryOptions({
		queryKey: ["folderStats", folderId],
		queryFn: ({ signal }) => getFolderStats({ data: { id: folderId }, signal }),
		staleTime: 1000 * 60 * 2,
	});

// Team folder query options
export const teamFoldersQueryOptions = (
	organizationId: string,
	parentId?: string | null,
) =>
	queryOptions({
		queryKey: ["teamFolders", organizationId, parentId ?? "root"],
		queryFn: ({ signal }) =>
			getTeamFolders({ data: { organizationId, parentId }, signal }),
		staleTime: 1000 * 60 * 5,
		enabled: !!organizationId,
	});

export const teamFolderPathQueryOptions = (
	organizationId: string,
	folderId: string,
) =>
	queryOptions({
		queryKey: ["teamFolderPath", organizationId, folderId],
		queryFn: ({ signal }) =>
			getTeamFolderPath({ data: { organizationId, id: folderId }, signal }),
		staleTime: 1000 * 60 * 5,
		enabled: !!organizationId && !!folderId,
	});

export const teamFolderStatsQueryOptions = (
	organizationId: string,
	folderId: string,
) =>
	queryOptions({
		queryKey: ["teamFolderStats", organizationId, folderId],
		queryFn: ({ signal }) =>
			getTeamFolderStats({ data: { organizationId, id: folderId }, signal }),
		staleTime: 1000 * 60 * 2,
	});

import { queryOptions } from "@tanstack/react-query";
import { getFolder, getFolderPath, getFolders } from "./functions";

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

// Temporary backwards compatibility for demo UI
const demoGetFavouriteFolders = async () => {
	return [
		{
			id: "1",
			name: "Project Management & Task Tracking",
			url: "/folders/project-management",
		},
	];
};

export const favouriteFoldersQueryOptions = () =>
	queryOptions({
		queryKey: ["favouriteFolders"],
		queryFn: () => demoGetFavouriteFolders(),
		staleTime: 1000 * 60 * 5,
	});

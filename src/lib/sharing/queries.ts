import { queryOptions } from "@tanstack/react-query";
import {
	accessSharedLink,
	getSharedUsers,
	getSharedWithMe,
	getShareLinks,
} from "./functions";

// TODO: Not currently used
export const shareLinksQueryOptions = (folderId: string) =>
	queryOptions({
		queryKey: ["shareLinks", folderId],
		queryFn: ({ signal }) => getShareLinks({ data: { folderId }, signal }),
		staleTime: 1000 * 60 * 5,
	});

// TODO: Not currently used
export const sharedUsersQueryOptions = (folderId: string) =>
	queryOptions({
		queryKey: ["sharedUsers", folderId],
		queryFn: ({ signal }) => getSharedUsers({ data: { folderId }, signal }),
		staleTime: 1000 * 60 * 5,
	});

// TODO: Not currently used
export const sharedWithMeQueryOptions = () =>
	queryOptions({
		queryKey: ["sharedWithMe"],
		queryFn: ({ signal }) => getSharedWithMe({ signal }),
		staleTime: 1000 * 60 * 5,
	});

// TODO: Not currently used
export const sharedLinkAccessQueryOptions = (linkId: string) =>
	queryOptions({
		queryKey: ["sharedLinkAccess", linkId],
		queryFn: ({ signal }) => accessSharedLink({ data: { linkId }, signal }),
		staleTime: 1000 * 60 * 5,
	});

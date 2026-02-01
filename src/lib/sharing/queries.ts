import { queryOptions } from "@tanstack/react-query";
import {
	accessSharedLink,
	getInvitationDetails,
	getPendingInvitations,
	getSharedByMe,
	getSharedFolderContentsAuth,
	getSharedFolderImages,
	getSharedFolderPath,
	getSharedUsers,
	getSharedWithMe,
	getShareLinks,
} from "./functions";

export const shareLinksQueryOptions = (folderId: string) =>
	queryOptions({
		queryKey: ["shareLinks", folderId],
		queryFn: ({ signal }) => getShareLinks({ data: { folderId }, signal }),
		staleTime: 1000 * 60 * 5,
	});

export const sharedUsersQueryOptions = (folderId: string) =>
	queryOptions({
		queryKey: ["sharedUsers", folderId],
		queryFn: ({ signal }) => getSharedUsers({ data: { folderId }, signal }),
		staleTime: 1000 * 60 * 5,
	});

export const sharedWithMeQueryOptions = () =>
	queryOptions({
		queryKey: ["sharedWithMe"],
		queryFn: ({ signal }) => getSharedWithMe({ signal }),
		staleTime: 1000 * 60 * 5,
	});

export const sharedByMeQueryOptions = () =>
	queryOptions({
		queryKey: ["sharedByMe"],
		queryFn: ({ signal }) => getSharedByMe({ signal }),
		staleTime: 1000 * 60 * 5,
	});

export const pendingInvitationsQueryOptions = () =>
	queryOptions({
		queryKey: ["pendingInvitations"],
		queryFn: ({ signal }) => getPendingInvitations({ signal }),
		staleTime: 1000 * 60 * 2,
	});

export const invitationDetailsQueryOptions = (folderId: string) =>
	queryOptions({
		queryKey: ["invitationDetails", folderId],
		queryFn: ({ signal }) =>
			getInvitationDetails({ data: { folderId }, signal }),
		staleTime: 1000 * 60 * 5,
	});

export const sharedLinkAccessQueryOptions = (linkId: string) =>
	queryOptions({
		queryKey: ["sharedLinkAccess", linkId],
		queryFn: ({ signal }) => accessSharedLink({ data: { linkId }, signal }),
		staleTime: 1000 * 60 * 5,
	});

export const sharedFolderContentsQueryOptions = (folderId: string) =>
	queryOptions({
		queryKey: ["sharedFolderContents", folderId],
		queryFn: ({ signal }) =>
			getSharedFolderContentsAuth({ data: { folderId }, signal }),
		staleTime: 1000 * 60 * 5,
	});

export const sharedFolderImagesQueryOptions = (folderId: string) =>
	queryOptions({
		queryKey: ["sharedFolderImages", folderId],
		queryFn: ({ signal }) =>
			getSharedFolderImages({ data: { folderId }, signal }),
		staleTime: 1000 * 60 * 2,
	});

export const sharedFolderPathQueryOptions = (folderId: string) =>
	queryOptions({
		queryKey: ["sharedFolderPath", folderId],
		queryFn: ({ signal }) =>
			getSharedFolderPath({ data: { folderId }, signal }),
		staleTime: 1000 * 60 * 5,
	});

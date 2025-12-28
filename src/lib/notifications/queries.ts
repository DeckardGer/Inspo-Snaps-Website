import { queryOptions } from "@tanstack/react-query";
import { getNotifications, getUnreadCount } from "./functions";

/**
 * Query options for fetching notifications
 */
export const notificationsQueryOptions = (params?: {
	limit?: number;
	unreadOnly?: boolean;
}) =>
	queryOptions({
		queryKey: [
			"notifications",
			params?.limit ?? 50,
			params?.unreadOnly ?? false,
		],
		queryFn: () =>
			getNotifications({
				data: {
					limit: params?.limit ?? 50,
					unreadOnly: params?.unreadOnly ?? false,
				},
			}),
		staleTime: 60 * 1000, // 1 minute
	});

/**
 * Query options for fetching unread notification count
 */
export const unreadCountQueryOptions = () =>
	queryOptions({
		queryKey: ["notifications", "unreadCount"],
		queryFn: () => getUnreadCount(),
		staleTime: 30 * 1000, // 30 seconds
		refetchInterval: 60 * 1000, // Refetch every minute
	});

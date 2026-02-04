import { queryOptions } from "@tanstack/react-query";
import { getUser, hasPassword } from "@/lib/auth/functions";

export const authQueryOptions = () =>
	queryOptions({
		queryKey: ["user"],
		queryFn: ({ signal }) => getUser({ signal }),
	});

export const hasPasswordQueryOptions = () =>
	queryOptions({
		queryKey: ["user", "hasPassword"],
		queryFn: () => hasPassword(),
		staleTime: 5 * 60 * 1000,
	});

export type AuthQueryResult = Awaited<ReturnType<typeof getUser>>;

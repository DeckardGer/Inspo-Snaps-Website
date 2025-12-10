import { queryOptions } from "@tanstack/react-query";
import { getOverviewStats } from "@/lib/stats/functions";

export const overviewStatsQueryOptions = () =>
	queryOptions({
		queryKey: ["overviewStats"],
		queryFn: ({ signal }) => getOverviewStats({ signal }),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

export type OverviewStatsQueryResult = Awaited<
	ReturnType<typeof getOverviewStats>
>;

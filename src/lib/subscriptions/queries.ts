import { queryOptions } from "@tanstack/react-query";
import { getUserPlanState } from "./functions";

export const planStateQueryOptions = () =>
	queryOptions({
		queryKey: ["planState"],
		queryFn: () => getUserPlanState(),
		staleTime: 1000 * 60 * 2, // 2 minutes
	});

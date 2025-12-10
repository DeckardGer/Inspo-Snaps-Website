import { createServerFn } from "@tanstack/react-start";

export interface OverviewStats {
	totalImages: number;
	sharedImages: number;
	teamImages: number;
}

export const getOverviewStats = createServerFn({ method: "GET" }).handler(
	async () => {
		// TODO: Replace with actual database query
		// Mock data for now with simulated delay
		await new Promise((resolve) => setTimeout(resolve, 800));

		return {
			totalImages: 1247,
			sharedImages: 32,
			teamImages: 14,
		} satisfies OverviewStats;
	},
);

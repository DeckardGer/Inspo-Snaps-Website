import { createFileRoute, redirect } from "@tanstack/react-router";
import { authQueryOptions } from "@/lib/auth/queries";

export const Route = createFileRoute("/(auth-pages)")({
	beforeLoad: async ({ context }) => {
		const REDIRECT_URL = "/overview";

		const user = await context.queryClient.ensureQueryData({
			...authQueryOptions(),
			revalidateIfStale: true,
		});

		if (user) {
			throw redirect({
				to: REDIRECT_URL,
			});
		}

		return {
			redirectUrl: REDIRECT_URL,
		};
	},
});

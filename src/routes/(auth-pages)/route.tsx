import { createFileRoute, redirect } from "@tanstack/react-router";
import { authQueryOptions } from "@/lib/auth/queries";

const REDIRECT_ROUTE = "/my-folders/{-$folderId}";
const REDIRECT_PATH = "/my-folders";
const FRESH_LOGIN_PARAM = "freshLogin=true";

export const Route = createFileRoute("/(auth-pages)")({
	beforeLoad: async ({ context }) => {
		const user = await context.queryClient.ensureQueryData({
			...authQueryOptions(),
			revalidateIfStale: true,
		});

		if (user) {
			throw redirect({ to: REDIRECT_ROUTE, params: { folderId: undefined } });
		}

		return {
			redirectUrl: `${REDIRECT_PATH}?${FRESH_LOGIN_PARAM}`,
		};
	},
});

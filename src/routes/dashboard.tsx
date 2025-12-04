import { createFileRoute, redirect } from "@tanstack/react-router";
import { getUser } from "@/lib/auth/functions";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	beforeLoad: async () => {
		const user = await getUser();

		if (!user) {
			throw redirect({
				to: "/",
			});
		}

		return {
			user,
		};
	},
});

function RouteComponent() {
	const { user } = Route.useRouteContext();

	return <div>Welcome to the dashboard: {user.email}!</div>;
}

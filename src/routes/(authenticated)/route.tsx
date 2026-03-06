import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import authClient from "@/lib/auth/auth-client";
import { notifyInspoSnapsExtension } from "@/lib/auth/extension";
import { authQueryOptions } from "@/lib/auth/queries";
import { favouriteFoldersQueryOptions } from "@/lib/folders/queries";
import { planStateQueryOptions } from "@/lib/subscriptions/queries";

const FRESH_LOGIN_KEY = "freshLogin";

export const Route = createFileRoute("/(authenticated)")({
	component: RouteComponent,
	head: () => ({
		meta: [{ name: "robots", content: "noindex, nofollow" }],
	}),
	beforeLoad: async ({ context, location }) => {
		const user = await context.queryClient.ensureQueryData({
			...authQueryOptions(),
			revalidateIfStale: true,
		});

		if (!user) {
			throw redirect({ to: "/login" });
		}

		// Prefetch favourite folders and plan state without blocking (deferred)
		context.queryClient.prefetchQuery(favouriteFoldersQueryOptions());
		context.queryClient.prefetchQuery(planStateQueryOptions());

		// Check for fresh login param and redirect without it
		const searchParams = new URLSearchParams(location.search);
		if (searchParams.has(FRESH_LOGIN_KEY)) {
			sessionStorage.setItem(FRESH_LOGIN_KEY, "true");
			throw redirect({ to: location.pathname });
		}

		// Check sessionStorage for fresh login flag (set before redirect)
		const freshLogin = sessionStorage.getItem(FRESH_LOGIN_KEY) === "true";
		if (freshLogin) {
			sessionStorage.removeItem(FRESH_LOGIN_KEY);
		}

		return { user, freshLogin };
	},
});

function RouteComponent() {
	const { freshLogin } = Route.useRouteContext();
	const queryClient = useQueryClient();

	// Notify Chrome extension about auth state on fresh login only
	useEffect(() => {
		if (!freshLogin) return;

		authClient.getSession().then(({ data }) => {
			if (data?.user && data?.session) {
				notifyInspoSnapsExtension({
					user: data.user,
					session: {
						id: data.session.id,
						expiresAt: data.session.expiresAt.toISOString(),
						updatedAt: data.session.updatedAt.toISOString(),
					},
				});
			}
		});
	}, [freshLogin]);

	// Handle checkout success redirect from Polar
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		if (params.get("checkout") === "success") {
			queryClient.invalidateQueries({ queryKey: ["planState"] });
			// Force session refresh to pick up new subscription in cookie cache
			authClient.getSession({
				fetchOptions: { cache: "no-cache" },
			});
			toast.success("Welcome to Pro!", {
				description: "Your subscription is now active.",
			});
			// Clean up the URL
			const url = new URL(window.location.href);
			url.searchParams.delete("checkout");
			window.history.replaceState({}, "", url.pathname);
		}
	}, [queryClient]);

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
}

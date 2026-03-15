import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
	identifyUser,
	trackCheckoutCompleted,
	trackSignupCompleted,
	trackSubscriptionCancelled,
} from "@/lib/analytics/events";
import authClient from "@/lib/auth/auth-client";
import { notifyInspoSnapsExtension } from "@/lib/auth/extension";
import { authQueryOptions } from "@/lib/auth/queries";
import { favouriteFoldersQueryOptions } from "@/lib/folders/queries";
import { TIERS } from "@/lib/subscriptions/pricing";
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
		if (typeof window !== "undefined") {
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
		}

		return { user, freshLogin: false };
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
				const session = data.session as typeof data.session & {
					plan: string;
					canWrite: boolean;
				};
				notifyInspoSnapsExtension({
					user: data.user,
					session: {
						id: session.id,
						expiresAt: session.expiresAt.toISOString(),
						updatedAt: session.updatedAt.toISOString(),
						plan: session.plan,
						canWrite: session.canWrite,
					},
				});

				// Identify user in PostHog
				const account = data.user as typeof data.user & {
					createdAt: string | Date;
				};
				const createdAt =
					account.createdAt instanceof Date
						? account.createdAt
						: new Date(account.createdAt);
				identifyUser({
					id: data.user.id,
					email: data.user.email,
					plan: session.plan,
					createdAt: createdAt.toISOString(),
				});

				// Detect Google OAuth signup (created within last 2 minutes)
				const ageMs = Date.now() - createdAt.getTime();
				if (ageMs < 2 * 60 * 1000) {
					trackSignupCompleted("google");
				}
			}
		});
	}, [freshLogin]);

	// Handle checkout success redirect from Polar
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		if (params.get("checkout") === "success") {
			queryClient.invalidateQueries({ queryKey: ["planState"] });
			// Force session refresh to pick up new subscription in cookie cache
			authClient
				.getSession({
					fetchOptions: { cache: "no-cache" },
				})
				.then(({ data }) => {
					if (data?.user && data?.session) {
						const session = data.session as typeof data.session & {
							plan: string;
							canWrite: boolean;
						};
						notifyInspoSnapsExtension({
							user: data.user,
							session: {
								id: session.id,
								expiresAt: session.expiresAt.toISOString(),
								updatedAt: session.updatedAt.toISOString(),
								plan: session.plan,
								canWrite: session.canWrite,
							},
						});
						trackCheckoutCompleted(session.plan);
					}
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

	// Track subscription cancellation (once per session)
	const cancelTrackedRef = useRef(false);
	useEffect(() => {
		if (cancelTrackedRef.current) return;
		queryClient.fetchQuery(planStateQueryOptions()).then((planState) => {
			if (planState?.status === "canceled" && planState.plan) {
				cancelTrackedRef.current = true;
				const key = "ph_cancel_tracked";
				if (!sessionStorage.getItem(key)) {
					sessionStorage.setItem(key, "1");
					trackSubscriptionCancelled(planState.plan);
				}
			}
		});
	}, [queryClient]);

	// Handle checkout-slug param (from email verification redirect)
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const slug = params.get("checkout-slug");
		if (!slug) return;

		// Validate it's a known slug
		const validSlugs = TIERS.flatMap((tier) => [
			`${tier.slug}-monthly`,
			`${tier.slug}-annual`,
		]);
		if (!validSlugs.includes(slug)) return;

		// Clean up the URL param
		const url = new URL(window.location.href);
		url.searchParams.delete("checkout-slug");
		window.history.replaceState({}, "", url.pathname + url.search);

		// Trigger checkout
		authClient.checkout({ slug });
	}, []);

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
}

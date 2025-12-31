import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import authClient from "@/lib/auth/auth-client";
import { notifyInspoSnapsExtension } from "@/lib/auth/extension";
import { authQueryOptions } from "@/lib/auth/queries";
import { favouriteFoldersQueryOptions } from "@/lib/folders/queries";

export const Route = createFileRoute("/(authenticated)")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		const user = await context.queryClient.ensureQueryData({
			...authQueryOptions(),
			revalidateIfStale: true,
		});

		if (!user) {
			throw redirect({ to: "/login" });
		}

		// Prefetch favourite folders without blocking (deferred)
		context.queryClient.prefetchQuery(favouriteFoldersQueryOptions());

		// re-return to update type as non-null for child routes
		return { user };
	},
});

function RouteComponent() {
	const hasNotifiedRef = useRef(false);

	// Notify Chrome extension about auth state on initial mount
	// This handles OAuth redirects where we can't notify before the redirect
	useEffect(() => {
		if (hasNotifiedRef.current) return;

		authClient.getSession().then(({ data }) => {
			if (data?.user && data?.session && !hasNotifiedRef.current) {
				hasNotifiedRef.current = true;
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

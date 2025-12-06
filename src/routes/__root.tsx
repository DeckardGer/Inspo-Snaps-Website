import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Toaster } from "@/components/ui/sonner";
import { type AuthQueryResult, authQueryOptions } from "@/lib/auth/queries";
import { ThemeProvider } from "@/lib/ThemeProvider";
import appCss from "@/styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
	user: AuthQueryResult;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: ({ context }) => {
		// we're using react-query for client-side caching to reduce client-to-server calls, see /src/router.tsx
		// better-auth's cookieCache is also enabled server-side to reduce server-to-db calls, see /src/lib/auth/auth.ts
		context.queryClient.prefetchQuery(authQueryOptions());

		// typically we don't need the user immediately in landing pages,
		// so we're only prefetching here and not awaiting.
		// for protected routes with loader data, see /(authenticated)/route.tsx
	},
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Inspo Snaps",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body>
				<ThemeProvider>
					{children}
					<Toaster richColors />
				</ThemeProvider>

				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						{
							name: "Tanstack Query",
							render: <ReactQueryDevtoolsPanel />,
						},
					]}
				/>

				<Scripts />
			</body>
		</html>
	);
}

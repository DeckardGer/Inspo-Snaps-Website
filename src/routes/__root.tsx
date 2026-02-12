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
import { clientEnv } from "@/config/env/client";
import { type AuthQueryResult, authQueryOptions } from "@/lib/auth/queries";
import { ThemeProvider } from "@/lib/ThemeProvider";
import appCss from "@/styles.css?url";

const DEFAULT_TITLE = "InspoSnaps";
const DEFAULT_DESCRIPTION =
	"Organize, save, and share your visual inspiration. Create folders, upload images, and collaborate with others.";
const OG_IMAGE_URL = `${clientEnv.VITE_BASE_URL}/og-image.png`;

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
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: DEFAULT_TITLE },
			{ name: "description", content: DEFAULT_DESCRIPTION },
			{ name: "theme-color", content: "#18181b" },
			// Open Graph
			{ property: "og:type", content: "website" },
			{ property: "og:site_name", content: "InspoSnaps" },
			{ property: "og:title", content: DEFAULT_TITLE },
			{ property: "og:description", content: DEFAULT_DESCRIPTION },
			{ property: "og:image", content: OG_IMAGE_URL },
			{ property: "og:locale", content: "en_US" },
			// Twitter Card
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: DEFAULT_TITLE },
			{ name: "twitter:description", content: DEFAULT_DESCRIPTION },
			{ name: "twitter:image", content: OG_IMAGE_URL },
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{ rel: "icon", href: "/favicon.ico" },
			{ rel: "apple-touch-icon", href: "/logo192.png" },
			{ rel: "manifest", href: "/manifest.json" },
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
					<Toaster />
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

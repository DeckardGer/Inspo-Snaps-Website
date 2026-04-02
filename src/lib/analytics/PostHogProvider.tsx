import { useEffect } from "react";
import { initPostHog } from "./posthog";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		// Skip PostHog on landing page to test performance impact
		if (window.location.pathname === "/") return;
		initPostHog();
	}, []);

	return <>{children}</>;
}

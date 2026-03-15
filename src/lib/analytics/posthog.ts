import posthog from "posthog-js";
import { clientEnv } from "@/config/env/client";

let initialized = false;

export function initPostHog() {
	if (typeof window === "undefined" || initialized) return;
	if (import.meta.env.DEV) return;
	if (!clientEnv.VITE_POSTHOG_KEY) return;

	posthog.init(clientEnv.VITE_POSTHOG_KEY, {
		api_host: "https://us.i.posthog.com",
		autocapture: false,
		capture_pageview: true,
		capture_pageleave: true,
		session_recording: { maskAllInputs: true },
		persistence: "localStorage+cookie",
	});

	initialized = true;
}

export function getPostHog() {
	if (typeof window === "undefined" || !initialized) return undefined;
	return posthog;
}

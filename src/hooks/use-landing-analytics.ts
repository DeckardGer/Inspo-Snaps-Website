import { useEffect, useRef } from "react";
import {
	trackLandingScrollDepth,
	trackLandingSectionViewed,
	trackLandingTimeOnPage,
} from "@/lib/analytics/capture";

const SCROLL_THRESHOLDS = [25, 50, 75, 100];

const SECTIONS = [
	"hero",
	"social-proof",
	"features",
	"how-it-works",
	"benefits",
	"pricing",
	"testimonials",
	"faq",
	"final-cta",
];

export function useLandingAnalytics({ enabled }: { enabled: boolean }) {
	const firedDepths = useRef(new Set<number>());
	const startTime = useRef(Date.now());

	// Scroll depth tracking
	useEffect(() => {
		if (!enabled) return;
		function onScroll() {
			const scrollTop = window.scrollY;
			const docHeight =
				document.documentElement.scrollHeight - window.innerHeight;
			if (docHeight <= 0) return;
			const percent = Math.round((scrollTop / docHeight) * 100);

			for (const threshold of SCROLL_THRESHOLDS) {
				if (percent >= threshold && !firedDepths.current.has(threshold)) {
					firedDepths.current.add(threshold);
					trackLandingScrollDepth(threshold);
				}
			}
		}

		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [enabled]);

	// Section visibility tracking via IntersectionObserver
	useEffect(() => {
		if (!enabled) return;
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						const section = entry.target.getAttribute("data-track-section");
						if (section) {
							trackLandingSectionViewed(section);
							observer.unobserve(entry.target);
						}
					}
				}
			},
			{ threshold: 0.3 },
		);

		// Observe all tracked sections
		for (const id of SECTIONS) {
			const el = document.querySelector(`[data-track-section="${id}"]`);
			if (el) observer.observe(el);
		}

		return () => observer.disconnect();
	}, [enabled]);

	// Time on page tracking (fires on leave)
	useEffect(() => {
		if (!enabled) return;
		function onLeave() {
			const seconds = Math.round((Date.now() - startTime.current) / 1000);
			trackLandingTimeOnPage(seconds);
		}

		function onVisibilityChange() {
			if (document.visibilityState === "hidden") onLeave();
		}

		document.addEventListener("visibilitychange", onVisibilityChange);
		window.addEventListener("beforeunload", onLeave);

		return () => {
			document.removeEventListener("visibilitychange", onVisibilityChange);
			window.removeEventListener("beforeunload", onLeave);
		};
	}, [enabled]);
}

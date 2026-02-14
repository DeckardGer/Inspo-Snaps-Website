import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { BentoFeatures } from "@/components/landing2/BentoFeatures2";
import { FAQSection2 } from "@/components/landing2/FAQSection2";
import { FinalCTA2 } from "@/components/landing2/FinalCTA2";
import { Footer2 } from "@/components/landing2/Footer2";
import { HeroSection2 } from "@/components/landing2/HeroSection2";
import { HowItWorks2 } from "@/components/landing2/HowItWorks2";
import { LogoTicker } from "@/components/landing2/LogoTicker2";
import { Navbar2 } from "@/components/landing2/Navbar2";
import { PricingSection2 } from "@/components/landing2/PricingSection2";
import { StatsSection } from "@/components/landing2/StatsSection2";
import { Testimonials2 } from "@/components/landing2/Testimonials2";

export const Route = createFileRoute("/landing2")({
	component: Landing2Page,
	head: () => ({
		meta: [
			{ title: "InspoSnaps — Organize & Share Visual Inspiration" },
			{
				name: "description",
				content:
					"Save, organize, and share your visual inspiration with InspoSnaps. Create beautiful collections with smart folders and never lose creative inspiration again.",
			},
		],
	}),
});

function Landing2Page() {
	useEffect(() => {
		document.documentElement.style.scrollBehavior = "smooth";
		return () => {
			document.documentElement.style.scrollBehavior = "";
		};
	}, []);

	return (
		<div className="min-h-svh bg-background text-foreground">
			{/* Keyframes for logo ticker */}
			<style>{`@keyframes landing2-ticker{from{transform:translateX(0)}to{transform:translateX(calc(-100%/3))}}`}</style>

			<Navbar2 />
			<HeroSection2 />
			<LogoTicker />
			<StatsSection />
			<BentoFeatures />
			<HowItWorks2 />
			<PricingSection2 />
			<Testimonials2 />
			<FAQSection2 />
			<FinalCTA2 />
			<Footer2 />
		</div>
	);
}

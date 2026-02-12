import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { FeatureShowcase } from "@/components/landing/FeatureShowcase";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { PricingSection } from "@/components/landing/PricingSection";
import { SocialProof } from "@/components/landing/SocialProof";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { clientEnv } from "@/config/env/client";

const CANONICAL_URL = clientEnv.VITE_BASE_URL;

export const Route = createFileRoute("/")({
	component: LandingPage,
	head: () => ({
		meta: [
			{ title: "InspoSnaps — Organize & Share Visual Inspiration" },
			{
				name: "description",
				content:
					"Save, organize, and share your visual inspiration with InspoSnaps. Create beautiful collections with smart folders, share with anyone, and never lose creative inspiration again.",
			},
			{
				property: "og:title",
				content: "InspoSnaps — Your Inspiration Deserves a Home",
			},
			{
				property: "og:description",
				content:
					"Create beautiful collections, organize with smart folders, and share your visual inspiration with anyone.",
			},
			{ property: "og:url", content: CANONICAL_URL },
		],
		links: [{ rel: "canonical", href: CANONICAL_URL }],
	}),
});

function LandingPage() {
	useEffect(() => {
		document.documentElement.style.scrollBehavior = "smooth";
		return () => {
			document.documentElement.style.scrollBehavior = "";
		};
	}, []);

	return (
		<div className="min-h-svh bg-background text-foreground">
			<LandingNav />
			<HeroSection />
			<SocialProof />
			<BenefitsSection />
			<HowItWorks />
			<FeatureShowcase />
			<PricingSection />
			<TestimonialsSection />
			<FAQSection />
			<FinalCTA />
			<LandingFooter />
		</div>
	);
}

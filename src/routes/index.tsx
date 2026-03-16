import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { FeatureShowcase } from "@/components/landing/FeatureShowcase";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/NavBar";
import { PricingSection } from "@/components/landing/PricingSection";
import { SocialProof } from "@/components/landing/SocialProof";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { clientEnv } from "@/config/env/client";
import { useLandingAnalytics } from "@/hooks/use-landing-analytics";
import { authQueryOptions } from "@/lib/auth/queries";

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
	const { data: user } = useQuery(authQueryOptions());
	useLandingAnalytics({ enabled: !user });

	useEffect(() => {
		document.documentElement.style.scrollBehavior = "smooth";
		return () => {
			document.documentElement.style.scrollBehavior = "";
		};
	}, []);

	return (
		<div className="min-h-svh bg-background text-foreground">
			<LandingNav />
			<div data-track-section="hero">
				<HeroSection />
			</div>
			<div data-track-section="social-proof">
				<SocialProof />
			</div>
			<div data-track-section="features">
				<FeatureShowcase />
			</div>
			<div data-track-section="how-it-works">
				<HowItWorks />
			</div>
			<div data-track-section="benefits">
				<BenefitsSection />
			</div>
			<div data-track-section="pricing">
				<PricingSection />
			</div>
			<div data-track-section="testimonials">
				<TestimonialsSection />
			</div>
			<div data-track-section="faq">
				<FAQSection />
			</div>
			<div data-track-section="final-cta">
				<FinalCTA />
			</div>
			<LandingFooter />
		</div>
	);
}

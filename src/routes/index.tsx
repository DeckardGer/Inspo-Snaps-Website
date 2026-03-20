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
const OG_IMAGE_URL = `${CANONICAL_URL}/og-image.png`;

const STRUCTURED_DATA = {
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "WebApplication",
			name: "InspoSnaps",
			url: CANONICAL_URL,
			description:
				"Save, organize, and share your visual inspiration with InspoSnaps. Create beautiful collections with smart folders, share with anyone, and never lose creative inspiration again.",
			applicationCategory: "DesignApplication",
			operatingSystem: "Any",
			image: OG_IMAGE_URL,
			offers: {
				"@type": "Offer",
				price: "0",
				priceCurrency: "USD",
				description: "14-day free trial, no credit card required",
			},
		},
		{
			"@type": "FAQPage",
			mainEntity: [
				{
					"@type": "Question",
					name: "What is InspoSnaps?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "InspoSnaps is a private workspace for collecting and organizing visual inspiration. Save images into nested folders, tag them with colors and emojis, and access your collections from any device — without the noise of a social platform.",
					},
				},
				{
					"@type": "Question",
					name: "How is InspoSnaps different from Pinterest?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "Pinterest is a social discovery platform — InspoSnaps is your private workspace. You own your collections, organize them your way with nested folders, and share only what you choose. No algorithms, no ads, no distractions.",
					},
				},
				{
					"@type": "Question",
					name: "How does folder organization work?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "Create unlimited nested folders to mirror the way you think. Assign colors and emojis for quick recognition, drag images between folders, and use the browser extension to save inspiration from anywhere on the web.",
					},
				},
				{
					"@type": "Question",
					name: "How does sharing work?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "Share folders with other InspoSnaps users or generate view-only links for anyone. Your content stays secure and only visible to the people you choose.",
					},
				},
				{
					"@type": "Question",
					name: "Can I try InspoSnaps before committing?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "Every plan comes with a 14-day free trial — no credit card required. You get full access to all features so you can see if InspoSnaps is right for you.",
					},
				},
				{
					"@type": "Question",
					name: "Can I cancel my subscription anytime?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "Yes, cancel anytime with no questions asked. If you cancel during your trial, you won't be charged. We believe in earning your business every month.",
					},
				},
			],
		},
	],
};

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
		scripts: [
			{
				type: "application/ld+json",
				children: JSON.stringify(STRUCTURED_DATA),
			},
		],
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

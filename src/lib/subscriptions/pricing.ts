export type BillingCycle = "monthly" | "annual";

export interface PricingTier {
	slug: "pro" | "team";
	name: string;
	tagline: string;
	monthlyPrice: number;
	annualPrice: number;
	cta: string;
	ctaVariant: "outline" | "default";
	popular?: boolean;
	features: (string | { text: string; soon?: boolean })[];
}

export const TIERS: PricingTier[] = [
	{
		slug: "pro",
		name: "Pro",
		tagline: "For creatives who need more power",
		monthlyPrice: 6,
		annualPrice: 5,
		cta: "Choose Pro",
		ctaVariant: "default",
		popular: true,
		features: [
			"Unlimited folders & images",
			"Unlimited cloud storage",
			"Browser extension",
			"Sync across all devices",
			"Folder organization & colors",
			"Share view-only folders with anyone",
			"Nested folder structures",
			"Priority support",
			{ text: "AI auto-tagging & smart search", soon: true },
		],
	},
	{
		slug: "team",
		name: "Team",
		tagline: "For teams building together",
		monthlyPrice: 9,
		annualPrice: 7.5,
		cta: "Choose Team",
		ctaVariant: "outline",
		features: [
			"Everything in Pro",
			"Unlimited team workspaces",
			"Viewer & editor roles",
			"Dedicated support",
		],
	},
];

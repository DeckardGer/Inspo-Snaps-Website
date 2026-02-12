import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { GABARITO, Reveal, SectionBadge } from "./shared";

const FAQ_DATA = [
	{
		q: "What is InspoSnaps?",
		a: "InspoSnaps is a visual inspiration management platform. It lets you save, organize, and share images in hierarchical folder collections — think of it as a beautiful, smart filing system for all your creative references.",
	},
	{
		q: "Is there a free plan?",
		a: "Yes! Our free plan includes 5 folders, 100 images, and basic sharing. It's perfect for getting started and seeing if InspoSnaps fits your workflow.",
	},
	{
		q: "How does sharing work?",
		a: "You can share any folder by generating a shareable link — anyone with the link can view your collection, no account needed. You can also invite specific users to collaborate directly.",
	},
	{
		q: "Can I organize images into multiple folders?",
		a: "Absolutely! Images can exist in multiple folders simultaneously without creating duplicates. This means you can cross-reference and categorize freely.",
	},
	{
		q: "Is my content secure?",
		a: "Yes. All images are stored securely on AWS S3 with presigned URLs, meaning your content is only accessible to you and people you explicitly share with.",
	},
	{
		q: "Can I cancel or change my plan anytime?",
		a: "Of course. You can upgrade, downgrade, or cancel your plan at any time from your settings. No long-term contracts or hidden cancellation fees.",
	},
];

function FAQItem({ q, a }: { q: string; a: string }) {
	const [open, setOpen] = useState(false);

	return (
		<div className="border-b border-border/50">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="flex w-full items-center justify-between py-5 text-left"
			>
				<span className="pr-8 text-[15px] font-medium">{q}</span>
				<HugeiconsIcon
					icon={ArrowDown01Icon}
					size={18}
					strokeWidth={2}
					className={cn(
						"shrink-0 text-muted-foreground transition-transform duration-200",
						open && "rotate-180",
					)}
				/>
			</button>
			<div
				className={cn(
					"grid transition-all duration-300",
					open ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]",
				)}
			>
				<div className="overflow-hidden">
					<p className="text-sm leading-relaxed text-muted-foreground">{a}</p>
				</div>
			</div>
		</div>
	);
}

export function FAQSection() {
	return (
		<section
			id="faq"
			className="border-y border-border/50 bg-muted/20 py-24 sm:py-32"
		>
			<div className="mx-auto max-w-3xl px-5 sm:px-8">
				<Reveal className="mb-12 text-center">
					<SectionBadge>FAQ</SectionBadge>
					<h2
						className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl"
						style={GABARITO}
					>
						Frequently Asked Questions
					</h2>
				</Reveal>

				<Reveal>
					<div>
						{FAQ_DATA.map((item) => (
							<FAQItem key={item.q} {...item} />
						))}
					</div>
				</Reveal>
			</div>
		</section>
	);
}

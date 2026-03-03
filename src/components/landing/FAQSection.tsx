import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { useInView } from "@/hooks/use-in-view";
import { FadeIn, GABARITO, SectionBadge } from "./shared";

const FAQS = [
	{
		q: "What is InspoSnaps?",
		a: "InspoSnaps is a private workspace for collecting and organizing visual inspiration. Save images into nested folders, tag them with colors and emojis, and access your collections from any device — without the noise of a social platform.",
	},
	{
		q: "How is InspoSnaps different from Pinterest?",
		a: "Pinterest is a social discovery platform — InspoSnaps is your private workspace. You own your collections, organize them your way with nested folders, and share only what you choose. No algorithms, no ads, no distractions.",
	},
	{
		q: "How does folder organization work?",
		a: "Create unlimited nested folders to mirror the way you think. Assign colors and emojis for quick recognition, drag images between folders, and use the browser extension to save inspiration from anywhere on the web.",
	},
	{
		q: "How does sharing work?",
		a: "Share folders with other InspoSnaps users or generate view-only links for anyone. Your content stays secure and only visible to the people you choose.",
	},
	{
		q: "Can I try InspoSnaps before committing?",
		a: "Every plan comes with a 14-day free trial — no credit card required. You get full access to all features so you can see if InspoSnaps is right for you.",
	},
	{
		q: "Can I cancel my subscription anytime?",
		a: "Yes, cancel anytime with no questions asked. If you cancel during your trial, you won't be charged. We believe in earning your business every month.",
	},
] as const;

export function FAQSection() {
	const { ref, visible } = useInView();

	return (
		<section id="faq" className="py-20 sm:py-28">
			<div className="mx-auto max-w-3xl px-5 sm:px-8">
				<FadeIn>
					<div className="text-center">
						<SectionBadge>FAQ</SectionBadge>
						<h2
							className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]"
							style={GABARITO}
						>
							Frequently asked questions
						</h2>
						<p className="mt-3 text-base text-muted-foreground">
							Find quick answers to the most common questions about InspoSnaps
						</p>
					</div>
				</FadeIn>

				<div ref={ref}>
					<Accordion multiple className="mt-12 space-y-3">
						{FAQS.map((faq, i) => (
							<div
								key={faq.q}
								style={{
									opacity: visible ? 1 : 0,
									transform: visible
										? "translate3d(0,0,0)"
										: "translate3d(0,28px,0)",
									transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms`,
								}}
							>
								<AccordionItem
									value={String(i)}
									className="rounded-xl border border-border/50 bg-card/60 transition-colors hover:border-border"
								>
									<AccordionTrigger className="items-center rounded-xl px-6 py-4.5 hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden">
										<span className="pr-4 text-[14px] font-semibold">
											{faq.q}
										</span>
										<HugeiconsIcon
											icon={Add01Icon}
											className="ml-auto size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-aria-expanded/accordion-trigger:rotate-45"
										/>
									</AccordionTrigger>
									<AccordionContent className="px-6 pb-5 pt-0 text-[14px] leading-relaxed text-muted-foreground">
										{faq.a}
									</AccordionContent>
								</AccordionItem>
							</div>
						))}
					</Accordion>
				</div>
			</div>
		</section>
	);
}

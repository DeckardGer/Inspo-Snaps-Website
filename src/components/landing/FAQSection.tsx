import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { FadeIn, GABARITO, SectionBadge } from "./shared";

const FAQS = [
	{
		q: "Is InspoSnaps really free to use?",
		a: "Yes! Just create a free account and you can store folders and images locally on your device. No credit card required. Upgrade to Pro when you want cloud sync, more storage, and sharing features.",
	},
	{
		q: "How does sharing work?",
		a: "Sharing is available on the Pro plan. You can share folders with other InspoSnaps users — they'll need a free account to view your shared collections. This keeps your content secure and only visible to the people you choose.",
	},
	{
		q: "How is InspoSnaps different from Pinterest?",
		a: "Pinterest is a social discovery platform — InspoSnaps is your private workspace. You own your collections, organize them your way with nested folders, and share only what you choose. No algorithms, no ads, no distractions.",
	},
	{
		q: "Is my data private and secure?",
		a: "Your collections are private by default. On the free plan, everything stays on your device. On Pro, your cloud data is encrypted and securely stored. Only people you explicitly share with can see your folders.",
	},
	{
		q: "Can I cancel my subscription anytime?",
		a: "Yes, cancel anytime with no questions asked. Your data stays accessible on the free plan. We believe in earning your business every month.",
	},
	{
		q: "What happens to my images if I downgrade?",
		a: "Your cloud images remain accessible for download, so you'll never lose anything. Once back on the free plan, your collections continue to work locally on your device. We never delete your data.",
	},
] as const;

export function FAQSection() {
	const [open, setOpen] = useState<Set<number>>(new Set());

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

				<div className="mt-12 space-y-3">
					{FAQS.map((faq, i) => (
						<FadeIn key={faq.q} delay={i * 50}>
							<div className="overflow-hidden rounded-xl border border-border/50 bg-card/60 transition-colors hover:border-border">
								<button
									type="button"
									className="flex w-full items-center justify-between px-6 py-4.5 text-left"
									onClick={() =>
										setOpen((prev) => {
											const next = new Set(prev);
											if (next.has(i)) next.delete(i);
											else next.add(i);
											return next;
										})
									}
								>
									<span className="pr-4 text-[14px] font-semibold">
										{faq.q}
									</span>
									<HugeiconsIcon
										icon={Add01Icon}
										className={cn(
											"size-5 shrink-0 text-muted-foreground transition-transform duration-300",
											open.has(i) && "rotate-45",
										)}
									/>
								</button>

								<div
									className="grid transition-all duration-300 ease-in-out"
									style={{
										gridTemplateRows: open.has(i) ? "1fr" : "0fr",
									}}
								>
									<div className="overflow-hidden">
										<p className="px-6 pb-5 text-[14px] leading-relaxed text-muted-foreground">
											{faq.a}
										</p>
									</div>
								</div>
							</div>
						</FadeIn>
					))}
				</div>
			</div>
		</section>
	);
}

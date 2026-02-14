import { useState } from "react";
import { cn } from "@/lib/utils";
import { Anim, H, Tag } from "./shared";

const FAQS = [
	{
		q: "Is InspoSnaps really free to use?",
		a: "Yes! Our free plan gives you 5 folders and 100 images — plenty to get started. No credit card required. Upgrade to Pro or Team whenever you need more space and features.",
	},
	{
		q: "Can I share folders with people who don't have an account?",
		a: "Absolutely. Generate a share link and anyone can view your collection in a beautiful gallery. For editing access, they'll need a free account.",
	},
	{
		q: "What image formats do you support?",
		a: "We support JPG, PNG, WebP, GIF, SVG, and HEIC. Images are automatically optimized for fast loading while preserving quality.",
	},
	{
		q: "Is my data private and secure?",
		a: "Your collections are private by default. We use enterprise-grade encryption, and your data is stored securely on AWS. Only people you explicitly share with can see your folders.",
	},
	{
		q: "Can I cancel my subscription anytime?",
		a: "Yes, cancel anytime with no questions asked. Your data stays accessible on the free plan. We believe in earning your business every month.",
	},
	{
		q: "Do you offer refunds?",
		a: "Yes. If you're not satisfied within the first 30 days, we'll issue a full refund. Just reach out to our support team.",
	},
] as const;

export function FAQ3() {
	const [open, setOpen] = useState<number | null>(null);

	return (
		<section id="faq" className="py-20 sm:py-28">
			<div className="mx-auto max-w-3xl px-5 sm:px-8">
				<Anim>
					<div className="text-center">
						<Tag>FAQ</Tag>
						<h2
							className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]"
							style={H}
						>
							Frequently asked questions
						</h2>
					</div>
				</Anim>

				<div className="mt-12 space-y-3">
					{FAQS.map((faq, i) => (
						<Anim key={faq.q} delay={i * 50}>
							<div className="overflow-hidden rounded-xl border border-border/50 bg-card/60 transition-colors hover:border-border">
								<button
									type="button"
									className="flex w-full items-center justify-between px-6 py-4.5 text-left"
									onClick={() =>
										setOpen(open === i ? null : i)
									}
								>
									<span className="pr-4 text-[14px] font-semibold">
										{faq.q}
									</span>
									<svg
										className={cn(
											"size-5 shrink-0 text-muted-foreground transition-transform duration-300",
											open === i && "rotate-45",
										)}
										viewBox="0 0 20 20"
										fill="none"
										aria-hidden
									>
										<path
											d="M10 4v12m6-6H4"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
										/>
									</svg>
								</button>

								<div
									className="grid transition-all duration-300 ease-in-out"
									style={{
										gridTemplateRows:
											open === i ? "1fr" : "0fr",
									}}
								>
									<div className="overflow-hidden">
										<p className="px-6 pb-5 text-[14px] leading-relaxed text-muted-foreground">
											{faq.a}
										</p>
									</div>
								</div>
							</div>
						</Anim>
					))}
				</div>
			</div>
		</section>
	);
}

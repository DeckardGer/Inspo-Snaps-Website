import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Nav3 } from "@/components/landing3/Nav3";
import { Hero3 } from "@/components/landing3/Hero3";
import { Ticker3 } from "@/components/landing3/Ticker3";
import { Bento3 } from "@/components/landing3/Bento3";
import { Steps3 } from "@/components/landing3/Steps3";
import { Features3 } from "@/components/landing3/Features3";
import { Pricing3 } from "@/components/landing3/Pricing3";
import { Testimonials3 } from "@/components/landing3/Testimonials3";
import { FAQ3 } from "@/components/landing3/FAQ3";
import { CTA3 } from "@/components/landing3/CTA3";
import { Footer3 } from "@/components/landing3/Footer3";

export const Route = createFileRoute("/landing3")({
	component: Landing3Page,
	head: () => ({
		meta: [
			{ title: "InspoSnaps — Stop Losing Your Best Ideas" },
			{
				name: "description",
				content:
					"Capture, organize, and share your visual inspiration with smart folders, beautiful galleries, and seamless team collaboration. Join 10,000+ creatives.",
			},
		],
	}),
});

function Landing3Page() {
	useEffect(() => {
		document.documentElement.style.scrollBehavior = "smooth";
		return () => {
			document.documentElement.style.scrollBehavior = "";
		};
	}, []);

	return (
		<div className="min-h-svh bg-background text-foreground">
			<style>{`
				@keyframes l3-float-a{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
				@keyframes l3-float-b{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
				@keyframes l3-ticker{from{transform:translateX(0)}to{transform:translateX(calc(-100%/3))}}
				.l3-no-scrollbar::-webkit-scrollbar{display:none}
				.l3-no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
			`}</style>

			<Nav3 />
			<Hero3 />
			<Ticker3 />
			<Bento3 />
			<Steps3 />
			<Features3 />
			<Pricing3 />
			<Testimonials3 />
			<FAQ3 />
			<CTA3 />
			<Footer3 />
		</div>
	);
}

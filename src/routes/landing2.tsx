import { createFileRoute, Link } from "@tanstack/react-router";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/ui/svgs/BrandLogo";
import { cn } from "@/lib/utils";

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

/* ─── Constants ──────────────────────────────────────────────────────────── */

const HEADING_FONT = {
	fontFamily: "'Gabarito Variable', sans-serif",
} as const;

const NAV_LINKS = [
	{ label: "Features", href: "#features" },
	{ label: "How it works", href: "#how-it-works" },
	{ label: "Pricing", href: "#pricing" },
	{ label: "FAQ", href: "#faq" },
];

const HERO_FOLDERS = [
	{ name: "Design Refs", emoji: "🎨", color: "#8b5cf6", images: 24 },
	{ name: "Photography", emoji: "📸", color: "#f43f5e", images: 89 },
	{ name: "Brand Ideas", emoji: "✨", color: "#f59e0b", images: 12 },
	{ name: "UI Patterns", emoji: "🧩", color: "#10b981", images: 56 },
	{ name: "Typography", emoji: "🔤", color: "#6366f1", images: 31 },
	{ name: "Mood Boards", emoji: "🎭", color: "#0ea5e9", images: 47 },
];

const BRAND_NAMES = [
	"Google",
	"Spotify",
	"Figma",
	"Notion",
	"Vercel",
	"Linear",
	"Stripe",
	"Shopify",
];

const TICKER_ITEMS = [
	...BRAND_NAMES.map((name) => ({ key: `a-${name}`, name })),
	...BRAND_NAMES.map((name) => ({ key: `b-${name}`, name })),
	...BRAND_NAMES.map((name) => ({ key: `c-${name}`, name })),
];

const BENEFITS = [
	{
		title: "Smart Folders",
		description:
			"Organize with custom colors, emojis, and infinitely nested hierarchy. Find anything in seconds.",
		icon: "🎨",
		gradient: "from-violet-500/20 to-indigo-500/20",
		large: true,
	},
	{
		title: "Instant Sharing",
		description:
			"Share any collection with a single link. Control access and permissions with ease.",
		icon: "🔗",
		gradient: "from-rose-500/20 to-orange-500/20",
		large: false,
	},
	{
		title: "Team Workspaces",
		description:
			"Collaborate in real-time with shared folders, permissions, and activity feeds.",
		icon: "👥",
		gradient: "from-emerald-500/20 to-teal-500/20",
		large: false,
	},
	{
		title: "Beautiful Gallery",
		description:
			"Every collection looks stunning. Multiple view modes including masonry, grid, and slideshow.",
		icon: "💎",
		gradient: "from-amber-500/20 to-yellow-500/20",
		large: true,
	},
	{
		title: "Cross-Device Sync",
		description:
			"Access your inspiration anywhere — desktop, tablet, or phone. Always in sync.",
		icon: "📱",
		gradient: "from-sky-500/20 to-cyan-500/20",
		large: false,
	},
	{
		title: "Visual Search",
		description:
			"Find images by color, tag, or visual similarity. AI-powered discovery that learns your taste.",
		icon: "🔍",
		gradient: "from-fuchsia-500/20 to-pink-500/20",
		large: true,
	},
];

const STEPS = [
	{
		number: "01",
		title: "Upload",
		description:
			"Drag and drop your images, screenshots, and visual references. All major formats supported.",
	},
	{
		number: "02",
		title: "Organize",
		description:
			"Create folders with custom colors and emojis. Nest them however you like — your system, your rules.",
	},
	{
		number: "03",
		title: "Share",
		description:
			"Generate a link and share with anyone, or invite teammates for real-time collaboration.",
	},
];

const PRICING_PLANS = [
	{
		name: "Free",
		price: "$0",
		period: "forever",
		description: "Perfect for getting started",
		features: [
			"5 folders",
			"100 images",
			"Basic sharing links",
			"1 GB storage",
			"Community support",
		],
		cta: "Get Started",
		popular: false,
	},
	{
		name: "Pro",
		price: "$9",
		period: "/month",
		description: "For serious creatives",
		features: [
			"Unlimited folders",
			"10,000 images",
			"Advanced sharing controls",
			"50 GB storage",
			"Priority support",
			"Analytics dashboard",
			"Custom branding",
		],
		cta: "Start Free Trial",
		popular: true,
	},
	{
		name: "Team",
		price: "$19",
		period: "/member/mo",
		description: "For creative teams",
		features: [
			"Everything in Pro",
			"Team workspaces",
			"Role-based permissions",
			"200 GB storage",
			"Admin dashboard",
			"SSO & security",
			"Dedicated support",
		],
		cta: "Contact Sales",
		popular: false,
	},
];

const TESTIMONIALS = [
	{
		quote:
			"InspoSnaps completely changed how our design team collects references. No more 'where did I save that?' moments.",
		name: "Sarah Chen",
		role: "Design Lead",
		accent: "bg-violet-500",
	},
	{
		quote:
			"I've tried Pinterest, Are.na, and Raindrop. InspoSnaps is the first tool that feels built for actual creative workflows.",
		name: "Marcus Rodriguez",
		role: "Art Director",
		accent: "bg-rose-500",
	},
	{
		quote:
			"The folder system with emojis and colors is genius. My team went from chaos to organized in a single day.",
		name: "Aisha Patel",
		role: "Brand Manager",
		accent: "bg-emerald-500",
	},
	{
		quote:
			"Sharing mood boards with clients used to be painful. Now I just send a link. They love the presentation.",
		name: "Tom Blackwell",
		role: "Photographer",
		accent: "bg-amber-500",
	},
	{
		quote:
			"We switched our entire creative team to InspoSnaps. The collaboration features are exactly what we needed.",
		name: "Nina Kowalski",
		role: "Creative Director",
		accent: "bg-sky-500",
	},
	{
		quote:
			"Finally, a place for all my visual research. Nested folders make it so easy to stay organized across projects.",
		name: "James Okafor",
		role: "UX Researcher",
		accent: "bg-fuchsia-500",
	},
];

const FAQ_ITEMS = [
	{
		question: "Is InspoSnaps really free to use?",
		answer:
			"Yes! Our free plan gives you 5 folders and 100 images — plenty to get started. No credit card required. Upgrade to Pro or Team whenever you need more space and features.",
	},
	{
		question: "Can I share folders with people who don't have an account?",
		answer:
			"Absolutely. Generate a share link and anyone can view your collection in a beautiful gallery. For editing access, they'll need a free account.",
	},
	{
		question: "What image formats do you support?",
		answer:
			"We support JPG, PNG, WebP, GIF, SVG, and HEIC. Images are automatically optimized for fast loading while preserving quality.",
	},
	{
		question: "Is my data private and secure?",
		answer:
			"Your collections are private by default. We use enterprise-grade encryption, and your data is stored securely on AWS. Only people you explicitly share with can see your folders.",
	},
	{
		question: "Can I cancel my subscription anytime?",
		answer:
			"Yes, cancel anytime with no questions asked. Your data stays accessible on the free plan. We believe in earning your business every month.",
	},
	{
		question: "Do you offer refunds?",
		answer:
			"Yes. If you're not satisfied within the first 30 days, we'll issue a full refund. Just reach out to our support team.",
	},
];

/* ─── Hooks ──────────────────────────────────────────────────────────────── */

function useScrollReveal(threshold = 0.12) {
	const ref = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const obs = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true);
					obs.unobserve(el);
				}
			},
			{ threshold },
		);
		obs.observe(el);
		return () => obs.disconnect();
	}, [threshold]);

	return { ref, visible };
}

function useScrolled(offset = 20) {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > offset);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [offset]);

	return scrolled;
}

function useCountUp(target: number, decimals = 0) {
	const [value, setValue] = useState(0);
	const { ref, visible } = useScrollReveal(0.3);
	const animated = useRef(false);

	useEffect(() => {
		if (!visible || animated.current) return;
		animated.current = true;
		const duration = 2000;
		const start = performance.now();

		const tick = (now: number) => {
			const t = Math.min((now - start) / duration, 1);
			const eased = 1 - (1 - t) ** 3;
			setValue(Number.parseFloat((eased * target).toFixed(decimals)));
			if (t < 1) requestAnimationFrame(tick);
		};
		requestAnimationFrame(tick);
	}, [visible, target, decimals]);

	return { ref, value };
}

/* ─── Shared Components ──────────────────────────────────────────────────── */

function FadeIn({
	children,
	className,
	delay = 0,
	direction = "up",
}: {
	children: ReactNode;
	className?: string;
	delay?: number;
	direction?: "up" | "down" | "left" | "right" | "none";
}) {
	const { ref, visible } = useScrollReveal();

	const offsets: Record<string, string> = {
		up: "translate3d(0,28px,0)",
		down: "translate3d(0,-28px,0)",
		left: "translate3d(28px,0,0)",
		right: "translate3d(-28px,0,0)",
		none: "translate3d(0,0,0)",
	};

	return (
		<div
			ref={ref}
			className={className}
			style={{
				opacity: visible ? 1 : 0,
				transform: visible ? "translate3d(0,0,0)" : offsets[direction],
				transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
			}}
		>
			{children}
		</div>
	);
}

function SectionLabel({ children }: { children: ReactNode }) {
	return (
		<p className="text-[12px] font-semibold tracking-[0.15em] text-primary uppercase">
			{children}
		</p>
	);
}

function ArrowIcon({ className }: { className?: string }) {
	return (
		<svg
			className={cn("size-4", className)}
			viewBox="0 0 16 16"
			fill="none"
			aria-hidden
		>
			<title>Arrow</title>
			<path
				d="M3 8h10m0 0l-4-4m4 4l-4 4"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function CheckIcon({ className }: { className?: string }) {
	return (
		<svg
			className={cn("size-4 shrink-0 text-primary", className)}
			viewBox="0 0 16 16"
			fill="none"
			aria-hidden
		>
			<title>Check</title>
			<path
				d="M13 4.5L6.5 11 3 7.5"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

/* ─── Navbar ─────────────────────────────────────────────────────────────── */

function Navbar2() {
	const scrolled = useScrolled();
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<nav
			className={cn(
				"fixed top-0 right-0 left-0 z-50 transition-all duration-300",
				scrolled
					? "border-b border-border/50 bg-background/80 shadow-xs backdrop-blur-xl"
					: "bg-transparent",
			)}
		>
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
				<a href="/landing2" className="flex items-center gap-2.5">
					<BrandLogo size={26} />
					<span
						className="text-[17px] font-bold tracking-tight"
						style={HEADING_FONT}
					>
						InspoSnaps
					</span>
				</a>

				<div className="hidden items-center gap-8 md:flex">
					{NAV_LINKS.map((link) => (
						<a
							key={link.href}
							href={link.href}
							className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
						>
							{link.label}
						</a>
					))}
				</div>

				<div className="hidden items-center gap-3 md:flex">
					<Link
						to="/login"
						className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
					>
						Log in
					</Link>
					<Link
						to="/signup"
						className="rounded-lg bg-foreground px-4 py-2 text-[13px] font-semibold text-background transition-opacity hover:opacity-90"
					>
						Get Started
					</Link>
				</div>

				{/* Mobile hamburger */}
				<button
					type="button"
					className="flex size-9 items-center justify-center rounded-md md:hidden"
					onClick={() => setMenuOpen(!menuOpen)}
					aria-label="Toggle menu"
				>
					<div className="relative h-4 w-5">
						<span
							className={cn(
								"absolute left-0 h-[2px] w-5 rounded-full bg-foreground transition-all duration-300",
								menuOpen ? "top-[7px] rotate-45" : "top-0",
							)}
						/>
						<span
							className={cn(
								"absolute left-0 top-[7px] h-[2px] w-5 rounded-full bg-foreground transition-all duration-300",
								menuOpen ? "-rotate-45" : "",
							)}
						/>
						<span
							className={cn(
								"absolute bottom-0 left-0 h-[2px] w-5 rounded-full bg-foreground transition-all duration-300",
								menuOpen ? "opacity-0" : "opacity-100",
							)}
						/>
					</div>
				</button>
			</div>

			{/* Mobile menu */}
			<div
				className={cn(
					"overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-xl transition-all duration-300 md:hidden",
					menuOpen ? "max-h-80" : "max-h-0 border-t-0",
				)}
			>
				<div className="px-5 pb-5 pt-2">
					{NAV_LINKS.map((link) => (
						<a
							key={link.href}
							href={link.href}
							className="block py-2.5 text-[15px] font-medium text-muted-foreground"
							onClick={() => setMenuOpen(false)}
						>
							{link.label}
						</a>
					))}
					<div className="mt-4 flex flex-col gap-2">
						<Link
							to="/login"
							className="py-2 text-center text-[15px] font-medium text-muted-foreground"
						>
							Log in
						</Link>
						<Link
							to="/signup"
							className="rounded-lg bg-foreground py-2.5 text-center text-[15px] font-semibold text-background"
						>
							Get Started
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */

function HeroSection2() {
	return (
		<section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
			{/* Aurora mesh gradient */}
			<div className="pointer-events-none absolute inset-0" aria-hidden>
				<div className="absolute -top-[300px] left-[10%] h-[700px] w-[700px] rounded-full bg-[#fecdd3]/25 blur-[120px] dark:bg-[#fecdd3]/[0.06]" />
				<div className="absolute -top-[200px] right-[15%] h-[600px] w-[600px] rounded-full bg-[#c4b5fd]/20 blur-[100px] dark:bg-[#c4b5fd]/[0.05]" />
				<div className="absolute top-[100px] left-[40%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#fed7aa]/18 blur-[110px] dark:bg-[#fed7aa]/[0.04]" />
				<div className="absolute top-[350px] right-[5%] h-[400px] w-[400px] rounded-full bg-[#bfdbfe]/12 blur-[90px] dark:bg-[#bfdbfe]/[0.03]" />
			</div>

			{/* Grid pattern */}
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.035]"
				aria-hidden
				style={{
					backgroundImage:
						"linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
					backgroundSize: "64px 64px",
				}}
			/>

			<div className="relative mx-auto max-w-6xl px-5 sm:px-8">
				<div className="mx-auto max-w-3xl text-center">
					{/* Social proof pill */}
					<FadeIn>
						<div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-border/60 bg-card/70 px-4 py-1.5 text-[12px] font-medium text-muted-foreground shadow-xs backdrop-blur-sm">
							<span className="relative flex size-2">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
								<span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
							</span>
							Loved by 10,000+ creatives worldwide
						</div>
					</FadeIn>

					{/* Headline */}
					<FadeIn delay={80}>
						<h1
							className="text-[2.5rem] leading-[1.08] font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-[4.25rem]"
							style={HEADING_FONT}
						>
							Your Inspiration
							<br />
							<span className="relative">
								Deserves Better Than{" "}
								<span className="bg-gradient-to-r from-[#f43f5e] via-[#8b5cf6] to-[#3b82f6] bg-clip-text text-transparent">
									Bookmarks
								</span>
								<svg
									className="absolute -bottom-1.5 left-0 w-full"
									viewBox="0 0 400 10"
									fill="none"
									aria-hidden
									preserveAspectRatio="none"
								>
									<title>Underline</title>
									<path
										d="M4 7C100 3 300 3 396 7"
										stroke="url(#hero-underline)"
										strokeWidth="3"
										strokeLinecap="round"
									/>
									<defs>
										<linearGradient
											id="hero-underline"
											x1="0"
											y1="0"
											x2="400"
											y2="0"
											gradientUnits="userSpaceOnUse"
										>
											<stop stopColor="#f43f5e" />
											<stop offset="0.5" stopColor="#8b5cf6" />
											<stop offset="1" stopColor="#3b82f6" />
										</linearGradient>
									</defs>
								</svg>
							</span>
						</h1>
					</FadeIn>

					{/* Subtitle */}
					<FadeIn delay={160}>
						<p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
							Stop losing creative references in cluttered folders and forgotten
							tabs. Organize, curate, and share visual inspiration in beautiful
							collections.
						</p>
					</FadeIn>

					{/* CTAs */}
					<FadeIn delay={240}>
						<div className="mt-9 flex flex-wrap items-center justify-center gap-4">
							<Link
								to="/signup"
								className="inline-flex items-center gap-2.5 rounded-xl bg-foreground px-7 py-3.5 text-[15px] font-semibold text-background shadow-lg transition-all hover:shadow-xl hover:opacity-90"
							>
								Start Free
								<ArrowIcon />
							</Link>
							<a
								href="#how-it-works"
								className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/50 px-7 py-3.5 text-[15px] font-medium text-muted-foreground backdrop-blur-sm transition-colors hover:bg-card hover:text-foreground"
							>
								See How It Works
							</a>
						</div>
					</FadeIn>
				</div>

				{/* App mockup */}
				<FadeIn delay={380} className="mt-16 sm:mt-20">
					<div className="relative mx-auto max-w-4xl">
						{/* Glow behind mockup */}
						<div
							className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-[#8b5cf6]/15 via-[#6366f1]/8 to-[#3b82f6]/10 blur-3xl dark:from-[#8b5cf6]/8 dark:via-[#6366f1]/4 dark:to-[#3b82f6]/5"
							aria-hidden
						/>

						<div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl shadow-black/[0.06] dark:shadow-black/25">
							{/* Title bar */}
							<div className="flex items-center gap-2 border-b border-border/40 bg-muted/30 px-4 py-2.5">
								<div className="flex gap-[6px]">
									<div className="size-[10px] rounded-full bg-[#ff5f57]/80" />
									<div className="size-[10px] rounded-full bg-[#febc2e]/80" />
									<div className="size-[10px] rounded-full bg-[#28c840]/80" />
								</div>
								<div className="flex-1 text-center">
									<div className="mx-auto w-52 rounded-md bg-muted/60 px-3 py-1 text-[11px] text-muted-foreground/50">
										app.insposnaps.com
									</div>
								</div>
								<div className="w-12" />
							</div>

							{/* App content */}
							<div className="flex min-h-[280px] sm:min-h-[320px]">
								{/* Sidebar */}
								<div className="hidden w-44 shrink-0 border-r border-border/30 bg-muted/15 px-3 py-4 sm:block">
									<div className="mb-4 flex items-center gap-2 px-2">
										<BrandLogo size={14} />
										<span
											className="text-[10px] font-bold"
											style={HEADING_FONT}
										>
											InspoSnaps
										</span>
									</div>
									{[
										"My Folders",
										"Shared With Me",
										"Team Folders",
										"Favourites",
									].map((item, i) => (
										<div
											key={item}
											className={cn(
												"rounded-md px-2.5 py-[5px] text-[10px]",
												i === 0
													? "bg-primary/10 font-semibold text-primary"
													: "text-muted-foreground/50",
											)}
										>
											{item}
										</div>
									))}
								</div>

								{/* Folder grid */}
								<div className="flex-1 p-4 sm:p-5">
									<div className="mb-3 flex items-center justify-between">
										<span className="text-[11px] font-semibold text-foreground/60">
											My Folders
										</span>
										<div className="rounded-md bg-primary/10 px-2 py-0.5 text-[9px] font-semibold text-primary">
											+ New Folder
										</div>
									</div>
									<div className="grid grid-cols-3 gap-2 sm:gap-2.5">
										{HERO_FOLDERS.map((folder) => (
											<div
												key={folder.name}
												className="group overflow-hidden rounded-lg border border-border/30 bg-background/70 transition-all hover:border-border/60 hover:shadow-sm"
											>
												<div
													className="h-[3px]"
													style={{ backgroundColor: folder.color }}
												/>
												<div className="p-2 sm:p-2.5">
													<span className="text-sm leading-none">
														{folder.emoji}
													</span>
													<p className="mt-1 truncate text-[9px] font-semibold leading-tight sm:text-[10px]">
														{folder.name}
													</p>
													<p className="text-[8px] text-muted-foreground/50 sm:text-[9px]">
														{folder.images} images
													</p>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>

						{/* Shadow below */}
						<div
							className="absolute -bottom-6 left-1/2 h-12 w-4/5 -translate-x-1/2 rounded-full bg-black/[0.04] blur-2xl dark:bg-white/[0.03]"
							aria-hidden
						/>
					</div>
				</FadeIn>
			</div>
		</section>
	);
}

/* ─── Logo Ticker ────────────────────────────────────────────────────────── */

function LogoTicker() {
	return (
		<section className="border-y border-border/40 py-10">
			<p className="mb-6 text-center text-[11px] font-medium tracking-[0.2em] text-muted-foreground/50 uppercase">
				Trusted by creative teams at
			</p>
			<div className="relative overflow-hidden">
				<div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
				<div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

				<div
					className="flex w-max gap-14"
					style={{
						animation: "landing2-ticker 28s linear infinite",
					}}
				>
					{TICKER_ITEMS.map((item) => (
						<span
							key={item.key}
							className="shrink-0 text-[17px] font-bold tracking-tight text-muted-foreground/25 dark:text-muted-foreground/15 select-none"
							style={HEADING_FONT}
						>
							{item.name}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}

/* ─── Stats ──────────────────────────────────────────────────────────────── */

function StatItem({
	target,
	suffix,
	label,
	decimals = 0,
}: {
	target: number;
	suffix: string;
	label: string;
	decimals?: number;
}) {
	const { ref, value } = useCountUp(target, decimals);

	const display = decimals
		? value.toFixed(decimals)
		: String(Math.round(value));

	return (
		<div ref={ref} className="text-center">
			<div
				className="text-3xl font-bold tracking-tight sm:text-4xl"
				style={HEADING_FONT}
			>
				{display}
				{suffix}
			</div>
			<p className="mt-1.5 text-[12px] font-medium text-muted-foreground">
				{label}
			</p>
		</div>
	);
}

function StatsSection() {
	return (
		<section className="py-14 sm:py-20">
			<div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-5 sm:grid-cols-4 sm:px-8">
				<StatItem target={50} suffix="K+" label="Folders Created" />
				<StatItem target={1} suffix="M+" label="Images Organized" />
				<StatItem target={120} suffix="+" label="Countries" />
				<StatItem target={4.9} suffix=" ★" label="User Rating" decimals={1} />
			</div>
		</section>
	);
}

/* ─── Benefits Bento ─────────────────────────────────────────────────────── */

function BentoFeatures() {
	return (
		<section id="features" className="relative py-20 sm:py-28">
			<div
				className="pointer-events-none absolute inset-0 overflow-hidden"
				aria-hidden
			>
				<div className="absolute top-1/2 left-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.025] blur-[100px]" />
			</div>

			<div className="relative mx-auto max-w-6xl px-5 sm:px-8">
				<FadeIn>
					<div className="mx-auto max-w-2xl text-center">
						<SectionLabel>Features</SectionLabel>
						<h2
							className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
							style={HEADING_FONT}
						>
							Everything you need to stay inspired
						</h2>
						<p className="mt-4 text-base text-muted-foreground sm:text-lg">
							Powerful tools that make organizing visual inspiration feel
							effortless.
						</p>
					</div>
				</FadeIn>

				<div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{BENEFITS.map((item, i) => (
						<FadeIn
							key={item.title}
							delay={i * 70}
							className={cn(item.large && "lg:col-span-2")}
						>
							<div className="group relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-lg sm:p-8">
								{/* Gradient accent */}
								<div
									className={cn(
										"absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-70",
										item.gradient,
									)}
									aria-hidden
								/>

								<div className="relative">
									<span className="text-3xl">{item.icon}</span>
									<h3
										className="mt-4 text-lg font-bold"
										style={HEADING_FONT}
									>
										{item.title}
									</h3>
									<p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
										{item.description}
									</p>
								</div>
							</div>
						</FadeIn>
					))}
				</div>
			</div>
		</section>
	);
}

/* ─── How It Works ───────────────────────────────────────────────────────── */

function HowItWorks2() {
	return (
		<section id="how-it-works" className="py-20 sm:py-28">
			<div className="mx-auto max-w-6xl px-5 sm:px-8">
				<FadeIn>
					<div className="mx-auto max-w-2xl text-center">
						<SectionLabel>How it works</SectionLabel>
						<h2
							className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
							style={HEADING_FONT}
						>
							Get started in 3 simple steps
						</h2>
					</div>
				</FadeIn>

				<div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
					{STEPS.map((step, i) => (
						<FadeIn key={step.number} delay={i * 120}>
							<div className="relative text-center md:text-left">
								{/* Dashed connector (desktop) */}
								{i < STEPS.length - 1 && (
									<div
										className="pointer-events-none absolute top-8 left-[calc(50%+48px)] hidden h-px w-[calc(100%-96px)] md:block"
										aria-hidden
									>
										<div className="h-full w-full border-t-2 border-dashed border-border/50" />
									</div>
								)}

								<div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/8 ring-1 ring-primary/15 md:mx-0">
									<span
										className="text-xl font-bold text-primary"
										style={HEADING_FONT}
									>
										{step.number}
									</span>
								</div>
								<h3
									className="mt-5 text-xl font-bold"
									style={HEADING_FONT}
								>
									{step.title}
								</h3>
								<p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
									{step.description}
								</p>
							</div>
						</FadeIn>
					))}
				</div>
			</div>
		</section>
	);
}

/* ─── Pricing ────────────────────────────────────────────────────────────── */

function PricingSection2() {
	return (
		<section id="pricing" className="relative py-20 sm:py-28">
			{/* Soft gradient behind pricing */}
			<div
				className="pointer-events-none absolute inset-0 overflow-hidden"
				aria-hidden
			>
				<div className="absolute top-0 left-[20%] h-[500px] w-[500px] rounded-full bg-[#c4b5fd]/8 blur-[120px] dark:bg-[#c4b5fd]/[0.03]" />
				<div className="absolute bottom-0 right-[20%] h-[400px] w-[400px] rounded-full bg-[#fecdd3]/8 blur-[100px] dark:bg-[#fecdd3]/[0.025]" />
			</div>

			<div className="relative mx-auto max-w-6xl px-5 sm:px-8">
				<FadeIn>
					<div className="mx-auto max-w-2xl text-center">
						<SectionLabel>Pricing</SectionLabel>
						<h2
							className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
							style={HEADING_FONT}
						>
							Simple, transparent pricing
						</h2>
						<p className="mt-4 text-base text-muted-foreground sm:text-lg">
							Start free. Upgrade when you need more. No hidden fees, ever.
						</p>
					</div>
				</FadeIn>

				<div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
					{PRICING_PLANS.map((plan, i) => (
						<FadeIn key={plan.name} delay={i * 100}>
							<div
								className={cn(
									"relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 sm:p-8",
									plan.popular
										? "border-primary/30 bg-card shadow-xl shadow-primary/[0.06] dark:shadow-primary/[0.12]"
										: "border-border/50 bg-card/60 hover:border-border hover:shadow-md",
								)}
							>
								{plan.popular && (
									<div className="absolute -top-3 right-6 rounded-full bg-primary px-3.5 py-1 text-[11px] font-semibold text-primary-foreground">
										Most Popular
									</div>
								)}

								<div>
									<p className="text-[13px] font-semibold text-muted-foreground">
										{plan.name}
									</p>
									<div className="mt-3 flex items-baseline gap-1">
										<span
											className="text-4xl font-bold tracking-tight"
											style={HEADING_FONT}
										>
											{plan.price}
										</span>
										<span className="text-sm text-muted-foreground">
											{plan.period}
										</span>
									</div>
									<p className="mt-2 text-[13px] text-muted-foreground">
										{plan.description}
									</p>
								</div>

								<Link
									to="/signup"
									className={cn(
										"mt-6 block w-full rounded-xl py-3 text-center text-[14px] font-semibold transition-all",
										plan.popular
											? "bg-foreground text-background hover:opacity-90"
											: "border border-border bg-background text-foreground hover:bg-muted",
									)}
								>
									{plan.cta}
								</Link>

								<ul className="mt-6 flex-1 space-y-3">
									{plan.features.map((feature) => (
										<li
											key={feature}
											className="flex items-start gap-2.5 text-[13px] text-muted-foreground"
										>
											<CheckIcon className="mt-0.5" />
											{feature}
										</li>
									))}
								</ul>
							</div>
						</FadeIn>
					))}
				</div>
			</div>
		</section>
	);
}

/* ─── Testimonials ───────────────────────────────────────────────────────── */

function Testimonials2() {
	return (
		<section className="py-20 sm:py-28">
			<div className="mx-auto max-w-6xl px-5 sm:px-8">
				<FadeIn>
					<div className="mx-auto max-w-2xl text-center">
						<SectionLabel>Testimonials</SectionLabel>
						<h2
							className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
							style={HEADING_FONT}
						>
							Loved by creatives worldwide
						</h2>
					</div>
				</FadeIn>

				<div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{TESTIMONIALS.map((t, i) => (
						<FadeIn key={t.name} delay={i * 70}>
							<div className="relative h-full rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-md">
								{/* Colored accent */}
								<div
									className={cn(
										"absolute top-0 left-6 h-[3px] w-10 rounded-b-full",
										t.accent,
									)}
								/>

								{/* Stars */}
								<div className="mb-3 text-[13px] tracking-wide text-amber-400">
									{"★★★★★"}
								</div>

								<p className="text-[14px] leading-relaxed text-foreground/80">
									"{t.quote}"
								</p>

								<div className="mt-5 flex items-center gap-3">
									<div
										className={cn(
											"flex size-9 items-center justify-center rounded-full text-[11px] font-bold text-white",
											t.accent,
										)}
									>
										{t.name
											.split(" ")
											.map((n) => n[0])
											.join("")}
									</div>
									<div>
										<p className="text-[13px] font-semibold">{t.name}</p>
										<p className="text-[11px] text-muted-foreground">
											{t.role}
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

/* ─── FAQ ─────────────────────────────────────────────────────────────────── */

function FAQSection2() {
	const [open, setOpen] = useState<number | null>(null);

	return (
		<section id="faq" className="py-20 sm:py-28">
			<div className="mx-auto max-w-3xl px-5 sm:px-8">
				<FadeIn>
					<div className="text-center">
						<SectionLabel>FAQ</SectionLabel>
						<h2
							className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
							style={HEADING_FONT}
						>
							Frequently Asked Questions
						</h2>
					</div>
				</FadeIn>

				<div className="mt-12 space-y-3">
					{FAQ_ITEMS.map((faq, i) => (
						<FadeIn key={faq.question} delay={i * 50}>
							<div className="overflow-hidden rounded-xl border border-border/50 bg-card/60 transition-colors hover:border-border">
								<button
									type="button"
									className="flex w-full items-center justify-between px-6 py-4.5 text-left"
									onClick={() => setOpen(open === i ? null : i)}
								>
									<span className="pr-4 text-[14px] font-semibold">
										{faq.question}
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
										<title>Toggle</title>
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
										gridTemplateRows: open === i ? "1fr" : "0fr",
									}}
								>
									<div className="overflow-hidden">
										<p className="px-6 pb-5 text-[14px] leading-relaxed text-muted-foreground">
											{faq.answer}
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

/* ─── Final CTA ──────────────────────────────────────────────────────────── */

function FinalCTA2() {
	return (
		<section className="px-5 pb-20 sm:px-8 sm:pb-28">
			<FadeIn>
				<div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-foreground px-8 py-16 text-center text-background sm:px-16 sm:py-20">
					{/* Decorative blobs */}
					<div
						className="pointer-events-none absolute inset-0"
						aria-hidden
					>
						<div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-[80px]" />
						<div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-[#f43f5e]/15 blur-[80px]" />
						<div className="absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3b82f6]/10 blur-[60px]" />
					</div>

					<div className="relative">
						<h2
							className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
							style={HEADING_FONT}
						>
							Ready to organize your
							<br className="hidden sm:block" /> inspiration?
						</h2>
						<p className="mx-auto mt-4 max-w-md text-base text-background/50">
							Join 10,000+ creatives who trust InspoSnaps to keep their visual
							inspiration organized and accessible.
						</p>
						<div className="mt-8">
							<Link
								to="/signup"
								className="inline-flex items-center gap-2.5 rounded-xl bg-background px-8 py-3.5 text-[15px] font-semibold text-foreground shadow-lg transition-all hover:shadow-xl hover:opacity-90"
							>
								Get Started Free
								<ArrowIcon />
							</Link>
						</div>
						<p className="mt-4 text-[12px] text-background/35">
							No credit card required. Free plan available forever.
						</p>
					</div>
				</div>
			</FadeIn>
		</section>
	);
}

/* ─── Footer ─────────────────────────────────────────────────────────────── */

function Footer2() {
	const columns = [
		{
			title: "Product",
			links: [
				{ label: "Features", href: "#features" },
				{ label: "Pricing", href: "#pricing" },
				{ label: "Changelog", href: "#" },
				{ label: "Documentation", href: "#" },
			],
		},
		{
			title: "Company",
			links: [
				{ label: "About", href: "#" },
				{ label: "Blog", href: "#" },
				{ label: "Careers", href: "#" },
				{ label: "Contact", href: "#" },
			],
		},
		{
			title: "Legal",
			links: [
				{ label: "Privacy", href: "#" },
				{ label: "Terms", href: "#" },
				{ label: "Cookies", href: "#" },
			],
		},
	];

	return (
		<footer className="border-t border-border/40">
			<div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
				<div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
					{/* Brand */}
					<div className="lg:col-span-2">
						<div className="flex items-center gap-2.5">
							<BrandLogo size={22} />
							<span
								className="text-[17px] font-bold tracking-tight"
								style={HEADING_FONT}
							>
								InspoSnaps
							</span>
						</div>
						<p className="mt-3 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
							Your visual inspiration, organized beautifully. Save, curate, and
							share creative collections with anyone.
						</p>
						<div className="mt-5 flex gap-3">
							<a
								href="https://twitter.com"
								className="flex size-9 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
								aria-label="Twitter"
								target="_blank"
								rel="noopener noreferrer"
							>
								<svg
									className="size-4"
									viewBox="0 0 24 24"
									fill="currentColor"
									aria-hidden
								>
									<title>Twitter</title>
									<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
								</svg>
							</a>
							<a
								href="https://github.com"
								className="flex size-9 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
								aria-label="GitHub"
								target="_blank"
								rel="noopener noreferrer"
							>
								<svg
									className="size-4"
									viewBox="0 0 24 24"
									fill="currentColor"
									aria-hidden
								>
									<title>GitHub</title>
									<path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
								</svg>
							</a>
						</div>
					</div>

					{columns.map((col) => (
						<div key={col.title}>
							<h4 className="text-[13px] font-semibold">{col.title}</h4>
							<ul className="mt-4 space-y-2.5">
								{col.links.map((link) => (
									<li key={link.label}>
										<a
											href={link.href}
											className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
										>
											{link.label}
										</a>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="mt-12 border-t border-border/40 pt-6 text-[12px] text-muted-foreground/50">
					&copy; {new Date().getFullYear()} InspoSnaps. All rights reserved.
				</div>
			</div>
		</footer>
	);
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */

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

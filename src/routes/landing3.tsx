import { createFileRoute, Link } from "@tanstack/react-router";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/ui/svgs/BrandLogo";
import { cn } from "@/lib/utils";

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

/* ─── Constants ──────────────────────────────────────────────────────── */

const H = { fontFamily: "'Gabarito Variable', sans-serif" } as const;

const NAV_LINKS = [
	{ label: "Features", href: "#features" },
	{ label: "How it works", href: "#how-it-works" },
	{ label: "Pricing", href: "#pricing" },
	{ label: "FAQ", href: "#faq" },
] as const;

const FLOATING_FOLDERS = [
	{ name: "Design Refs", emoji: "🎨", color: "#8b5cf6", count: 24, top: "4%", left: "6%", rot: -5, z: 3, w: 152, delay: 0 },
	{ name: "Photography", emoji: "📸", color: "#f43f5e", count: 89, top: "1%", left: "56%", rot: 3, z: 4, w: 148, delay: 0.4 },
	{ name: "Brand Ideas", emoji: "✨", color: "#f59e0b", count: 12, top: "36%", left: "2%", rot: -3, z: 2, w: 140, delay: 0.8 },
	{ name: "UI Patterns", emoji: "🧩", color: "#10b981", count: 56, top: "32%", left: "50%", rot: 4, z: 5, w: 156, delay: 1.2 },
	{ name: "Typography", emoji: "🔤", color: "#6366f1", count: 31, top: "64%", left: "12%", rot: -2, z: 1, w: 144, delay: 0.6 },
	{ name: "Mood Boards", emoji: "🎭", color: "#0ea5e9", count: 47, top: "60%", left: "58%", rot: 2, z: 3, w: 136, delay: 1.0 },
] as const;

const BRAND_NAMES = [
	"Google", "Spotify", "Figma", "Notion",
	"Vercel", "Linear", "Stripe", "Shopify",
] as const;

const BENEFITS = [
	{
		title: "Smart Folders",
		desc: "Organize with custom colors, emojis, and infinitely nested folders. Your system, your way.",
		icon: "📂",
		accent: "from-violet-500/20 to-indigo-500/10",
		span: 2,
	},
	{
		title: "One-Click Sharing",
		desc: "Generate a link and share any collection instantly. Control who sees what.",
		icon: "🔗",
		accent: "from-rose-500/20 to-orange-400/10",
		span: 1,
	},
	{
		title: "Team Workspaces",
		desc: "Collaborate in real-time with shared folders, permissions, and activity tracking.",
		icon: "👥",
		accent: "from-emerald-500/20 to-teal-400/10",
		span: 1,
	},
	{
		title: "Beautiful Gallery",
		desc: "Every collection looks stunning with masonry, grid, and slideshow view modes.",
		icon: "💎",
		accent: "from-amber-500/20 to-yellow-400/10",
		span: 2,
	},
	{
		title: "Works Everywhere",
		desc: "Desktop, tablet, or phone — your collections stay in sync across every device.",
		icon: "📱",
		accent: "from-sky-500/20 to-cyan-400/10",
		span: 1,
	},
	{
		title: "Visual Search",
		desc: "Find images by color, tag, or visual similarity. AI-powered discovery that learns your taste.",
		icon: "🔍",
		accent: "from-pink-500/20 to-fuchsia-400/10",
		span: 2,
	},
] as const;

const STEPS = [
	{
		num: "01",
		title: "Upload",
		desc: "Drag and drop images, screenshots, or visual references. All major formats supported.",
	},
	{
		num: "02",
		title: "Organize",
		desc: "Create color-coded folders with emojis. Nest them however you like — it's your system.",
	},
	{
		num: "03",
		title: "Share",
		desc: "Send a link to anyone, or invite teammates for real-time collaboration on collections.",
	},
] as const;

const PLANS = [
	{
		name: "Free",
		price: "$0",
		period: "forever",
		desc: "Get started and explore",
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
		desc: "For serious creatives",
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
		desc: "For creative teams",
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
] as const;

const TESTIMONIALS = [
	{
		quote: "InspoSnaps completely changed how our design team collects references. No more 'where did I save that?' moments.",
		name: "Sarah Chen",
		role: "Design Lead",
		color: "#8b5cf6",
	},
	{
		quote: "I've tried Pinterest, Are.na, and Raindrop. InspoSnaps is the first tool that feels built for actual creative workflows.",
		name: "Marcus Rodriguez",
		role: "Art Director",
		color: "#f43f5e",
	},
	{
		quote: "The folder system with emojis and colors is genius. My team went from chaos to organized in a single afternoon.",
		name: "Aisha Patel",
		role: "Brand Manager",
		color: "#10b981",
	},
	{
		quote: "Sharing mood boards with clients used to be painful. Now I just send a link and they love the presentation.",
		name: "Tom Blackwell",
		role: "Photographer",
		color: "#f59e0b",
	},
	{
		quote: "We switched our entire creative team to InspoSnaps. The collaboration features are exactly what we needed.",
		name: "Nina Kowalski",
		role: "Creative Director",
		color: "#0ea5e9",
	},
	{
		quote: "Finally, a place for all my visual research. Nested folders make it easy to stay organized across projects.",
		name: "James Okafor",
		role: "UX Researcher",
		color: "#ec4899",
	},
] as const;

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

/* ─── Hooks ──────────────────────────────────────────────────────────── */

function useReveal(threshold = 0.12) {
	const ref = useRef<HTMLDivElement>(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const obs = new IntersectionObserver(
			([e]) => {
				if (e.isIntersecting) {
					setVis(true);
					obs.unobserve(el);
				}
			},
			{ threshold },
		);
		obs.observe(el);
		return () => obs.disconnect();
	}, [threshold]);
	return { ref, vis };
}

function useScrolled(offset = 20) {
	const [s, setS] = useState(false);
	useEffect(() => {
		const fn = () => setS(window.scrollY > offset);
		fn();
		window.addEventListener("scroll", fn, { passive: true });
		return () => window.removeEventListener("scroll", fn);
	}, [offset]);
	return s;
}

/* ─── Shared primitives ──────────────────────────────────────────────── */

function Anim({
	children,
	className,
	delay = 0,
}: {
	children: ReactNode;
	className?: string;
	delay?: number;
}) {
	const { ref, vis } = useReveal();
	return (
		<div
			ref={ref}
			className={className}
			style={{
				opacity: vis ? 1 : 0,
				transform: vis ? "translate3d(0,0,0)" : "translate3d(0,32px,0)",
				transition: `opacity .7s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .7s cubic-bezier(.16,1,.3,1) ${delay}ms`,
			}}
		>
			{children}
		</div>
	);
}

function Tag({ children }: { children: ReactNode }) {
	return (
		<span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/[0.05] px-3.5 py-1 text-[11px] font-semibold tracking-[0.08em] text-primary uppercase">
			{children}
		</span>
	);
}

function ArrowSvg({ className }: { className?: string }) {
	return (
		<svg
			className={cn("size-4", className)}
			viewBox="0 0 16 16"
			fill="none"
			aria-hidden
		>
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

function TickSvg({ className }: { className?: string }) {
	return (
		<svg
			className={cn("size-4 shrink-0 text-primary", className)}
			viewBox="0 0 16 16"
			fill="none"
			aria-hidden
		>
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

/* ─── Navbar ─────────────────────────────────────────────────────────── */

function Nav3() {
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
				<a href="/landing3" className="flex items-center gap-2.5">
					<BrandLogo size={26} />
					<span
						className="text-[17px] font-bold tracking-tight"
						style={H}
					>
						InspoSnaps
					</span>
				</a>

				<div className="hidden items-center gap-8 md:flex">
					{NAV_LINKS.map((l) => (
						<a
							key={l.href}
							href={l.href}
							className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
						>
							{l.label}
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
						className="rounded-full bg-foreground px-5 py-2 text-[13px] font-semibold text-background transition-opacity hover:opacity-90"
					>
						Get Started
					</Link>
				</div>

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
								menuOpen && "-rotate-45",
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

			<div
				className={cn(
					"overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-xl transition-all duration-300 md:hidden",
					menuOpen ? "max-h-80" : "max-h-0 border-t-0",
				)}
			>
				<div className="px-5 pb-5 pt-2">
					{NAV_LINKS.map((l) => (
						<a
							key={l.href}
							href={l.href}
							className="block py-2.5 text-[15px] font-medium text-muted-foreground"
							onClick={() => setMenuOpen(false)}
						>
							{l.label}
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
							className="rounded-full bg-foreground py-2.5 text-center text-[15px] font-semibold text-background"
						>
							Get Started
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
}

/* ─── Hero ───────────────────────────────────────────────────────────── */

function Hero3() {
	return (
		<section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28">
			{/* Warm gradient mesh */}
			<div className="pointer-events-none absolute inset-0" aria-hidden>
				<div className="absolute -top-[300px] -left-[100px] h-[700px] w-[700px] rounded-full bg-[#fec6a1]/20 blur-[140px] dark:bg-[#fec6a1]/[0.04]" />
				<div className="absolute -top-[150px] right-[5%] h-[550px] w-[550px] rounded-full bg-[#c4b5fd]/18 blur-[120px] dark:bg-[#c4b5fd]/[0.04]" />
				<div className="absolute top-[100px] left-[35%] h-[450px] w-[450px] rounded-full bg-[#fda4af]/12 blur-[110px] dark:bg-[#fda4af]/[0.03]" />
			</div>

			{/* Dot pattern */}
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
				aria-hidden
				style={{
					backgroundImage:
						"radial-gradient(circle, currentColor 1px, transparent 1px)",
					backgroundSize: "28px 28px",
				}}
			/>

			<div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
				{/* Left: Copy */}
				<div>
					<Anim>
						<div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-[12px] font-medium text-muted-foreground shadow-xs backdrop-blur-sm">
							<span className="relative flex size-2">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
								<span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
							</span>
							Loved by 10,000+ creatives
						</div>
					</Anim>

					<Anim delay={80}>
						<h1
							className="text-[2.4rem] leading-[1.1] font-bold tracking-tight sm:text-5xl lg:text-[3.5rem]"
							style={H}
						>
							Stop Losing Your{" "}
							<span className="bg-gradient-to-r from-[#f97316] via-[#ec4899] to-[#8b5cf6] bg-clip-text text-transparent">
								Best Ideas
							</span>
						</h1>
					</Anim>

					<Anim delay={160}>
						<p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-[17px]">
							Your visual inspiration is scattered across bookmarks,
							screenshots, and messy folders. InspoSnaps brings it all
							into one beautiful, organized space.
						</p>
					</Anim>

					<Anim delay={240}>
						<div className="mt-8 flex flex-wrap items-center gap-3.5">
							<Link
								to="/signup"
								className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-[15px] font-semibold text-background shadow-lg transition-all hover:shadow-xl hover:opacity-90"
							>
								Start Free <ArrowSvg />
							</Link>
							<a
								href="#how-it-works"
								className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/50 px-6 py-3.5 text-[14px] font-medium text-muted-foreground backdrop-blur-sm transition-colors hover:bg-card hover:text-foreground"
							>
								See How It Works
							</a>
						</div>
					</Anim>

					<Anim delay={340}>
						<div className="mt-8 flex flex-wrap items-center gap-5 text-[12px] font-medium text-muted-foreground/60">
							<span>10K+ Creatives</span>
							<span className="h-3 w-px bg-border" />
							<span>50K+ Folders</span>
							<span className="h-3 w-px bg-border" />
							<span>1M+ Images</span>
						</div>
					</Anim>
				</div>

				{/* Right: Floating folder cards (desktop) */}
				<Anim delay={300} className="hidden lg:block">
					<div className="relative h-[440px]">
						{FLOATING_FOLDERS.map((f, i) => (
							<div
								key={f.name}
								className="absolute"
								style={{
									top: f.top,
									left: f.left,
									width: f.w,
									zIndex: f.z,
									animation: `l3-float-${i % 2 === 0 ? "a" : "b"} ${6 + i * 0.4}s ease-in-out infinite`,
									animationDelay: `${f.delay}s`,
								}}
							>
								<div
									className="overflow-hidden rounded-xl border border-border/50 bg-card/90 shadow-lg shadow-black/[0.04] backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl dark:shadow-black/20"
									style={{
										transform: `rotate(${f.rot}deg)`,
									}}
								>
									<div
										className="h-[3px]"
										style={{ backgroundColor: f.color }}
									/>
									<div className="p-3">
										<span className="text-lg leading-none">
											{f.emoji}
										</span>
										<p
											className="mt-1.5 truncate text-[11px] font-semibold"
											style={H}
										>
											{f.name}
										</p>
										<p className="text-[10px] text-muted-foreground/60">
											{f.count} images
										</p>
									</div>
								</div>
							</div>
						))}
						{/* Ambient glow */}
						<div
							className="pointer-events-none absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-[80px] dark:bg-primary/[0.03]"
							aria-hidden
						/>
					</div>
				</Anim>

				{/* Mobile: compact folder grid */}
				<Anim delay={300} className="lg:hidden">
					<div className="grid grid-cols-3 gap-2.5">
						{FLOATING_FOLDERS.map((f) => (
							<div
								key={f.name}
								className="overflow-hidden rounded-xl border border-border/50 bg-card/80 shadow-sm"
							>
								<div
									className="h-[3px]"
									style={{ backgroundColor: f.color }}
								/>
								<div className="p-2.5">
									<span className="text-base">{f.emoji}</span>
									<p
										className="mt-1 truncate text-[10px] font-semibold"
										style={H}
									>
										{f.name}
									</p>
									<p className="text-[9px] text-muted-foreground/50">
										{f.count} imgs
									</p>
								</div>
							</div>
						))}
					</div>
				</Anim>
			</div>
		</section>
	);
}

/* ─── Logo Ticker ────────────────────────────────────────────────────── */

function Ticker3() {
	const items = [...BRAND_NAMES, ...BRAND_NAMES, ...BRAND_NAMES];

	return (
		<section className="border-y border-border/40 py-9">
			<p className="mb-5 text-center text-[11px] font-medium tracking-[0.18em] text-muted-foreground/45 uppercase">
				Trusted by creative teams worldwide
			</p>
			<div className="relative overflow-hidden">
				<div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
				<div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />
				<div
					className="flex w-max gap-14"
					style={{ animation: "l3-ticker 30s linear infinite" }}
				>
					{items.map((name, i) => (
						<span
							key={`${name}-${i}`}
							className="shrink-0 text-[17px] font-bold tracking-tight text-muted-foreground/20 dark:text-muted-foreground/12 select-none"
							style={H}
						>
							{name}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}

/* ─── Benefits Bento ─────────────────────────────────────────────────── */

function Bento3() {
	return (
		<section id="features" className="relative py-20 sm:py-28">
			<div
				className="pointer-events-none absolute inset-0 overflow-hidden"
				aria-hidden
			>
				<div className="absolute top-1/2 left-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fec6a1]/[0.04] blur-[100px] dark:bg-[#fec6a1]/[0.02]" />
			</div>

			<div className="relative mx-auto max-w-6xl px-5 sm:px-8">
				<Anim>
					<div className="mx-auto max-w-2xl text-center">
						<Tag>Features</Tag>
						<h2
							className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]"
							style={H}
						>
							Everything you need to stay inspired
						</h2>
						<p className="mt-4 text-base text-muted-foreground sm:text-lg">
							Powerful yet simple tools that make organizing visual
							inspiration feel effortless.
						</p>
					</div>
				</Anim>

				<div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{BENEFITS.map((b, i) => (
						<Anim
							key={b.title}
							delay={i * 70}
							className={cn(b.span === 2 && "lg:col-span-2")}
						>
							<div className="group relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-border/80 hover:shadow-lg sm:p-7">
								<div
									className={cn(
										"absolute -top-16 -right-16 h-32 w-32 rounded-full bg-gradient-to-br opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-80",
										b.accent,
									)}
									aria-hidden
								/>
								<div className="relative">
									<span className="text-3xl">{b.icon}</span>
									<h3
										className="mt-4 text-[17px] font-bold"
										style={H}
									>
										{b.title}
									</h3>
									<p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
										{b.desc}
									</p>
								</div>
							</div>
						</Anim>
					))}
				</div>
			</div>
		</section>
	);
}

/* ─── How It Works ───────────────────────────────────────────────────── */

function Steps3() {
	return (
		<section id="how-it-works" className="py-20 sm:py-28">
			<div className="mx-auto max-w-6xl px-5 sm:px-8">
				<Anim>
					<div className="mx-auto max-w-2xl text-center">
						<Tag>How it works</Tag>
						<h2
							className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]"
							style={H}
						>
							Get started in three simple steps
						</h2>
					</div>
				</Anim>

				<div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
					{STEPS.map((s, i) => (
						<Anim key={s.num} delay={i * 120}>
							<div className="relative text-center md:text-left">
								{i < STEPS.length - 1 && (
									<div
										className="pointer-events-none absolute top-8 left-[calc(50%+48px)] hidden h-px w-[calc(100%-96px)] md:block"
										aria-hidden
									>
										<div className="h-full w-full border-t-2 border-dashed border-border/50" />
									</div>
								)}

								<div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fec6a1]/20 to-primary/10 ring-1 ring-primary/10 md:mx-0">
									<span
										className="text-xl font-bold text-primary"
										style={H}
									>
										{s.num}
									</span>
								</div>
								<h3 className="mt-5 text-xl font-bold" style={H}>
									{s.title}
								</h3>
								<p className="mt-2.5 text-[14px] leading-relaxed text-muted-foreground">
									{s.desc}
								</p>
							</div>
						</Anim>
					))}
				</div>
			</div>
		</section>
	);
}

/* ─── Feature Deep Dive ──────────────────────────────────────────────── */

function Features3() {
	return (
		<section className="py-20 sm:py-28">
			<div className="mx-auto max-w-6xl space-y-20 px-5 sm:space-y-28 sm:px-8">
				{/* Feature 1: Organize */}
				<Anim>
					<div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
						{/* Mock UI */}
						<div className="relative">
							<div
								className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#fec6a1]/10 via-transparent to-primary/5 blur-2xl"
								aria-hidden
							/>
							<div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xl shadow-black/[0.04] dark:shadow-black/20">
								{/* Titlebar */}
								<div className="flex items-center gap-2 border-b border-border/40 bg-muted/25 px-4 py-2.5">
									<div className="flex gap-[6px]">
										<div className="size-[10px] rounded-full bg-[#ff5f57]/80" />
										<div className="size-[10px] rounded-full bg-[#febc2e]/80" />
										<div className="size-[10px] rounded-full bg-[#28c840]/80" />
									</div>
									<div className="flex-1 text-center">
										<div className="mx-auto w-44 rounded-md bg-muted/50 px-2.5 py-0.5 text-[10px] text-muted-foreground/40">
											app.insposnaps.com
										</div>
									</div>
									<div className="w-12" />
								</div>

								{/* Content */}
								<div className="flex">
									<div className="hidden w-36 shrink-0 border-r border-border/30 bg-muted/10 p-3 sm:block">
										<div className="mb-3 flex items-center gap-1.5 px-1.5">
											<BrandLogo size={12} />
											<span
												className="text-[9px] font-bold"
												style={H}
											>
												InspoSnaps
											</span>
										</div>
										{[
											"My Folders",
											"Shared",
											"Team",
											"Favourites",
										].map((item, j) => (
											<div
												key={item}
												className={cn(
													"rounded-md px-2 py-[4px] text-[9px]",
													j === 0
														? "bg-primary/10 font-semibold text-primary"
														: "text-muted-foreground/40",
												)}
											>
												{item}
											</div>
										))}
									</div>
									<div className="flex-1 p-4">
										<div className="mb-2 text-[10px] font-medium text-muted-foreground/40">
											My Folders / Design Refs
										</div>
										<div className="grid grid-cols-3 gap-2">
											{[
												{
													emoji: "🎨",
													name: "Colors",
													color: "#8b5cf6",
													n: 18,
												},
												{
													emoji: "🖼️",
													name: "Layouts",
													color: "#f43f5e",
													n: 32,
												},
												{
													emoji: "✏️",
													name: "Sketches",
													color: "#f59e0b",
													n: 7,
												},
												{
													emoji: "📐",
													name: "Grids",
													color: "#10b981",
													n: 14,
												},
												{
													emoji: "🎯",
													name: "Icons",
													color: "#6366f1",
													n: 41,
												},
												{
													emoji: "💡",
													name: "Ideas",
													color: "#0ea5e9",
													n: 9,
												},
											].map((f) => (
												<div
													key={f.name}
													className="overflow-hidden rounded-lg border border-border/30 bg-background/60"
												>
													<div
														className="h-[2px]"
														style={{
															backgroundColor:
																f.color,
														}}
													/>
													<div className="p-2">
														<span className="text-xs">
															{f.emoji}
														</span>
														<p className="mt-0.5 text-[8px] font-semibold">
															{f.name}
														</p>
														<p className="text-[7px] text-muted-foreground/40">
															{f.n} images
														</p>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Text */}
						<div>
							<Tag>Organization</Tag>
							<h3
								className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl"
								style={H}
							>
								Organize your way
							</h3>
							<p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
								No more digging through browser bookmarks or messy
								downloads folders. With InspoSnaps, every image has a
								home.
							</p>
							<ul className="mt-6 space-y-3">
								{[
									"Custom colors and emojis for every folder",
									"Infinitely nested folder hierarchy",
									"Drag and drop image organization",
									"Smart search across all your collections",
								].map((item) => (
									<li
										key={item}
										className="flex items-start gap-2.5 text-[14px] text-muted-foreground"
									>
										<TickSvg className="mt-0.5" />
										{item}
									</li>
								))}
							</ul>
						</div>
					</div>
				</Anim>

				{/* Feature 2: Share */}
				<Anim>
					<div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
						{/* Text (left on desktop) */}
						<div className="order-2 lg:order-1">
							<Tag>Collaboration</Tag>
							<h3
								className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl"
								style={H}
							>
								Share in seconds
							</h3>
							<p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
								Whether it's a client mood board or a team reference
								library, sharing is always one click away.
							</p>
							<ul className="mt-6 space-y-3">
								{[
									"One-click shareable links for any collection",
									"Beautiful gallery view for recipients",
									"Granular permission controls",
									"Real-time team collaboration",
								].map((item) => (
									<li
										key={item}
										className="flex items-start gap-2.5 text-[14px] text-muted-foreground"
									>
										<TickSvg className="mt-0.5" />
										{item}
									</li>
								))}
							</ul>
						</div>

						{/* Mock UI (right on desktop) */}
						<div className="relative order-1 lg:order-2">
							<div
								className="absolute -inset-4 rounded-3xl bg-gradient-to-bl from-[#c4b5fd]/10 via-transparent to-[#fda4af]/5 blur-2xl"
								aria-hidden
							/>
							<div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xl shadow-black/[0.04] dark:shadow-black/20">
								<div className="flex items-center gap-2 border-b border-border/40 bg-muted/25 px-4 py-2.5">
									<div className="flex gap-[6px]">
										<div className="size-[10px] rounded-full bg-[#ff5f57]/80" />
										<div className="size-[10px] rounded-full bg-[#febc2e]/80" />
										<div className="size-[10px] rounded-full bg-[#28c840]/80" />
									</div>
									<div className="flex-1" />
								</div>
								<div className="p-6 sm:p-8">
									<div className="mx-auto max-w-xs">
										<p
											className="text-[13px] font-semibold"
											style={H}
										>
											Share "Design Refs"
										</p>
										<p className="mt-1 text-[11px] text-muted-foreground/50">
											24 images &middot; 6 folders
										</p>

										<div className="mt-5 flex items-center gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
											<svg
												className="size-3.5 shrink-0 text-muted-foreground/40"
												viewBox="0 0 16 16"
												fill="none"
												aria-hidden
											>
												<path
													d="M6.5 9.5a2.5 2.5 0 003.5 0l2-2a2.5 2.5 0 00-3.5-3.5l-1 1M9.5 6.5a2.5 2.5 0 00-3.5 0l-2 2a2.5 2.5 0 003.5 3.5l1-1"
													stroke="currentColor"
													strokeWidth="1.5"
													strokeLinecap="round"
												/>
											</svg>
											<span className="flex-1 truncate text-[10px] text-muted-foreground/50">
												insposnaps.com/s/x8k2m...
											</span>
											<span className="rounded-md bg-primary/10 px-2 py-0.5 text-[9px] font-semibold text-primary">
												Copy
											</span>
										</div>

										<div className="mt-5">
											<p className="text-[10px] font-medium tracking-wide text-muted-foreground/60 uppercase">
												Shared with
											</p>
											<div className="mt-2.5 space-y-2">
												{[
													{
														name: "Sarah Chen",
														color: "#8b5cf6",
													},
													{
														name: "Marcus R.",
														color: "#f43f5e",
													},
												].map((u) => (
													<div
														key={u.name}
														className="flex items-center gap-2.5"
													>
														<div
															className="flex size-7 items-center justify-center rounded-full text-[9px] font-bold text-white"
															style={{
																backgroundColor:
																	u.color,
															}}
														>
															{u.name
																.split(" ")
																.map(
																	(n) => n[0],
																)
																.join("")}
														</div>
														<span className="text-[11px] font-medium">
															{u.name}
														</span>
														<span className="ml-auto text-[9px] text-muted-foreground/40">
															Can view
														</span>
													</div>
												))}
											</div>
											<button
												type="button"
												className="mt-3 text-[11px] font-medium text-primary transition-colors hover:text-primary/80"
											>
												+ Add people
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Anim>
			</div>
		</section>
	);
}

/* ─── Pricing ────────────────────────────────────────────────────────── */

function Pricing3() {
	return (
		<section id="pricing" className="relative py-20 sm:py-28">
			<div
				className="pointer-events-none absolute inset-0 overflow-hidden"
				aria-hidden
			>
				<div className="absolute top-0 left-[15%] h-[500px] w-[500px] rounded-full bg-[#fec6a1]/[0.05] blur-[120px] dark:bg-[#fec6a1]/[0.02]" />
				<div className="absolute bottom-0 right-[15%] h-[400px] w-[400px] rounded-full bg-[#c4b5fd]/[0.05] blur-[100px] dark:bg-[#c4b5fd]/[0.02]" />
			</div>

			<div className="relative mx-auto max-w-6xl px-5 sm:px-8">
				<Anim>
					<div className="mx-auto max-w-2xl text-center">
						<Tag>Pricing</Tag>
						<h2
							className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]"
							style={H}
						>
							Simple, transparent pricing
						</h2>
						<p className="mt-4 text-base text-muted-foreground sm:text-lg">
							Start free. Upgrade when you need more. No surprises.
						</p>
					</div>
				</Anim>

				<div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
					{PLANS.map((p, i) => (
						<Anim key={p.name} delay={i * 100}>
							<div
								className={cn(
									"relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 sm:p-8",
									p.popular
										? "scale-[1.02] border-primary/30 bg-card shadow-xl shadow-primary/[0.06] dark:shadow-primary/[0.1]"
										: "border-border/50 bg-card/60 hover:border-border hover:shadow-md",
								)}
							>
								{p.popular && (
									<div className="absolute -top-3.5 right-6 rounded-full bg-gradient-to-r from-[#f97316] to-[#ec4899] px-4 py-1 text-[11px] font-semibold text-white shadow-sm">
										Most Popular
									</div>
								)}

								<div>
									<p className="text-[13px] font-semibold text-muted-foreground">
										{p.name}
									</p>
									<div className="mt-3 flex items-baseline gap-1">
										<span
											className="text-4xl font-bold tracking-tight"
											style={H}
										>
											{p.price}
										</span>
										<span className="text-sm text-muted-foreground">
											{p.period}
										</span>
									</div>
									<p className="mt-2 text-[13px] text-muted-foreground">
										{p.desc}
									</p>
								</div>

								<Link
									to="/signup"
									className={cn(
										"mt-6 block w-full rounded-full py-3 text-center text-[14px] font-semibold transition-all",
										p.popular
											? "bg-foreground text-background hover:opacity-90"
											: "border border-border bg-background text-foreground hover:bg-muted",
									)}
								>
									{p.cta}
								</Link>

								<ul className="mt-6 flex-1 space-y-3">
									{p.features.map((f) => (
										<li
											key={f}
											className="flex items-start gap-2.5 text-[13px] text-muted-foreground"
										>
											<TickSvg className="mt-0.5" />
											{f}
										</li>
									))}
								</ul>
							</div>
						</Anim>
					))}
				</div>
			</div>
		</section>
	);
}

/* ─── Testimonials ───────────────────────────────────────────────────── */

function Testimonials3() {
	return (
		<section className="py-20 sm:py-28">
			<div className="mx-auto max-w-6xl px-5 sm:px-8">
				<Anim>
					<div className="mx-auto max-w-2xl text-center">
						<Tag>Testimonials</Tag>
						<h2
							className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]"
							style={H}
						>
							Loved by creatives worldwide
						</h2>
					</div>
				</Anim>
			</div>

			<Anim delay={100}>
				<div className="relative mt-14">
					<div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent sm:w-20" />
					<div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent sm:w-20" />

					<div className="l3-no-scrollbar flex gap-5 overflow-x-auto px-5 pb-2 sm:px-8">
						{TESTIMONIALS.map((t) => (
							<div
								key={t.name}
								className="w-[300px] shrink-0 rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-md sm:w-[340px]"
							>
								<div className="mb-3 text-[13px] tracking-wider text-amber-400">
									{"★★★★★"}
								</div>
								<p className="text-[14px] leading-relaxed text-foreground/80">
									&ldquo;{t.quote}&rdquo;
								</p>
								<div className="mt-5 flex items-center gap-3">
									<div
										className="flex size-9 items-center justify-center rounded-full text-[11px] font-bold text-white"
										style={{
											backgroundColor: t.color,
										}}
									>
										{t.name
											.split(" ")
											.map((n) => n[0])
											.join("")}
									</div>
									<div>
										<p className="text-[13px] font-semibold">
											{t.name}
										</p>
										<p className="text-[11px] text-muted-foreground">
											{t.role}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</Anim>
		</section>
	);
}

/* ─── FAQ ─────────────────────────────────────────────────────────────── */

function FAQ3() {
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

/* ─── Final CTA ──────────────────────────────────────────────────────── */

function CTA3() {
	return (
		<section className="px-5 pb-20 sm:px-8 sm:pb-28">
			<Anim>
				<div
					className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl px-8 py-16 text-center sm:px-16 sm:py-20"
					style={{
						background:
							"linear-gradient(135deg, #fec6a1 0%, #fda4af 30%, #c4b5fd 60%, #818cf8 100%)",
					}}
				>
					{/* Grain overlay */}
					<svg
						className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]"
						aria-hidden
					>
						<filter id="l3-grain">
							<feTurbulence
								type="fractalNoise"
								baseFrequency="0.8"
								numOctaves="4"
								stitchTiles="stitch"
							/>
						</filter>
						<rect
							width="100%"
							height="100%"
							filter="url(#l3-grain)"
						/>
					</svg>

					<div className="relative">
						<h2
							className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
							style={H}
						>
							Ready to organize your
							<br className="hidden sm:block" /> inspiration?
						</h2>
						<p className="mx-auto mt-4 max-w-md text-base text-white/70">
							Join 10,000+ creatives who trust InspoSnaps to keep
							their visual inspiration organized and accessible.
						</p>
						<div className="mt-8">
							<Link
								to="/signup"
								className="inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-[15px] font-semibold text-gray-900 shadow-lg transition-all hover:bg-white/95 hover:shadow-xl"
							>
								Get Started Free <ArrowSvg />
							</Link>
						</div>
						<p className="mt-4 text-[12px] text-white/50">
							No credit card required &middot; Free plan forever
						</p>
					</div>
				</div>
			</Anim>
		</section>
	);
}

/* ─── Footer ─────────────────────────────────────────────────────────── */

function Footer3() {
	const cols = [
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

	const socials = [
		{
			label: "Twitter",
			d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
		},
		{
			label: "GitHub",
			d: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z",
		},
	];

	return (
		<footer className="border-t border-border/40">
			<div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
				<div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
					<div className="lg:col-span-2">
						<div className="flex items-center gap-2.5">
							<BrandLogo size={22} />
							<span
								className="text-[17px] font-bold tracking-tight"
								style={H}
							>
								InspoSnaps
							</span>
						</div>
						<p className="mt-3 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
							Your visual inspiration, organized beautifully. Save,
							curate, and share creative collections with anyone.
						</p>
						<div className="mt-5 flex gap-3">
							{socials.map((s) => (
								<a
									key={s.label}
									href="#"
									className="flex size-9 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
									aria-label={s.label}
								>
									<svg
										className="size-4"
										viewBox="0 0 24 24"
										fill="currentColor"
										aria-hidden
									>
										<path d={s.d} />
									</svg>
								</a>
							))}
						</div>
					</div>

					{cols.map((c) => (
						<div key={c.title}>
							<h4 className="text-[13px] font-semibold">
								{c.title}
							</h4>
							<ul className="mt-4 space-y-2.5">
								{c.links.map((l) => (
									<li key={l.label}>
										<a
											href={l.href}
											className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
										>
											{l.label}
										</a>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="mt-12 border-t border-border/40 pt-6 text-[12px] text-muted-foreground/50">
					&copy; {new Date().getFullYear()} InspoSnaps. All rights
					reserved.
				</div>
			</div>
		</footer>
	);
}

/* ─── Page ───────────────────────────────────────────────────────────── */

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

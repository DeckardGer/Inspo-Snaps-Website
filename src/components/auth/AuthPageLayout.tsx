import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/ui/svgs/BrandLogo";

interface AuthPageLayoutProps {
	children: ReactNode;
}

export function AuthPageLayout({ children }: AuthPageLayoutProps) {
	return (
		<div className="flex h-screen p-2">
			<div className="w-full lg:w-2/5 lg:max-w-200 flex flex-col">
				<div className="flex justify-between text-muted-foreground py-4 px-8">
					<Link
						to="/"
						className="rounded-md outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border border-transparent"
					>
						<BrandLogo size={28} />
					</Link>
				</div>
				<div className="flex-1 overflow-y-auto px-8">
					<div className="flex items-center justify-center min-h-full">
						{children}
					</div>
				</div>
				<div className="text-sm text-muted-foreground py-4 px-8">
					&copy; 2025 InspoSnaps.com
				</div>
			</div>
			<div className="hidden lg:flex lg:w-3/5 flex-1 relative overflow-hidden rounded-2xl">
				{/* Gradient layers matching OG image: blue (bottom-left) → indigo (center) → dark purple (top-right) */}
				<div
					className="absolute inset-0"
					style={{
						background:
							"linear-gradient(to top right, #2E34F2 0%, #2E34F2 30%, #2E34F2 55%, #AE4AC1 90%, #AE4AC1 100%)",
					}}
				/>
				<div
					className="absolute inset-0"
					style={{
						background:
							"radial-gradient(ellipse at 45% 160%, #4E78E0 20%, transparent 47%), radial-gradient(ellipse at 20% 150%, #4E78E0 20%, transparent 30%), radial-gradient(ellipse at 15% -5%, #A545C166 0%, transparent 15%)",
					}}
				/>

				{/* Grain texture overlay */}
				{/** biome-ignore lint/a11y/noSvgWithoutTitle: Background Image */}
				<svg
					className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.30]"
					xmlns="http://www.w3.org/2000/svg"
				>
					<filter id="auth-grain">
						<feTurbulence
							type="fractalNoise"
							baseFrequency="0.55"
							numOctaves="3"
							stitchTiles="stitch"
						/>
					</filter>
					<rect width="100%" height="100%" filter="url(#auth-grain)" />
				</svg>

				{/* Content */}
				<div className="relative z-10 flex flex-col items-center justify-center w-full text-center px-12">
					<div className="flex items-center justify-center bg-white rounded-3xl p-4 mb-6">
						<BrandLogo size={80} />
					</div>
					<h2
						className="text-8xl font-bold text-white tracking-tight"
						style={{ fontFamily: "'Gabarito Variable', sans-serif" }}
					>
						InspoSnaps
					</h2>
					<p
						className="text-2xl text-white/80 mt-12 font-semibold max-w-md leading-relaxed"
						style={{ fontFamily: "'Gabarito Variable', sans-serif" }}
					>
						Organize, save, and share your visual inspiration.
					</p>
				</div>
			</div>
		</div>
	);
}

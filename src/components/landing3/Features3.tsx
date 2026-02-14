import { BrandLogo } from "@/components/ui/svgs/BrandLogo";
import { cn } from "@/lib/utils";
import { Anim, H, Tag, TickSvg } from "./shared";

export function Features3() {
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

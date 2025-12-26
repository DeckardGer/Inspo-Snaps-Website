import {
	ArrowUpRight01Icon,
	BrowserIcon,
	PaintBrush04Icon,
	Tick02Icon,
	UserCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useRef, useState } from "react";
import { UserAvatar } from "@/components/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { AuthQueryResult } from "@/lib/auth/queries";
import { type UserTheme, useTheme } from "@/lib/ThemeProvider";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface SettingsModalProps {
	user: NonNullable<AuthQueryResult>;
	trigger?: React.ReactElement;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

type Section = "account" | "appearance" | "extension";

const SECTIONS: {
	id: Section;
	label: string;
	icon: typeof UserCircle02Icon;
}[] = [
	{ id: "account", label: "Account", icon: UserCircle02Icon },
	{ id: "appearance", label: "Appearance", icon: PaintBrush04Icon },
	{ id: "extension", label: "Extension", icon: BrowserIcon },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helper Components
// ─────────────────────────────────────────────────────────────────────────────

const THEME_IMAGES: Record<UserTheme, string> = {
	light: "/Light Mode Setting.png",
	dark: "/Dark Mode Setting.png",
	system: "/System Setting.png",
};

function ThemeImageOption({
	value,
	label,
	isSelected,
}: {
	value: UserTheme;
	label: string;
	isSelected: boolean;
}) {
	return (
		// biome-ignore lint/a11y/noLabelWithoutControl: RadioGroupItem is inside
		<label className="group cursor-pointer">
			<div
				className={cn(
					"rounded-xl ring-2 ring-offset-3 ring-offset-background transition-all",
					isSelected
						? "ring-primary"
						: "ring-transparent group-hover:ring-border",
				)}
			>
				<img
					src={THEME_IMAGES[value]}
					alt={`${label} theme preview`}
					className="w-full rounded-xl"
				/>
			</div>
			<div className="mt-2 flex items-center justify-center gap-2">
				<RadioGroupItem value={value} className="hidden" />
				<span
					className={cn(
						"text-sm transition-colors",
						isSelected
							? "font-medium text-foreground"
							: "text-muted-foreground group-hover:text-foreground",
					)}
				>
					{label}
				</span>
			</div>
		</label>
	);
}

function SettingRow({
	label,
	description,
	children,
}: {
	label: string;
	description?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex items-center justify-between gap-4 py-3">
			<div className="min-w-0 flex-1">
				<p className="text-sm font-medium">{label}</p>
				{description && (
					<p className="text-xs text-muted-foreground">{description}</p>
				)}
			</div>
			<div className="shrink-0">{children}</div>
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export function SettingsModal({
	user,
	trigger,
	open,
	onOpenChange,
}: SettingsModalProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const [activeSection, setActiveSection] = useState<Section>("account");
	const { userTheme, setTheme } = useTheme();

	const sectionRefs = useRef<Record<Section, HTMLElement | null>>({
		account: null,
		appearance: null,
		extension: null,
	});
	const containerRef = useRef<HTMLDivElement | null>(null);

	const dialogOpen = open ?? internalOpen;
	const setDialogOpen = onOpenChange ?? setInternalOpen;

	// Callback ref for scroll container - sets up scroll spy when mounted
	const scrollContainerRef = useCallback((container: HTMLDivElement | null) => {
		containerRef.current = container;
		if (!container) return;

		const handleScroll = () => {
			const containerRect = container.getBoundingClientRect();
			let current: Section = "account";

			for (const section of SECTIONS) {
				const el = sectionRefs.current[section.id];
				if (el) {
					const rect = el.getBoundingClientRect();
					const relativeTop = rect.top - containerRect.top;
					if (relativeTop <= 80) {
						current = section.id;
					}
				}
			}

			setActiveSection(current);
		};

		// Set initial state
		handleScroll();
		container.addEventListener("scroll", handleScroll);
	}, []);

	const scrollToSection = (sectionId: Section) => {
		const el = sectionRefs.current[sectionId];
		if (el && containerRef.current) {
			el.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			{trigger && <DialogTrigger render={trigger} />}
			<DialogContent
				showCloseButton={false}
				className="flex h-[520px] max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl sm:flex-row w-[calc(100%-2rem)]"
			>
				{/* Mobile Header + Tabs */}
				<div className="flex shrink-0 flex-col border-b border-border/50 sm:hidden">
					<div className="px-4 py-3">
						<h2 className="text-base font-semibold">Settings</h2>
					</div>
					<div className="scrollbar-none flex gap-1 overflow-x-auto px-3 pb-2">
						{SECTIONS.map((section) => (
							<Button
								key={section.id}
								variant="ghost"
								size="sm"
								onClick={() => scrollToSection(section.id)}
								className={cn(
									"shrink-0 gap-1.5 rounded-full px-3",
									activeSection === section.id
										? "bg-card hover:bg-card! font-medium text-foreground shadow-sm"
										: "text-muted-foreground hover:bg-background! hover:text-foreground",
								)}
							>
								<HugeiconsIcon
									icon={section.icon}
									className="size-3.5"
									strokeWidth={activeSection === section.id ? 2 : 1.5}
								/>
								{section.label}
							</Button>
						))}
					</div>
				</div>

				{/* Desktop Sidebar */}
				<nav className="hidden w-40 shrink-0 flex-col sm:flex">
					<div className="p-4 pb-2">
						<h2 className="text-base font-semibold">Settings</h2>
					</div>
					<div className="flex-1 space-y-0.5 px-2">
						{SECTIONS.map((section) => (
							<Button
								key={section.id}
								variant="ghost"
								size="sm"
								onClick={() => scrollToSection(section.id)}
								className={cn(
									"w-full justify-start gap-2",
									activeSection === section.id
										? "bg-card hover:bg-card! font-medium text-foreground shadow-sm"
										: "text-muted-foreground hover:bg-background! hover:text-foreground",
								)}
							>
								<HugeiconsIcon
									icon={section.icon}
									className="size-4"
									strokeWidth={activeSection === section.id ? 2 : 1.5}
								/>
								{section.label}
							</Button>
						))}
					</div>
				</nav>

				{/* Content - Single scrollable page */}
				<div
					ref={scrollContainerRef}
					className="flex-1 overflow-y-auto scroll-smooth sm:border-l sm:border-border/50"
				>
					<div className="divide-y divide-border/50">
						{/* Account Section */}
						<section
							ref={(el) => {
								sectionRefs.current.account = el;
							}}
							data-section="account"
							className="px-5 py-5"
						>
							<h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
								Account
							</h3>

							<div className="space-y-1">
								{/* Profile Row */}
								<div className="flex items-center gap-4 py-3">
									<UserAvatar
										username={user.username || ""}
										imageUrl={user.image}
										size="lg"
									/>
									<div className="min-w-0 flex-1">
										<p className="text-sm font-medium">Profile photo</p>
										<p className="text-xs text-muted-foreground">
											JPG, PNG or GIF. 1MB max.
										</p>
									</div>
									<div className="flex gap-2">
										<Button variant="outline" size="sm" disabled>
											Upload
										</Button>
										{user.image && (
											<Button variant="ghost" size="sm" disabled>
												Remove
											</Button>
										)}
									</div>
								</div>

								<div className="h-px bg-border/50" />

								{/* Username */}
								<SettingRow label="Username" description="Your unique @handle">
									<div className="relative w-44">
										<span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
											@
										</span>
										<Input
											defaultValue={user.username || ""}
											className="h-8 pl-6 text-sm"
											disabled
										/>
									</div>
								</SettingRow>

								<div className="h-px bg-border/50" />

								{/* Email */}
								<SettingRow label="Email" description="Used for notifications">
									<div className="flex items-center gap-2">
										{user.emailVerified && (
											<Badge
												variant="secondary"
												className="h-5 gap-1 px-1.5 text-[10px] text-green-600 dark:text-green-400"
											>
												<HugeiconsIcon
													icon={Tick02Icon}
													className="size-2.5"
													strokeWidth={3}
												/>
												Verified
											</Badge>
										)}
										<Input
											type="email"
											defaultValue={user.email}
											className="h-8 w-44 text-sm"
											disabled
										/>
									</div>
								</SettingRow>

								<div className="h-px bg-border/50" />

								{/* Password */}
								<SettingRow
									label="Password"
									description="Last changed 3 months ago"
								>
									<Button variant="outline" size="sm" disabled>
										Change
									</Button>
								</SettingRow>
							</div>
						</section>

						{/* Appearance Section */}
						<section
							ref={(el) => {
								sectionRefs.current.appearance = el;
							}}
							data-section="appearance"
							className="px-5 py-5"
						>
							<h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
								Appearance
							</h3>

							<div>
								<p className="mb-3 text-sm font-medium">Theme</p>
								<RadioGroup
									value={userTheme}
									onValueChange={(value) => setTheme(value as UserTheme)}
									className="grid grid-cols-3 gap-4"
								>
									<ThemeImageOption
										value="light"
										label="Light"
										isSelected={userTheme === "light"}
									/>
									<ThemeImageOption
										value="dark"
										label="Dark"
										isSelected={userTheme === "dark"}
									/>
									<ThemeImageOption
										value="system"
										label="System"
										isSelected={userTheme === "system"}
									/>
								</RadioGroup>
							</div>
						</section>

						{/* Extension Section */}
						<section
							ref={(el) => {
								sectionRefs.current.extension = el;
							}}
							data-section="extension"
							className="px-5 py-5"
						>
							<h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
								Extension
							</h3>

							<div className="space-y-1">
								{/* Status */}
								<div className="flex items-center gap-3 py-3">
									<div className="flex size-10 items-center justify-center rounded-lg bg-muted">
										<HugeiconsIcon
											icon={BrowserIcon}
											className="size-5 text-muted-foreground"
											strokeWidth={1.5}
										/>
									</div>
									<div className="min-w-0 flex-1">
										<p className="text-sm font-medium">Chrome Extension</p>
										<p className="text-xs text-muted-foreground">
											Save images from any website
										</p>
									</div>
									<Button
										variant="outline"
										size="sm"
										className="gap-1.5"
										disabled
									>
										Install
										<HugeiconsIcon
											icon={ArrowUpRight01Icon}
											className="size-3"
											strokeWidth={2}
										/>
									</Button>
								</div>
							</div>
						</section>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

import {
	Alert02Icon,
	BrowserIcon,
	CloudIcon,
	ComputerIcon,
	Delete02Icon,
	Download04Icon,
	GridViewIcon,
	ImageUploadIcon,
	LinkSquare01Icon,
	LockKeyIcon,
	Mail01Icon,
	Moon02Icon,
	Notification03Icon,
	PaintBoardIcon,
	Settings02Icon,
	ShieldUserIcon,
	SparklesIcon,
	Sun03Icon,
	UserCircle02Icon,
	ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { NavBar } from "@/components/navbar/NavBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/(authenticated)/settings/")({
	component: SettingsPage,
});

const SETTINGS_SECTIONS = [
	{ id: "account", label: "Account", icon: UserCircle02Icon },
	{ id: "appearance", label: "Appearance", icon: PaintBoardIcon },
	{ id: "storage", label: "Storage", icon: CloudIcon },
	{ id: "notifications", label: "Notifications", icon: Notification03Icon },
	{ id: "privacy", label: "Privacy", icon: ShieldUserIcon },
	{ id: "extension", label: "Extension", icon: BrowserIcon },
	{ id: "danger", label: "Danger Zone", icon: Alert02Icon },
] as const;

function SettingsPage() {
	const [activeSection, setActiveSection] = useState("account");
	const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActiveSection(entry.target.id);
					}
				}
			},
			{ rootMargin: "-20% 0px -70% 0px" },
		);

		for (const section of SETTINGS_SECTIONS) {
			const el = sectionRefs.current[section.id];
			if (el) observer.observe(el);
		}

		return () => observer.disconnect();
	}, []);

	const scrollToSection = (id: string) => {
		sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<>
			<NavBar
				breadrumbs={[
					{
						name: "Settings",
						link: "/settings",
					},
				]}
			/>
			<div className="flex flex-1 gap-8 p-6 max-w-6xl mx-auto w-full">
				{/* Sidebar Navigation */}
				<aside className="hidden lg:block w-56 shrink-0">
					<nav className="sticky top-6 space-y-1">
						<div className="flex items-center gap-2 px-3 py-2 mb-4">
							<HugeiconsIcon
								icon={Settings02Icon}
								className="size-5 text-muted-foreground"
								strokeWidth={2}
							/>
							<span className="font-semibold text-sm">Settings</span>
						</div>
						{SETTINGS_SECTIONS.map((section) => (
							<button
								key={section.id}
								type="button"
								onClick={() => scrollToSection(section.id)}
								className={cn(
									"flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors text-left",
									activeSection === section.id
										? "bg-primary/10 text-primary font-medium"
										: "text-muted-foreground hover:text-foreground hover:bg-muted/50",
									section.id === "danger" &&
										activeSection === section.id &&
										"bg-destructive/10 text-destructive",
									section.id === "danger" &&
										activeSection !== section.id &&
										"hover:bg-destructive/5 hover:text-destructive",
								)}
							>
								<HugeiconsIcon
									icon={section.icon}
									className="size-4"
									strokeWidth={2}
								/>
								{section.label}
							</button>
						))}
					</nav>
				</aside>

				{/* Main Content */}
				<main className="flex-1 space-y-10 pb-20">
					{/* Account Section */}
					<section
						id="account"
						ref={(el) => {
							sectionRefs.current.account = el;
						}}
						className="scroll-mt-6"
					>
						<Card>
							<CardHeader>
								<div className="flex items-center gap-3">
									<div className="flex items-center justify-center size-10 rounded-xl bg-primary/10">
										<HugeiconsIcon
											icon={UserCircle02Icon}
											className="size-5 text-primary"
											strokeWidth={2}
										/>
									</div>
									<div>
										<CardTitle>Account</CardTitle>
										<CardDescription>
											Manage your profile and account settings
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<FieldGroup>
									{/* Profile Photo */}
									<Field orientation="horizontal">
										<FieldLabel className="flex-1">
											<span className="font-medium">Profile Photo</span>
											<FieldDescription>
												Your avatar shown across the app
											</FieldDescription>
										</FieldLabel>
										<div className="flex items-center gap-4">
											<Avatar size="lg">
												<AvatarImage src="/placeholder-avatar.jpg" />
												<AvatarFallback>JD</AvatarFallback>
											</Avatar>
											<div className="flex gap-2">
												<Button variant="outline" size="sm">
													<HugeiconsIcon
														icon={ImageUploadIcon}
														strokeWidth={2}
													/>
													Upload
												</Button>
												<Button variant="ghost" size="sm">
													Remove
												</Button>
											</div>
										</div>
									</Field>

									<Separator />

									{/* Display Name */}
									<Field>
										<FieldLabel>Display Name</FieldLabel>
										<Input
											placeholder="Your name"
											defaultValue="John Doe"
											className="max-w-md"
										/>
										<FieldDescription>
											This is how your name appears to others
										</FieldDescription>
									</Field>

									{/* Email */}
									<Field>
										<FieldLabel>Email Address</FieldLabel>
										<Input
											type="email"
											placeholder="you@example.com"
											defaultValue="john@example.com"
											className="max-w-md"
										/>
										<FieldDescription>
											Used for notifications and account recovery
										</FieldDescription>
									</Field>

									<Separator />

									{/* Password */}
									<Field orientation="horizontal">
										<FieldLabel className="flex-1">
											<span className="font-medium">Password</span>
											<FieldDescription>
												Last changed 3 months ago
											</FieldDescription>
										</FieldLabel>
										<Button variant="outline">
											<HugeiconsIcon icon={LockKeyIcon} strokeWidth={2} />
											Change Password
										</Button>
									</Field>
								</FieldGroup>
							</CardContent>
						</Card>
					</section>

					{/* Appearance Section */}
					<section
						id="appearance"
						ref={(el) => {
							sectionRefs.current.appearance = el;
						}}
						className="scroll-mt-6"
					>
						<Card>
							<CardHeader>
								<div className="flex items-center gap-3">
									<div className="flex items-center justify-center size-10 rounded-xl bg-purple-500/10">
										<HugeiconsIcon
											icon={PaintBoardIcon}
											className="size-5 text-purple-500"
											strokeWidth={2}
										/>
									</div>
									<div>
										<CardTitle>Appearance</CardTitle>
										<CardDescription>
											Customize how the app looks and feels
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<FieldGroup>
									{/* Theme */}
									<Field>
										<FieldLabel>Theme</FieldLabel>
										<FieldDescription className="mb-4">
											Choose your preferred color scheme
										</FieldDescription>
										<RadioGroup
											defaultValue="system"
											className="grid grid-cols-3 gap-4 max-w-lg"
										>
											{/* biome-ignore lint/a11y/noLabelWithoutControl: RadioGroupItem is inside label */}
											<label className="cursor-pointer">
												<div className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-transparent bg-muted/50 transition-all hover:bg-muted has-[:checked]:border-primary has-[:checked]:bg-primary/5">
													<div className="flex items-center justify-center size-10 rounded-full bg-amber-100 dark:bg-amber-900/30">
														<HugeiconsIcon
															icon={Sun03Icon}
															className="size-5 text-amber-600 dark:text-amber-400"
															strokeWidth={2}
														/>
													</div>
													<div className="flex items-center gap-2">
														<RadioGroupItem value="light" />
														<span className="text-sm font-medium">Light</span>
													</div>
												</div>
											</label>
											{/* biome-ignore lint/a11y/noLabelWithoutControl: RadioGroupItem is inside label */}
											<label className="cursor-pointer">
												<div className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-transparent bg-muted/50 transition-all hover:bg-muted has-[:checked]:border-primary has-[:checked]:bg-primary/5">
													<div className="flex items-center justify-center size-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
														<HugeiconsIcon
															icon={Moon02Icon}
															className="size-5 text-indigo-600 dark:text-indigo-400"
															strokeWidth={2}
														/>
													</div>
													<div className="flex items-center gap-2">
														<RadioGroupItem value="dark" />
														<span className="text-sm font-medium">Dark</span>
													</div>
												</div>
											</label>
											{/* biome-ignore lint/a11y/noLabelWithoutControl: RadioGroupItem is inside label */}
											<label className="cursor-pointer">
												<div className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-transparent bg-muted/50 transition-all hover:bg-muted has-[:checked]:border-primary has-[:checked]:bg-primary/5">
													<div className="flex items-center justify-center size-10 rounded-full bg-slate-100 dark:bg-slate-800">
														<HugeiconsIcon
															icon={ComputerIcon}
															className="size-5 text-slate-600 dark:text-slate-400"
															strokeWidth={2}
														/>
													</div>
													<div className="flex items-center gap-2">
														<RadioGroupItem value="system" />
														<span className="text-sm font-medium">System</span>
													</div>
												</div>
											</label>
										</RadioGroup>
									</Field>

									<Separator />

									{/* Display Density */}
									<Field orientation="horizontal">
										<FieldLabel className="flex-1">
											<span className="font-medium">Display Density</span>
											<FieldDescription>
												Adjust spacing between elements
											</FieldDescription>
										</FieldLabel>
										<Select defaultValue="comfortable">
											<SelectTrigger className="w-40">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="compact">Compact</SelectItem>
												<SelectItem value="comfortable">Comfortable</SelectItem>
												<SelectItem value="spacious">Spacious</SelectItem>
											</SelectContent>
										</Select>
									</Field>

									{/* Default View */}
									<Field orientation="horizontal">
										<FieldLabel className="flex-1">
											<span className="font-medium">Default Gallery View</span>
											<FieldDescription>
												How images are displayed in folders
											</FieldDescription>
										</FieldLabel>
										<Select defaultValue="grid">
											<SelectTrigger className="w-40">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="grid">
													<HugeiconsIcon
														icon={GridViewIcon}
														className="size-4"
														strokeWidth={2}
													/>
													Grid View
												</SelectItem>
												<SelectItem value="list">
													<HugeiconsIcon
														icon={ViewIcon}
														className="size-4"
														strokeWidth={2}
													/>
													List View
												</SelectItem>
											</SelectContent>
										</Select>
									</Field>

									{/* Grid Size */}
									<Field orientation="horizontal">
										<FieldLabel className="flex-1">
											<span className="font-medium">Grid Size</span>
											<FieldDescription>
												Size of image thumbnails in grid view
											</FieldDescription>
										</FieldLabel>
										<Select defaultValue="medium">
											<SelectTrigger className="w-40">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="small">Small</SelectItem>
												<SelectItem value="medium">Medium</SelectItem>
												<SelectItem value="large">Large</SelectItem>
											</SelectContent>
										</Select>
									</Field>
								</FieldGroup>
							</CardContent>
						</Card>
					</section>

					{/* Storage Section */}
					<section
						id="storage"
						ref={(el) => {
							sectionRefs.current.storage = el;
						}}
						className="scroll-mt-6"
					>
						<Card>
							<CardHeader>
								<div className="flex items-center gap-3">
									<div className="flex items-center justify-center size-10 rounded-xl bg-sky-500/10">
										<HugeiconsIcon
											icon={CloudIcon}
											className="size-5 text-sky-500"
											strokeWidth={2}
										/>
									</div>
									<div>
										<CardTitle>Storage & Usage</CardTitle>
										<CardDescription>
											Manage your storage and upload preferences
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<FieldGroup>
									{/* Storage Usage */}
									<div className="p-5 rounded-xl bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-sky-950/30 dark:to-indigo-950/30 border border-sky-100 dark:border-sky-900/50">
										<div className="flex items-center justify-between mb-3">
											<span className="text-sm font-medium">Storage Used</span>
											<span className="text-sm text-muted-foreground">
												2.4 GB of 10 GB
											</span>
										</div>
										<Progress value={24} className="h-2.5 mb-4" />
										<div className="flex items-center justify-between text-xs text-muted-foreground">
											<div className="flex items-center gap-4">
												<span className="flex items-center gap-1.5">
													<span className="size-2 rounded-full bg-primary" />
													Images (2.1 GB)
												</span>
												<span className="flex items-center gap-1.5">
													<span className="size-2 rounded-full bg-primary/40" />
													Thumbnails (0.3 GB)
												</span>
											</div>
											<Button variant="link" size="sm" className="h-auto p-0">
												Upgrade Plan
											</Button>
										</div>
									</div>

									<Separator />

									{/* Upload Quality */}
									<Field orientation="horizontal">
										<FieldLabel className="flex-1">
											<span className="font-medium">Upload Quality</span>
											<FieldDescription>
												Quality of images when uploading
											</FieldDescription>
										</FieldLabel>
										<Select defaultValue="high">
											<SelectTrigger className="w-40">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="original">
													<HugeiconsIcon
														icon={SparklesIcon}
														className="size-4"
														strokeWidth={2}
													/>
													Original
												</SelectItem>
												<SelectItem value="high">High Quality</SelectItem>
												<SelectItem value="medium">Medium</SelectItem>
											</SelectContent>
										</Select>
									</Field>

									{/* Auto-compress */}
									<Field orientation="horizontal">
										<FieldLabel className="flex-1">
											<span className="font-medium">
												Auto-compress Large Images
											</span>
											<FieldDescription>
												Automatically compress images over 5MB
											</FieldDescription>
										</FieldLabel>
										<Switch defaultChecked />
									</Field>

									{/* Download Quality */}
									<Field orientation="horizontal">
										<FieldLabel className="flex-1">
											<span className="font-medium">Download Quality</span>
											<FieldDescription>
												Default quality when downloading images
											</FieldDescription>
										</FieldLabel>
										<Select defaultValue="original">
											<SelectTrigger className="w-40">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="original">
													<HugeiconsIcon
														icon={Download04Icon}
														className="size-4"
														strokeWidth={2}
													/>
													Original
												</SelectItem>
												<SelectItem value="optimized">
													Optimized for Web
												</SelectItem>
											</SelectContent>
										</Select>
									</Field>
								</FieldGroup>
							</CardContent>
						</Card>
					</section>

					{/* Notifications Section */}
					<section
						id="notifications"
						ref={(el) => {
							sectionRefs.current.notifications = el;
						}}
						className="scroll-mt-6"
					>
						<Card>
							<CardHeader>
								<div className="flex items-center gap-3">
									<div className="flex items-center justify-center size-10 rounded-xl bg-amber-500/10">
										<HugeiconsIcon
											icon={Notification03Icon}
											className="size-5 text-amber-500"
											strokeWidth={2}
										/>
									</div>
									<div>
										<CardTitle>Notifications</CardTitle>
										<CardDescription>
											Choose what updates you want to receive
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<FieldGroup>
									{/* Email Notifications */}
									<Field orientation="horizontal">
										<FieldLabel className="flex-1">
											<div className="flex items-center gap-2">
												<HugeiconsIcon
													icon={Mail01Icon}
													className="size-4 text-muted-foreground"
													strokeWidth={2}
												/>
												<span className="font-medium">Email Notifications</span>
											</div>
											<FieldDescription>
												Receive emails when someone shares a folder with you
											</FieldDescription>
										</FieldLabel>
										<Switch defaultChecked />
									</Field>

									{/* Browser Notifications */}
									<Field orientation="horizontal">
										<FieldLabel className="flex-1">
											<div className="flex items-center gap-2">
												<HugeiconsIcon
													icon={BrowserIcon}
													className="size-4 text-muted-foreground"
													strokeWidth={2}
												/>
												<span className="font-medium">
													Browser Notifications
												</span>
											</div>
											<FieldDescription>
												Get push notifications in your browser
											</FieldDescription>
										</FieldLabel>
										<Switch />
									</Field>

									<Separator />

									{/* Weekly Digest */}
									<Field orientation="horizontal">
										<FieldLabel className="flex-1">
											<span className="font-medium">Weekly Digest</span>
											<FieldDescription>
												Summary of your activity and new features
											</FieldDescription>
										</FieldLabel>
										<Switch defaultChecked />
									</Field>

									{/* Marketing */}
									<Field orientation="horizontal">
										<FieldLabel className="flex-1">
											<span className="font-medium">Product Updates</span>
											<FieldDescription>
												Tips, tutorials, and product announcements
											</FieldDescription>
										</FieldLabel>
										<Switch />
									</Field>
								</FieldGroup>
							</CardContent>
						</Card>
					</section>

					{/* Privacy Section */}
					<section
						id="privacy"
						ref={(el) => {
							sectionRefs.current.privacy = el;
						}}
						className="scroll-mt-6"
					>
						<Card>
							<CardHeader>
								<div className="flex items-center gap-3">
									<div className="flex items-center justify-center size-10 rounded-xl bg-green-500/10">
										<HugeiconsIcon
											icon={ShieldUserIcon}
											className="size-5 text-green-500"
											strokeWidth={2}
										/>
									</div>
									<div>
										<CardTitle>Privacy</CardTitle>
										<CardDescription>
											Control your privacy and data settings
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<FieldGroup>
									{/* Default Visibility */}
									<Field orientation="horizontal">
										<FieldLabel className="flex-1">
											<span className="font-medium">
												Default Folder Visibility
											</span>
											<FieldDescription>
												Privacy setting for new folders you create
											</FieldDescription>
										</FieldLabel>
										<Select defaultValue="private">
											<SelectTrigger className="w-40">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="private">
													<HugeiconsIcon
														icon={LockKeyIcon}
														className="size-4"
														strokeWidth={2}
													/>
													Private
												</SelectItem>
												<SelectItem value="shared">
													<HugeiconsIcon
														icon={LinkSquare01Icon}
														className="size-4"
														strokeWidth={2}
													/>
													Shared Link
												</SelectItem>
											</SelectContent>
										</Select>
									</Field>

									{/* Profile Visibility */}
									<Field orientation="horizontal">
										<FieldLabel className="flex-1">
											<span className="font-medium">
												Profile Discoverability
											</span>
											<FieldDescription>
												Allow others to find you by email
											</FieldDescription>
										</FieldLabel>
										<Switch defaultChecked />
									</Field>

									{/* Activity Tracking */}
									<Field orientation="horizontal">
										<FieldLabel className="flex-1">
											<span className="font-medium">Activity Tracking</span>
											<FieldDescription>
												Help improve the app with anonymous usage data
											</FieldDescription>
										</FieldLabel>
										<Switch defaultChecked />
									</Field>

									<Separator />

									{/* Export Data */}
									<Field orientation="horizontal">
										<FieldLabel className="flex-1">
											<span className="font-medium">Export Your Data</span>
											<FieldDescription>
												Download all your images and folder data
											</FieldDescription>
										</FieldLabel>
										<Button variant="outline">
											<HugeiconsIcon icon={Download04Icon} strokeWidth={2} />
											Request Export
										</Button>
									</Field>
								</FieldGroup>
							</CardContent>
						</Card>
					</section>

					{/* Chrome Extension Section */}
					<section
						id="extension"
						ref={(el) => {
							sectionRefs.current.extension = el;
						}}
						className="scroll-mt-6"
					>
						<Card>
							<CardHeader>
								<div className="flex items-center gap-3">
									<div className="flex items-center justify-center size-10 rounded-xl bg-orange-500/10">
										<HugeiconsIcon
											icon={BrowserIcon}
											className="size-5 text-orange-500"
											strokeWidth={2}
										/>
									</div>
									<div>
										<CardTitle>Chrome Extension</CardTitle>
										<CardDescription>
											Manage your browser extension settings
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<FieldGroup>
									{/* Connection Status */}
									<div className="flex items-center justify-between p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50">
										<div className="flex items-center gap-3">
											<div className="relative">
												<div className="size-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
													<HugeiconsIcon
														icon={BrowserIcon}
														className="size-5 text-green-600 dark:text-green-400"
														strokeWidth={2}
													/>
												</div>
												<span className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-green-500 border-2 border-green-50 dark:border-green-950" />
											</div>
											<div>
												<p className="text-sm font-medium text-green-800 dark:text-green-200">
													Extension Connected
												</p>
												<p className="text-xs text-green-600 dark:text-green-400">
													Last synced 2 minutes ago
												</p>
											</div>
										</div>
										<Button variant="outline" size="sm">
											Disconnect
										</Button>
									</div>

									<Separator />

									{/* Auto-sync */}
									<Field orientation="horizontal">
										<FieldLabel className="flex-1">
											<span className="font-medium">Auto-sync Folders</span>
											<FieldDescription>
												Keep extension folders in sync with the web app
											</FieldDescription>
										</FieldLabel>
										<Switch defaultChecked />
									</Field>

									{/* Default Save Folder */}
									<Field orientation="horizontal">
										<FieldLabel className="flex-1">
											<span className="font-medium">Default Save Folder</span>
											<FieldDescription>
												Where new images from the extension are saved
											</FieldDescription>
										</FieldLabel>
										<Select defaultValue="inspiration">
											<SelectTrigger className="w-48">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="inspiration">Inspiration</SelectItem>
												<SelectItem value="references">References</SelectItem>
												<SelectItem value="unsorted">Unsorted</SelectItem>
											</SelectContent>
										</Select>
									</Field>

									{/* Quick Save Shortcut */}
									<Field orientation="horizontal">
										<FieldLabel className="flex-1">
											<span className="font-medium">Quick Save Shortcut</span>
											<FieldDescription>
												Keyboard shortcut to save images instantly
											</FieldDescription>
										</FieldLabel>
										<div className="flex items-center gap-1.5">
											<kbd className="px-2 py-1 text-xs font-medium bg-muted rounded border">
												Ctrl
											</kbd>
											<span className="text-muted-foreground">+</span>
											<kbd className="px-2 py-1 text-xs font-medium bg-muted rounded border">
												Shift
											</kbd>
											<span className="text-muted-foreground">+</span>
											<kbd className="px-2 py-1 text-xs font-medium bg-muted rounded border">
												S
											</kbd>
										</div>
									</Field>
								</FieldGroup>
							</CardContent>
						</Card>
					</section>

					{/* Danger Zone Section */}
					<section
						id="danger"
						ref={(el) => {
							sectionRefs.current.danger = el;
						}}
						className="scroll-mt-6"
					>
						<Card className="border-destructive/30 bg-destructive/[0.02]">
							<CardHeader>
								<div className="flex items-center gap-3">
									<div className="flex items-center justify-center size-10 rounded-xl bg-destructive/10">
										<HugeiconsIcon
											icon={Alert02Icon}
											className="size-5 text-destructive"
											strokeWidth={2}
										/>
									</div>
									<div>
										<CardTitle className="text-destructive">
											Danger Zone
										</CardTitle>
										<CardDescription>
											Irreversible and destructive actions
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<FieldGroup>
									{/* Delete All Data */}
									<Field orientation="horizontal">
										<FieldLabel className="flex-1">
											<span className="font-medium">Delete All Images</span>
											<FieldDescription>
												Permanently delete all your images and folders
											</FieldDescription>
										</FieldLabel>
										<Button variant="destructive">
											<HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
											Delete All Data
										</Button>
									</Field>

									<Separator />

									{/* Delete Account */}
									<Field orientation="horizontal">
										<FieldLabel className="flex-1">
											<span className="font-medium">Delete Account</span>
											<FieldDescription>
												Permanently delete your account and all associated data
											</FieldDescription>
										</FieldLabel>
										<Button variant="destructive">
											<HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
											Delete Account
										</Button>
									</Field>
								</FieldGroup>
							</CardContent>
						</Card>
					</section>
				</main>
			</div>
		</>
	);
}

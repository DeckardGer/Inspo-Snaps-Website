import {
	ArrowUpRight01Icon,
	AtIcon,
	BrowserIcon,
	CreditCardIcon,
	Loading03Icon,
	PaintBrush04Icon,
	SparklesIcon,
	Tick02Icon,
	UserCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm } from "@tanstack/react-form";
import {
	useMutation,
	useQuery,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { ChangePasswordDialog } from "@/components/settings/ChangePasswordDialog";
import { PricingDialog } from "@/components/subscriptions/PricingDialog";
import { UserAvatar } from "@/components/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "@/components/ui/input-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import authClient from "@/lib/auth/auth-client";
import {
	checkUsernameAvailability,
	getAvatarUploadUrl,
	removeAvatar,
	sendVerificationEmail,
	updateAvatar,
	updateUsername,
} from "@/lib/auth/functions";
import { authQueryOptions, hasPasswordQueryOptions } from "@/lib/auth/queries";
import { MAX_AVATAR_SIZE_BYTES } from "@/lib/images/constants";
import { TIERS } from "@/lib/subscriptions/pricing";
import { planStateQueryOptions } from "@/lib/subscriptions/queries";
import { type UserTheme, useTheme } from "@/lib/ThemeProvider";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Types & Constants
// ─────────────────────────────────────────────────────────────────────────────

interface SettingsModalProps {
	trigger?: React.ReactElement;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

type Section = "account" | "billing" | "appearance" | "extension";

const SECTIONS: {
	id: Section;
	label: string;
	icon: typeof UserCircle02Icon;
}[] = [
	{ id: "account", label: "Account", icon: UserCircle02Icon },
	{ id: "billing", label: "Billing", icon: CreditCardIcon },
	{ id: "appearance", label: "Appearance", icon: PaintBrush04Icon },
	{ id: "extension", label: "Extension", icon: BrowserIcon },
];

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];

const usernameSchema = z.object({
	username: z
		.string()
		.min(3, "Username must be at least 3 characters.")
		.max(30, "Username must be at most 30 characters.")
		.regex(
			/^[a-zA-Z0-9._]+$/,
			"Username can only contain alphanumeric characters, underscores, and dots.",
		),
});

// ─────────────────────────────────────────────────────────────────────────────
// Helper Components
// ─────────────────────────────────────────────────────────────────────────────

const THEME_IMAGES: Record<UserTheme, string> = {
	light: "/images/settings/light-mode.png",
	dark: "/images/settings/dark-mode.png",
	system: "/images/settings/system-mode.png",
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
		<label className="group relative cursor-pointer">
			{/* Position radio to cover parent so browser doesn't scroll when focusing */}
			<RadioGroupItem value={value} className="absolute inset-0 opacity-0" />
			<div
				className={cn(
					"rounded-xl ring-2 ring-offset-3 ring-offset-background transition-all",
					isSelected
						? "ring-primary"
						: "ring-transparent group-hover:ring-border group-has-focus-visible:ring-ring",
				)}
			>
				<img
					src={THEME_IMAGES[value]}
					alt={`${label} theme preview`}
					className="w-full rounded-xl"
				/>
			</div>
			<div className="mt-2 flex items-center justify-center gap-2">
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
	trigger,
	open,
	onOpenChange,
}: SettingsModalProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const [activeSection, setActiveSection] = useState<Section>("account");
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [nestedDialogOpen, setNestedDialogOpen] = useState(false);
	const [pricingDialogOpen, setPricingDialogOpen] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { userTheme, setTheme } = useTheme();
	const queryClient = useQueryClient();

	// Use query directly for reactive updates when user data changes
	const { data: user } = useSuspenseQuery(authQueryOptions());
	if (!user) throw new Error("User not found");

	const { data: passwordData } = useSuspenseQuery(hasPasswordQueryOptions());
	const { data: planState } = useQuery(planStateQueryOptions());

	const sectionRefs = useRef<Record<Section, HTMLElement | null>>({
		account: null,
		billing: null,
		appearance: null,
		extension: null,
	});
	const containerRef = useRef<HTMLDivElement | null>(null);
	// Track intended scroll position to prevent focus-induced scroll jumps
	const intendedScrollRef = useRef<number>(0);

	const dialogOpen = open ?? internalOpen;
	const setDialogOpen = onOpenChange ?? setInternalOpen;

	// ─────────────────────────────────────────────────────────────────────────
	// Username Form & Mutation
	// ─────────────────────────────────────────────────────────────────────────

	const usernameMutation = useMutation({
		mutationFn: updateUsername,
		onSuccess: (result) => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
			toast.success(result.message);
		},
		onError: (error) => {
			toast.error("Failed to update username", {
				description: error.message,
			});
		},
	});

	const usernameForm = useForm({
		defaultValues: {
			username: user.username || "",
		},
		validators: {
			onSubmit: usernameSchema,
		},
		onSubmit: async ({ value }) => {
			usernameMutation.mutate({ data: value });
		},
	});

	// ─────────────────────────────────────────────────────────────────────────
	// Avatar Mutations
	// ─────────────────────────────────────────────────────────────────────────

	const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

	const updateAvatarMutation = useMutation({
		mutationFn: updateAvatar,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
			toast.success("Profile photo updated");
			setAvatarPreview(null);
		},
		onError: (error) => {
			toast.error("Failed to update profile photo", {
				description: error.message,
			});
		},
	});

	const removeAvatarMutation = useMutation({
		mutationFn: removeAvatar,
		onSuccess: () => {
			// Immediately update cache to show fallback avatar (don't wait for refetch)
			queryClient.setQueryData(["user"], (oldData: typeof user | undefined) =>
				oldData ? { ...oldData, image: null } : oldData,
			);
			queryClient.invalidateQueries({ queryKey: ["user"] });
			toast.success("Profile photo removed");
		},
		onError: (error) => {
			toast.error("Failed to remove profile photo", {
				description: error.message,
			});
		},
	});

	// ─────────────────────────────────────────────────────────────────────────
	// Email Verification Mutation
	// ─────────────────────────────────────────────────────────────────────────

	const verificationMutation = useMutation({
		mutationFn: sendVerificationEmail,
		onSuccess: (result) => {
			toast.success(result.message, {
				description: "Check your inbox for the verification link.",
			});
		},
		onError: (error) => {
			toast.error("Failed to send verification email", {
				description: error.message,
			});
		},
	});

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
			toast.error("Invalid file type", {
				description: "Please upload a JPG, PNG, or GIF image.",
			});
			return;
		}

		// Validate file size
		if (file.size > MAX_AVATAR_SIZE_BYTES) {
			toast.error("File too large", {
				description: `Please upload an image smaller than ${MAX_AVATAR_SIZE_BYTES / 1024 / 1024}MB.`,
			});
			return;
		}

		// Show preview
		const previewUrl = URL.createObjectURL(file);
		setAvatarPreview(previewUrl);

		try {
			setIsUploadingAvatar(true);

			// Get presigned upload URL
			const { uploadUrl, storageKey } = await getAvatarUploadUrl({
				data: {
					filename: file.name,
					contentType: file.type,
					fileSize: file.size,
				},
			});

			// Upload file to S3
			const uploadResponse = await fetch(uploadUrl, {
				method: "PUT",
				body: file,
				headers: {
					"Content-Type": file.type,
				},
			});

			if (!uploadResponse.ok) {
				throw new Error("Failed to upload image");
			}

			// Update user avatar
			updateAvatarMutation.mutate({ data: { storageKey } });
		} catch (error) {
			toast.error("Failed to upload image", {
				description:
					error instanceof Error ? error.message : "An error occurred",
			});
			setAvatarPreview(null);
		} finally {
			setIsUploadingAvatar(false);
			// Reset file input
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	const handleRemoveAvatar = () => {
		removeAvatarMutation.mutate({});
	};

	// ─────────────────────────────────────────────────────────────────────────
	// Scroll Spy
	// ─────────────────────────────────────────────────────────────────────────

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

			// Update intended scroll position on user scroll
			intendedScrollRef.current = container.scrollTop;
			setActiveSection(current);
		};

		// When focus moves to sr-only elements, browser may scroll incorrectly
		// Reset to intended position after browser's focus scroll
		const handleFocusIn = () => {
			requestAnimationFrame(() => {
				if (container.scrollTop !== intendedScrollRef.current) {
					container.scrollTop = intendedScrollRef.current;
				}
			});
		};

		handleScroll();
		container.addEventListener("scroll", handleScroll);
		container.addEventListener("focusin", handleFocusIn);

		return () => {
			container.removeEventListener("scroll", handleScroll);
			container.removeEventListener("focusin", handleFocusIn);
		};
	}, []);

	const scrollToSection = (sectionId: Section) => {
		const el = sectionRefs.current[sectionId];
		const container = containerRef.current;
		if (el && container) {
			// Set intended position before scrolling so focus handler knows the target
			intendedScrollRef.current = el.offsetTop;
			// Use scrollTo on container directly instead of scrollIntoView
			// to avoid affecting parent scroll containers (which can shift the dialog)
			container.scrollTo({
				top: el.offsetTop,
				behavior: "smooth",
			});
		}
	};

	// ─────────────────────────────────────────────────────────────────────────
	// Render
	// ─────────────────────────────────────────────────────────────────────────

	const isAvatarLoading =
		isUploadingAvatar ||
		updateAvatarMutation.isPending ||
		removeAvatarMutation.isPending;

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			{trigger && <DialogTrigger render={trigger} />}
			<DialogContent
				showCloseButton={false}
				className={cn(
					"flex h-[520px] max-h-[85vh] w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl sm:flex-row",
					(nestedDialogOpen || pricingDialogOpen) && "blur-xs",
				)}
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
										? "bg-card font-medium text-foreground shadow-sm hover:bg-card!"
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
										? "bg-card font-medium text-foreground shadow-sm hover:bg-card!"
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
					className="flex-1 overflow-y-auto overscroll-contain scroll-smooth sm:border-l sm:border-border/50"
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
									<div className="relative">
										<UserAvatar
											username={user.username || ""}
											imageUrl={avatarPreview || user.image}
											size="lg"
										/>
										{isAvatarLoading && (
											<div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/80">
												<HugeiconsIcon
													icon={Loading03Icon}
													className="size-5 animate-spin text-muted-foreground"
													strokeWidth={2}
												/>
											</div>
										)}
									</div>
									<div className="min-w-0 flex-1">
										<p className="text-sm font-medium">Profile photo</p>
										<p className="text-xs text-muted-foreground">
											JPG, PNG or GIF. {MAX_AVATAR_SIZE_BYTES / 1024 / 1024}MB
											max.
										</p>
									</div>
									<div className="flex gap-2">
										<input
											ref={fileInputRef}
											type="file"
											accept={ACCEPTED_IMAGE_TYPES.join(",")}
											onChange={handleFileSelect}
											className="hidden"
										/>
										<Button
											variant="outline"
											size="sm"
											onClick={() => fileInputRef.current?.click()}
											disabled={isAvatarLoading}
										>
											{isAvatarLoading ? (
												<>
													<HugeiconsIcon
														icon={Loading03Icon}
														className="animate-spin"
														strokeWidth={2}
													/>
													Uploading...
												</>
											) : (
												"Upload"
											)}
										</Button>
										{user.image && !isAvatarLoading && (
											<Button
												variant="ghost"
												size="sm"
												onClick={handleRemoveAvatar}
											>
												Remove
											</Button>
										)}
									</div>
								</div>

								<div className="h-px bg-border/50" />

								{/* Username */}
								<form
									onSubmit={(e) => {
										e.preventDefault();
										usernameForm.handleSubmit();
									}}
								>
									<SettingRow
										label="Username"
										description="Your unique @handle"
									>
										<usernameForm.Field
											name="username"
											validators={{
												onChange: ({ value }) => {
													// Validate empty field
													if (!value || value.trim() === "") {
														return "Username is required.";
													}
													return undefined;
												},
												onChangeAsyncDebounceMs: 500,
												onChangeAsync: async ({ value }) => {
													// Skip if empty (handled by onChange) or same as current
													if (!value || value === user.username) {
														return undefined;
													}

													try {
														// Backend validates format AND checks availability
														const result = await checkUsernameAvailability({
															data: { username: value },
														});

														if (!result.valid) {
															return result.message;
														}

														return undefined;
													} catch (error) {
														console.error("Username check error:", error);
														return "Unable to verify username.";
													}
												},
											}}
											children={(field) => {
												const hasChanged =
													field.state.value !== (user.username || "");
												const isValidating = field.state.meta.isValidating;
												const hasErrors =
													field.state.meta.errors &&
													field.state.meta.errors.length > 0;
												const isInvalid =
													field.state.meta.isTouched &&
													hasErrors &&
													!isValidating;
												const isAvailable =
													hasChanged &&
													!hasErrors &&
													!isValidating &&
													field.state.meta.isTouched;

												// Get first error message
												const errorMessage = hasErrors
													? field.state.meta.errors[0]
													: null;
												const errorText =
													typeof errorMessage === "string"
														? errorMessage
														: errorMessage && "message" in errorMessage
															? errorMessage.message
															: null;

												return (
													<Tooltip open={isInvalid && !!errorText}>
														<TooltipTrigger
															render={
																<InputGroup
																	className={cn(
																		"h-8 w-44",
																		isInvalid && "border-destructive",
																		isAvailable && "border-green-500",
																	)}
																>
																	<InputGroupAddon align="inline-start">
																		<InputGroupText>
																			<HugeiconsIcon
																				icon={AtIcon}
																				className="size-4"
																				strokeWidth={2}
																			/>
																		</InputGroupText>
																	</InputGroupAddon>
																	<InputGroupInput
																		id={field.name}
																		name={field.name}
																		value={field.state.value}
																		onBlur={field.handleBlur}
																		onChange={(e) =>
																			field.handleChange(e.target.value)
																		}
																		aria-invalid={isInvalid}
																		className="text-sm"
																		autoComplete="off"
																		autoCorrect="off"
																		autoCapitalize="off"
																		spellCheck={false}
																	/>
																	<InputGroupAddon align="inline-end">
																		<InputGroupText>
																			{isValidating && (
																				<HugeiconsIcon
																					icon={Loading03Icon}
																					className="size-4 animate-spin"
																					strokeWidth={2}
																				/>
																			)}
																			{isAvailable && (
																				<HugeiconsIcon
																					icon={Tick02Icon}
																					className="size-4 text-green-600"
																					strokeWidth={2}
																				/>
																			)}
																		</InputGroupText>
																	</InputGroupAddon>
																</InputGroup>
															}
														/>
														<TooltipContent side="bottom" variant="destructive">
															{errorText}
														</TooltipContent>
													</Tooltip>
												);
											}}
										/>
									</SettingRow>
								</form>

								<div className="h-px bg-border/50" />

								{/* Email */}
								<SettingRow label="Email" description="Used for notifications">
									<div className="flex items-center gap-2">
										{user.emailVerified ? (
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
										) : (
											<Button
												variant="outline"
												size="sm"
												onClick={() => verificationMutation.mutate({})}
												disabled={verificationMutation.isPending}
											>
												{verificationMutation.isPending ? (
													<>
														<HugeiconsIcon
															icon={Loading03Icon}
															className="animate-spin"
															strokeWidth={2}
														/>
														Sending...
													</>
												) : (
													"Verify"
												)}
											</Button>
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
								<SettingRow label="Password" description="Secure your account">
									{passwordData?.hasPassword ? (
										user.emailVerified ? (
											<ChangePasswordDialog
												onOpenChange={setNestedDialogOpen}
											/>
										) : (
											<Tooltip>
												<TooltipTrigger
													render={
														<span className="inline-block">
															<Button variant="outline" size="sm" disabled>
																Change
															</Button>
														</span>
													}
												/>
												<TooltipContent>
													<p>Verify your email first</p>
												</TooltipContent>
											</Tooltip>
										)
									) : (
										<span className="text-xs text-muted-foreground">
											Signed in with Google
										</span>
									)}
								</SettingRow>
							</div>
						</section>

						{/* Billing Section */}
						<section
							ref={(el) => {
								sectionRefs.current.billing = el;
							}}
							data-section="billing"
							className="px-5 py-5"
						>
							<h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
								Billing
							</h3>

							<div className="space-y-1">
								{/* Current plan row */}
								<SettingRow label="Current plan">
									<Badge
										variant="secondary"
										className={cn(
											"h-5 px-1.5 text-[10px]",
											(planState?.status === "active" ||
												planState?.status === "canceled") &&
												"text-green-600 dark:text-green-400",
											planState?.status === "trialing" &&
												"text-blue-600 dark:text-blue-400",
											planState?.status === "expired" &&
												"text-amber-600 dark:text-amber-400",
										)}
									>
										{(planState?.status === "active" ||
											planState?.status === "canceled") &&
											(planState.plan === "team" ? "Team" : "Pro")}
										{planState?.status === "trialing" && "Trial"}
										{planState?.status === "expired" && "Trial expired"}
										{!planState && "Loading..."}
									</Badge>
								</SettingRow>

								{/* Billing cycle row — only for active/canceled subscribers */}
								{(planState?.status === "active" ||
									planState?.status === "canceled") &&
									planState.activeSlug && (
										<>
											<div className="h-px bg-border/50" />
											<SettingRow
												label="Billing cycle"
												description={(() => {
													const tier = TIERS.find(
														(t) => t.slug === planState.plan,
													);
													if (!tier) return undefined;
													const isAnnual =
														planState.activeSlug?.includes("annual");
													return isAnnual
														? `$${tier.annualPrice * 12}/year ($${tier.annualPrice}/mo)`
														: `$${tier.monthlyPrice}/month`;
												})()}
											>
												<span className="text-sm">
													{planState.activeSlug?.includes("annual")
														? "Annual"
														: "Monthly"}
												</span>
											</SettingRow>
										</>
									)}

								{/* Renewal / cancellation info */}
								{(planState?.status === "active" ||
									planState?.status === "canceled") &&
									planState.periodEnd && (
										<>
											<div className="h-px bg-border/50" />
											<SettingRow
												label={
													planState.status === "canceled" ? "Cancels" : "Renews"
												}
											>
												<span
													className={cn(
														"text-sm",
														planState.status === "canceled" &&
															"text-orange-600 dark:text-orange-400",
													)}
												>
													{new Date(planState.periodEnd).toLocaleDateString(
														undefined,
														{
															month: "short",
															day: "numeric",
															year: "numeric",
														},
													)}
												</span>
											</SettingRow>
										</>
									)}

								{/* Trial progress — only for trialing users */}
								{planState?.status === "trialing" &&
									planState.trialDaysRemaining !== null && (
										<>
											<div className="h-px bg-border/50" />
											<div className="py-3">
												<div className="mb-1.5 flex items-center justify-between">
													<span className="text-xs text-muted-foreground">
														Free trial
													</span>
													<span className="text-xs font-medium">
														{planState.trialDaysRemaining}{" "}
														{planState.trialDaysRemaining === 1
															? "day"
															: "days"}{" "}
														left
													</span>
												</div>
												<div className="h-1.5 overflow-hidden rounded-full bg-muted">
													<div
														className="h-full rounded-full bg-blue-500 transition-all"
														style={{
															width: `${Math.min(Math.max(((14 - planState.trialDaysRemaining) / 14) * 100, 0), 100)}%`,
														}}
													/>
												</div>
											</div>
										</>
									)}

								<div className="h-px bg-border/50" />

								{/* Actions */}
								<div className="py-3">
									{planState?.status === "active" ||
									planState?.status === "canceled" ? (
										<Button
											variant="outline"
											size="sm"
											onClick={async () => {
												await authClient.customer.portal();
											}}
										>
											Manage subscription
										</Button>
									) : (
										<Button
											size="sm"
											onClick={() => setPricingDialogOpen(true)}
											className="gap-1.5"
										>
											<HugeiconsIcon icon={SparklesIcon} className="size-3.5" />
											Upgrade to Pro
										</Button>
									)}
								</div>
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
			<PricingDialog
				open={pricingDialogOpen}
				onOpenChange={setPricingDialogOpen}
			/>
		</Dialog>
	);
}

import {
	AlertCircleIcon,
	SquareLock02Icon,
	Tick02Icon,
	ViewIcon,
	ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
} from "@/components/ui/input-group";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import authClient from "@/lib/auth/auth-client";
import { passwordSchema } from "@/lib/auth/functions";

const resetPasswordSearchSchema = z.object({
	token: z.string().optional(),
	error: z.string().optional(),
});

export const Route = createFileRoute("/(auth-pages)/reset-password")({
	component: RouteComponent,
	validateSearch: resetPasswordSearchSchema,
	head: () => ({
		meta: [
			{ title: "Set New Password - InspoSnaps" },
			{ name: "robots", content: "noindex, nofollow" },
		],
	}),
});

const resetPasswordFormSchema = z
	.object({
		newPassword: passwordSchema,
		confirmPassword: z.string().min(1, "Please confirm your new password."),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match.",
		path: ["confirmPassword"],
	});

function RouteComponent() {
	const navigate = useNavigate();
	const { token, error: urlError } = Route.useSearch();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [resetSuccess, setResetSuccess] = useState(false);

	const { mutate: resetPasswordMutate, isPending } = useMutation({
		mutationFn: async (data: { newPassword: string }) => {
			if (!token) {
				throw new Error("Invalid or missing reset token.");
			}

			const result = await authClient.resetPassword({
				newPassword: data.newPassword,
				token,
			});

			if (result.error) {
				throw new Error(
					result.error.message || "Failed to reset password. Please try again.",
				);
			}

			return result;
		},
		onSuccess: () => {
			setResetSuccess(true);
			toast.success("Password reset successfully!");
		},
		onError: (error) => {
			toast.error(
				error.message || "Failed to reset password. Please try again.",
			);
		},
	});

	const form = useForm({
		defaultValues: {
			newPassword: "",
			confirmPassword: "",
		},
		validators: {
			onSubmit: resetPasswordFormSchema,
		},
		onSubmit: async ({ value }) => {
			if (isPending) return;
			resetPasswordMutate({ newPassword: value.newPassword });
		},
	});

	// Show error state if token is invalid or missing
	if (urlError === "INVALID_TOKEN" || (!token && !resetSuccess)) {
		return (
			<AuthPageLayout>
				<div className="flex flex-col items-center max-w-100 w-full">
					<div className="flex justify-center items-center p-4 rounded-full bg-linear-to-t from-background to-destructive/20">
						<div className="flex items-center justify-center bg-card rounded-full p-4 border border-destructive/30">
							<HugeiconsIcon
								icon={AlertCircleIcon}
								size={32}
								className="text-destructive"
							/>
						</div>
					</div>
					<div className="flex flex-col items-center gap-1 mt-2">
						<h1 className="text-2xl font-medium">Invalid reset link</h1>
						<span className="text-muted-foreground text-center">
							This password reset link is invalid or has expired. Please request
							a new one.
						</span>
					</div>
					<div className="flex flex-col gap-3 w-full mt-6">
						<Link
							to="/forgot-password"
							className={buttonVariants({ className: "w-full" })}
						>
							Request new reset link
						</Link>
						<FieldDescription className="text-center">
							Remember your password? <Link to="/login">Login</Link>
						</FieldDescription>
					</div>
				</div>
			</AuthPageLayout>
		);
	}

	// Show success state
	if (resetSuccess) {
		return (
			<AuthPageLayout>
				<div className="flex flex-col items-center max-w-100 w-full">
					<div className="flex justify-center items-center p-4 rounded-full bg-linear-to-t from-background to-green-500/20">
						<div className="flex items-center justify-center bg-card rounded-full p-4 border border-green-500/30">
							<HugeiconsIcon
								icon={Tick02Icon}
								size={32}
								className="text-green-600"
							/>
						</div>
					</div>
					<div className="flex flex-col items-center gap-1 mt-2">
						<h1 className="text-2xl font-medium">Password reset!</h1>
						<span className="text-muted-foreground text-center">
							Your password has been successfully reset. You can now login with
							your new password.
						</span>
					</div>
					<div className="flex flex-col gap-3 w-full mt-6">
						<Button
							onClick={() => navigate({ to: "/login" })}
							className="w-full"
						>
							Continue to login
						</Button>
					</div>
				</div>
			</AuthPageLayout>
		);
	}

	// Show reset password form
	return (
		<AuthPageLayout>
			<div className="flex flex-col items-center max-w-100 w-full">
				<div className="flex justify-center items-center p-4 rounded-full bg-linear-to-t from-background to-accent">
					<div className="flex items-center justify-center bg-card rounded-full p-4 border">
						<HugeiconsIcon
							icon={SquareLock02Icon}
							size={32}
							className="text-foreground"
						/>
					</div>
				</div>
				<div className="flex flex-col items-center gap-1 mt-2">
					<h1 className="text-2xl font-medium">Set new password</h1>
					<span className="text-muted-foreground text-center">
						Enter your new password below.
					</span>
				</div>
				<form
					id="reset-password-form"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
					className="w-full mt-6"
				>
					<FieldGroup className="gap-4">
						<form.Field
							name="newPassword"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name} required>
											New Password
										</FieldLabel>
										<InputGroup>
											<InputGroupAddon align="inline-start">
												<InputGroupText>
													<HugeiconsIcon
														icon={SquareLock02Icon}
														size={18}
														strokeWidth={2}
													/>
												</InputGroupText>
											</InputGroupAddon>
											<InputGroupInput
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												autoComplete="new-password"
												type={showPassword ? "text" : "password"}
											/>
											<InputGroupAddon align="inline-end">
												<Tooltip>
													<TooltipTrigger
														render={(props) => (
															<InputGroupButton
																{...props}
																onClick={() => setShowPassword(!showPassword)}
																size="icon-xs"
															>
																<HugeiconsIcon
																	icon={
																		showPassword ? ViewIcon : ViewOffSlashIcon
																	}
																	size={18}
																	strokeWidth={2}
																/>
															</InputGroupButton>
														)}
													/>
													<TooltipContent>
														<p>
															{showPassword ? "Hide password" : "Show password"}
														</p>
													</TooltipContent>
												</Tooltip>
											</InputGroupAddon>
										</InputGroup>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} showAll />
										)}
									</Field>
								);
							}}
						/>
						<form.Field
							name="confirmPassword"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name} required>
											Confirm Password
										</FieldLabel>
										<InputGroup>
											<InputGroupAddon align="inline-start">
												<InputGroupText>
													<HugeiconsIcon
														icon={SquareLock02Icon}
														size={18}
														strokeWidth={2}
													/>
												</InputGroupText>
											</InputGroupAddon>
											<InputGroupInput
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												autoComplete="new-password"
												type={showConfirmPassword ? "text" : "password"}
											/>
											<InputGroupAddon align="inline-end">
												<Tooltip>
													<TooltipTrigger
														render={(props) => (
															<InputGroupButton
																{...props}
																onClick={() =>
																	setShowConfirmPassword(!showConfirmPassword)
																}
																size="icon-xs"
															>
																<HugeiconsIcon
																	icon={
																		showConfirmPassword
																			? ViewIcon
																			: ViewOffSlashIcon
																	}
																	size={18}
																	strokeWidth={2}
																/>
															</InputGroupButton>
														)}
													/>
													<TooltipContent>
														<p>
															{showConfirmPassword
																? "Hide password"
																: "Show password"}
														</p>
													</TooltipContent>
												</Tooltip>
											</InputGroupAddon>
										</InputGroup>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
					</FieldGroup>
					<Field className="mt-6">
						<Button
							type="submit"
							form="reset-password-form"
							className="w-full"
							disabled={isPending}
						>
							{isPending ? "Resetting..." : "Reset password"}
						</Button>
						<FieldDescription className="text-center">
							Remember your password? <Link to="/login">Login</Link>
						</FieldDescription>
					</Field>
				</form>
			</div>
		</AuthPageLayout>
	);
}

import { Mail01Icon, ResetPasswordIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
} from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "@/components/ui/input-group";
import authClient from "@/lib/auth/auth-client";

export const Route = createFileRoute("/(auth-pages)/forgot-password")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{ title: "Reset Password - InspoSnaps" },
			{ name: "robots", content: "noindex, nofollow" },
		],
	}),
});

const forgotPasswordSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required.")
		.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address."),
});

function RouteComponent() {
	const [emailSent, setEmailSent] = useState(false);
	const [submittedEmail, setSubmittedEmail] = useState("");

	const { mutate: requestResetMutate, isPending } = useMutation({
		mutationFn: async (data: { email: string }) => {
			const result = await authClient.requestPasswordReset({
				email: data.email,
				redirectTo: "/reset-password",
			});

			if (result.error) {
				throw new Error(result.error.message || "Failed to send reset email.");
			}

			return result;
		},
		onSuccess: (_data, variables) => {
			setSubmittedEmail(variables.email);
			setEmailSent(true);
			toast.success("Reset link sent! Check your email.");
		},
		onError: (error) => {
			// Don't reveal whether email exists - show success regardless for security
			// But log the actual error for debugging
			console.error("Password reset error:", error);
			setSubmittedEmail(form.state.values.email);
			setEmailSent(true);
			toast.success("If an account exists, a reset link has been sent.");
		},
	});

	const form = useForm({
		defaultValues: {
			email: "",
		},
		validators: {
			onSubmit: forgotPasswordSchema,
		},
		onSubmit: async ({ value }) => {
			if (isPending) return;
			requestResetMutate({ email: value.email });
		},
	});

	if (emailSent) {
		return (
			<AuthPageLayout>
				<div className="flex flex-col items-center max-w-100 w-full">
					<div className="flex justify-center items-center p-4 rounded-full bg-linear-to-t from-background to-accent">
						<div className="flex items-center justify-center bg-card rounded-full p-4 border">
							<HugeiconsIcon
								icon={Mail01Icon}
								size={32}
								className="text-foreground"
							/>
						</div>
					</div>
					<div className="flex flex-col items-center gap-1 mt-2">
						<h1 className="text-2xl font-medium">Check your email</h1>
						<span className="text-muted-foreground text-center">
							If an account exists for{" "}
							<span className="font-medium text-foreground">
								{submittedEmail}
							</span>
							, we&apos;ve sent a password reset link.
						</span>
					</div>
					<div className="flex flex-col gap-3 w-full mt-6">
						<Button
							variant="outline"
							onClick={() => {
								setEmailSent(false);
								form.reset();
							}}
							className="w-full"
						>
							Try a different email
						</Button>
						<FieldDescription className="text-center">
							Remember your password? <Link to="/login">Login</Link>
						</FieldDescription>
					</div>
				</div>
			</AuthPageLayout>
		);
	}

	return (
		<AuthPageLayout>
			<div className="flex flex-col items-center max-w-100 w-full">
				<div className="flex justify-center items-center p-4 rounded-full bg-linear-to-t from-background to-accent">
					<div className="flex items-center justify-center bg-card rounded-full p-4 border">
						<HugeiconsIcon
							icon={ResetPasswordIcon}
							size={32}
							className="text-foreground"
						/>
					</div>
				</div>
				<div className="flex flex-col items-center gap-1 mt-2">
					<h1 className="text-2xl font-medium">Forgot your password?</h1>
					<span className="text-muted-foreground text-center">
						We&apos;ll send you a reset link.
					</span>
				</div>
				<form
					id="forgot-password-form"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
					className="w-full mt-6"
				>
					<FieldGroup className="gap-4">
						<form.Field
							name="email"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<InputGroup>
											<InputGroupAddon align="inline-start">
												<InputGroupText>
													<HugeiconsIcon
														icon={Mail01Icon}
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
												autoComplete="email"
												placeholder="Enter your email address"
											/>
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
							form="forgot-password-form"
							className="w-full"
							disabled={isPending}
						>
							{isPending ? "Sending..." : "Send reset link"}
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

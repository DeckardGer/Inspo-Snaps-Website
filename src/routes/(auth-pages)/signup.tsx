import {
	AtIcon,
	Loading03Icon,
	Mail01Icon,
	SquareLock02Icon,
	Tick02Icon,
	UserIcon,
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
import { SocialSignInButton } from "@/components/SocialSignInButton";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Google } from "@/components/ui/svgs/google";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import authClient from "@/lib/auth/auth-client";
import { checkUsernameAvailability } from "@/lib/auth/functions";
import { authQueryOptions } from "@/lib/auth/queries";

// Helper to transform TanStack Form errors to FieldError format
function transformFormErrors(
	errors: Array<string | { message?: string } | undefined> | undefined,
): Array<{ message?: string } | undefined> | undefined {
	return errors?.map((error) => {
		if (typeof error === "string") {
			return { message: error };
		}
		return error;
	});
}

export const Route = createFileRoute("/(auth-pages)/signup")({
	component: RouteComponent,
});

const signupFormSchema = z.object({
	username: z
		.string()
		.min(3, "Username must be at least 3 characters.")
		.max(30, "Username must be at most 30 characters.")
		.regex(
			/^[a-zA-Z0-9._]+$/,
			"Username can only contain alphanumeric characters, underscores, and dots.",
		),
	email: z
		.string()
		.min(1, "Email is required.")
		.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address."),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters.")
		.regex(/[a-z]/, "Password must contain at least one lowercase letter.")
		.regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
		.regex(/[0-9]/, "Password must contain at least one number.")
		.regex(
			/[^a-zA-Z0-9]/,
			"Password must contain at least one special character.",
		),
});

function RouteComponent() {
	const navigate = useNavigate();
	const { queryClient, redirectUrl } = Route.useRouteContext();
	const [showPassword, setShowPassword] = useState(false);

	const { mutate: signupMutate, isPending } = useMutation({
		mutationFn: async (data: {
			username: string;
			email: string;
			password: string;
		}) => {
			await authClient.signUp.email(
				{
					...data,
					name: data.username,
					callbackURL: redirectUrl,
				},
				{
					onError: ({ error }) => {
						toast.error(error.message || "An error occurred while signing up.");
					},
					onSuccess: () => {
						queryClient.removeQueries({
							queryKey: authQueryOptions().queryKey,
						});
						navigate({ to: redirectUrl });
					},
				},
			);
		},
	});

	const form = useForm({
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
		validators: {
			onSubmit: signupFormSchema,
		},
		onSubmit: async ({ value }) => {
			if (isPending) return;

			signupMutate({
				username: value.username,
				email: value.email,
				password: value.password,
			});
		},
	});

	return (
		<div className="flex h-screen p-2">
			<div className="w-full lg:w-2/5 lg:max-w-200 flex flex-col">
				<div className="flex justify-between text-muted-foreground py-4 px-8">
					<div>InspoSnaps Icon</div>
				</div>
				<div className="flex-1 overflow-y-auto px-8">
					<div className="flex items-center justify-center min-h-full">
						<div className="flex flex-col items-center max-w-100 w-full">
							<div className="flex justify-center items-center p-4 rounded-full bg-linear-to-t from-background to-accent">
								<div className="flex items-center justify-center bg-card rounded-full p-4 border">
									<HugeiconsIcon
										icon={UserIcon}
										size={32}
										className="text-foreground"
									/>
								</div>
							</div>
							<div className="flex flex-col items-center gap-1 mt-2">
								<h1 className="text-2xl font-medium">Sign up to InspoSnaps</h1>
								<span className="text-muted-foreground">
									Enter your details to signup.
								</span>
							</div>
							<div className="flex gap-3 w-full mt-4">
								<SocialSignInButton
									provider="google"
									logo={<Google />}
									callbackURL={redirectUrl}
								/>
							</div>
							<form
								id="signup-form"
								onSubmit={(e) => {
									e.preventDefault();
									form.handleSubmit();
								}}
								className="w-full mt-6"
							>
								<FieldGroup className="gap-4">
									<FieldSeparator className="text-secondary-foreground">
										OR
									</FieldSeparator>
									<form.Field
										name="username"
										validators={{
											onChangeAsyncDebounceMs: 500,
											onChangeAsync: async ({ value }) => {
												// Empty value is valid (no error)
												if (!value) {
													return undefined;
												}

												try {
													const result = await checkUsernameAvailability({
														data: { username: value },
													});

													// Backend validates format and checks availability
													if (!result.valid) {
														return result.message;
													}

													return undefined;
												} catch (error) {
													// Network or other errors
													console.error("Username check error:", error);
													return "Unable to verify username. Please try again.";
												}
											},
										}}
										children={(field) => {
											const hasValue = field.state.value.length > 0;
											const isValidating = field.state.meta.isValidating;
											const hasErrors =
												field.state.meta.errors &&
												field.state.meta.errors.length > 0;
											const isInvalid = hasValue && hasErrors && !isValidating;
											const isAvailable =
												hasValue &&
												!hasErrors &&
												!isValidating &&
												field.state.meta.isTouched;

											const transformedErrors = transformFormErrors(
												field.state.meta.errors,
											);

											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel htmlFor={field.name} required>
														Username
													</FieldLabel>
													<div className="relative">
														<HugeiconsIcon
															icon={AtIcon}
															size={18}
															strokeWidth={2}
															className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
														/>
														<Input
															id={field.name}
															name={field.name}
															value={field.state.value}
															onBlur={field.handleBlur}
															onChange={(e) =>
																field.handleChange(e.target.value)
															}
															aria-invalid={isInvalid}
															autoComplete="username"
															spellCheck={false}
															className="pl-10 pr-10"
														/>
														{isValidating && (
															<HugeiconsIcon
																icon={Loading03Icon}
																size={18}
																strokeWidth={2}
																className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground animate-spin"
															/>
														)}
														{isAvailable && (
															<HugeiconsIcon
																icon={Tick02Icon}
																size={18}
																strokeWidth={2}
																className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600"
															/>
														)}
													</div>
													{isInvalid && (
														<FieldError errors={transformedErrors} />
													)}
												</Field>
											);
										}}
									/>
									<form.Field
										name="email"
										children={(field) => {
											const isInvalid =
												field.state.meta.isTouched && !field.state.meta.isValid;
											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel htmlFor={field.name} required>
														Email
													</FieldLabel>
													<div className="relative">
														<HugeiconsIcon
															icon={Mail01Icon}
															size={18}
															strokeWidth={2}
															className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
														/>
														<Input
															id={field.name}
															name={field.name}
															value={field.state.value}
															onBlur={field.handleBlur}
															onChange={(e) =>
																field.handleChange(e.target.value)
															}
															aria-invalid={isInvalid}
															autoComplete="email"
															className="pl-10"
														/>
													</div>
													{isInvalid && (
														<FieldError errors={field.state.meta.errors} />
													)}
												</Field>
											);
										}}
									/>
									<form.Field
										name="password"
										children={(field) => {
											const isInvalid =
												field.state.meta.isTouched && !field.state.meta.isValid;
											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel htmlFor={field.name} required>
														Password
													</FieldLabel>
													<div className="relative">
														<HugeiconsIcon
															icon={SquareLock02Icon}
															size={18}
															strokeWidth={2}
															className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
														/>
														<Input
															id={field.name}
															name={field.name}
															value={field.state.value}
															onBlur={field.handleBlur}
															onChange={(e) =>
																field.handleChange(e.target.value)
															}
															aria-invalid={isInvalid}
															autoComplete="new-password"
															type={showPassword ? "text" : "password"}
															className="pl-10 pr-10"
														/>
														<Tooltip>
															<TooltipTrigger
																render={
																	<Button
																		onClick={() =>
																			setShowPassword(!showPassword)
																		}
																		variant="link"
																		size="icon"
																		className="absolute right-[8px] top-1/2 -translate-y-1/2 size-6"
																	>
																		<HugeiconsIcon
																			icon={
																				showPassword
																					? ViewIcon
																					: ViewOffSlashIcon
																			}
																			size={18}
																			strokeWidth={2}
																			className="text-muted-foreground"
																		/>
																	</Button>
																}
															/>
															<TooltipContent>
																<p>
																	{showPassword
																		? "Hide password"
																		: "Show password"}
																</p>
															</TooltipContent>
														</Tooltip>
													</div>
													{isInvalid && (
														<FieldError
															errors={field.state.meta.errors}
															showAll
														/>
													)}
												</Field>
											);
										}}
									/>
								</FieldGroup>
								<Field className="mt-6">
									<Button type="submit" form="signup-form" className="w-full">
										Sign up
									</Button>
									<FieldDescription className="text-center">
										Already have an account? <Link to="/login">Login</Link>
									</FieldDescription>
								</Field>
							</form>
						</div>
					</div>
				</div>
				<span className="text-sm text-muted-foreground py-4 px-8">
					&copy; 2025 InspoSnaps.com
				</span>
			</div>
			<div className="hidden lg:flex lg:w-3/5 flex-1 justify-center items-center bg-secondary rounded-2xl"></div>
		</div>
	);
}

import {
	Mail01Icon,
	SquareLock02Icon,
	UserIcon,
	ViewIcon,
	ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
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

export const Route = createFileRoute("/(auth-pages)/login")({
	component: RouteComponent,
});

const loginFormSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required.")
		.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address."),
	password: z.string().min(1, "Password is required."),
});

function RouteComponent() {
	const { redirectUrl } = Route.useRouteContext();
	const [showPassword, setShowPassword] = useState(false);

	const { mutate: emailLoginMutate, isPending } = useMutation({
		mutationFn: async (data: { email: string; password: string }) =>
			await authClient.signIn.email(
				{
					...data,
					callbackURL: redirectUrl,
				},
				{
					onError: ({ error }) => {
						toast.error(error.message || "An error occurred while signing in.");
					},
					// better-auth seems to trigger a hard navigation on login,
					// so we don't have to revalidate & navigate ourselves
					// onSuccess: () => {
					//   queryClient.removeQueries({ queryKey: authQueryOptions().queryKey });
					//   navigate({ to: redirectUrl });
					// },
				},
			),
	});

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onSubmit: loginFormSchema,
		},
		onSubmit: async ({ value }) => {
			if (isPending) return;

			emailLoginMutate({ email: value.email, password: value.password });
		},
	});

	return (
		<div className="flex h-screen p-2">
			<div className="w-full lg:w-2/5 max-w-200 flex flex-col">
				<div className="flex justify-between py-4 px-8">
					<div>InspoSnaps Icon</div>
				</div>
				<div className="flex-1 overflow-y-auto px-8">
					<div className="flex items-center justify-center min-h-full">
						<div className="flex flex-col items-center max-w-100 w-full">
							<div className="flex justify-center items-center p-4 rounded-full bg-linear-to-t from-bg-primary to-bg-tertiary">
								<div className="flex items-center justify-center bg-bg-primary rounded-full p-4 border border-border-primary">
									<HugeiconsIcon
										icon={UserIcon}
										size={32}
										className="text-fg-secondary"
									/>
								</div>
							</div>
							<div className="flex flex-col items-center gap-1 mt-2">
								<h1 className="text-2xl font-medium">Login to your account</h1>
								<span className="text-text-tertiary">
									Enter your details to login.
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
								id="login-form"
								onSubmit={(e) => {
									e.preventDefault();
									form.handleSubmit();
								}}
								className="w-full mt-6"
							>
								<FieldGroup className="gap-4">
									<FieldSeparator className="text-text-quaternary">
										OR
									</FieldSeparator>
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
															className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
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
													<div className="flex items-center justify-between w-full">
														<FieldLabel htmlFor={field.name} required>
															Password
														</FieldLabel>
														<Button
															variant="link"
															className="p-0 h-auto leading-snug"
														>
															Forgot Password?
														</Button>
													</div>
													<div className="relative">
														<HugeiconsIcon
															icon={SquareLock02Icon}
															size={18}
															strokeWidth={2}
															className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
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
															autoComplete="current-password"
															type={showPassword ? "text" : "password"}
															className="pl-10 pr-10"
														/>
														<Tooltip>
															<TooltipTrigger asChild>
																<Button
																	onClick={() => setShowPassword(!showPassword)}
																	variant="link"
																	size="icon"
																	className="absolute right-[2px] top-1/2 -translate-y-1/2"
																>
																	<HugeiconsIcon
																		icon={
																			showPassword ? ViewIcon : ViewOffSlashIcon
																		}
																		size={18}
																		strokeWidth={2}
																	/>
																</Button>
															</TooltipTrigger>
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
														<FieldError errors={field.state.meta.errors} />
													)}
												</Field>
											);
										}}
									/>
								</FieldGroup>
								<Field className="mt-6">
									<Button type="submit" form="login-form" className="w-full">
										Login
									</Button>
									<FieldDescription className="text-center">
										Don&apos;t have an account?{" "}
										<Link to="/signup">Sign up</Link>
									</FieldDescription>
								</Field>
							</form>
						</div>
					</div>
				</div>
				<div className="text-sm text-text-tertiary py-4 px-8">
					&copy; 2025 InspoSnaps.com
				</div>
			</div>
			<div className="hidden lg:flex lg:w-3/5 flex-1 justify-center items-center bg-bg-tertiary rounded-2xl">
				<div className="flex justify-center items-center w-200 h-160 bg-bg-quaternary">
					Social Proof
				</div>
			</div>
		</div>
	);
}

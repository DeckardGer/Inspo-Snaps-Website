import {
	AtIcon,
	Mail01Icon,
	SquareLock02Icon,
	UserIcon,
	ViewIcon,
	ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
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

export const Route = createFileRoute("/(auth-pages)/signup")({
	component: RouteComponent,
});

const signupFormSchema = z.object({
	username: z
		.string()
		.min(3, "Username must be at least 3 characters.")
		.max(20, "Username must be at most 20 characters.")
		.regex(
			/^[a-zA-Z0-9._-]+$/,
			"Username can only contain letters, numbers, periods, underscores, and hyphens.",
		),
	email: z
		.string()
		.min(1, "Email is required.")
		.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address."),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters.")
		.regex(/[a-z]/, "Password must contain at least one lowercase letter.")
		.regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
		.regex(/[0-9]/, "Password must contain at least one number.")
		.regex(
			/[^a-zA-Z0-9]/,
			"Password must contain at least one special character.",
		),
	confirmPassword: z.string().min(1, "Confirm Password is required."),
});

function RouteComponent() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const form = useForm({
		defaultValues: {
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
		validators: {
			onSubmit: signupFormSchema,
		},
		onSubmit: async ({ value }) => {
			toast("You submitted the following values:", {
				description: (
					<pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
						<code>{JSON.stringify(value, null, 2)}</code>
					</pre>
				),
				position: "bottom-right",
				classNames: {
					content: "flex flex-col gap-2",
				},
				style: {
					"--border-radius": "calc(var(--radius)  + 4px)",
				} as React.CSSProperties,
			});
		},
	});

	return (
		<div className="flex h-screen p-2">
			<div className="w-full lg:w-2/5 max-w-200 flex flex-col">
				<div className="flex justify-between py-4 px-8">
					<div>InspoSnaps Icon</div>
				</div>
				<div className="flex-1 overflow-y-auto px-8">
					<div className="flex items-center justify-center min-h-full py-8">
						<div className="flex flex-col items-center max-w-100 w-full">
							<div className="flex justify-center items-center p-4 rounded-full bg-linear-to-t from-bg-primary to-bg-tertiary">
								<div className="flex items-center justify-center bg-bg-primary rounded-full p-4 border border-border-primary">
									<HugeiconsIcon
										icon={UserIcon}
										size={36}
										className="text-fg-secondary"
									/>
								</div>
							</div>
							<div className="flex flex-col items-center gap-1 mt-2">
								<h1 className="text-2xl font-medium">Sign up to InspoSnaps</h1>
								<span className="text-text-tertiary">
									Enter your details to signup.
								</span>
							</div>
							<div className="flex gap-3 w-full mt-6">
								<Button variant="outline" className="flex-1">
									<Google />
									Login with Google
								</Button>
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
									<FieldSeparator className="text-text-quaternary">
										OR
									</FieldSeparator>
									<form.Field
										name="username"
										children={(field) => {
											const isInvalid =
												field.state.meta.isTouched && !field.state.meta.isValid;
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
															autoComplete="on"
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
															autoComplete="on"
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
															autoComplete="on"
															type={showPassword ? "text" : "password"}
															className="pl-10 pr-10"
														/>
														<button
															type="button"
															onClick={() => setShowPassword(!showPassword)}
															className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
															aria-label={
																showPassword ? "Hide password" : "Show password"
															}
														>
															<HugeiconsIcon
																icon={
																	showPassword ? ViewIcon : ViewOffSlashIcon
																}
																size={18}
																strokeWidth={2}
															/>
														</button>
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
															autoComplete="on"
															type={showConfirmPassword ? "text" : "password"}
															className="pl-10 pr-10"
														/>
														<button
															type="button"
															onClick={() =>
																setShowConfirmPassword(!showConfirmPassword)
															}
															className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
															aria-label={
																showConfirmPassword
																	? "Hide password"
																	: "Show password"
															}
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
														</button>
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
				<div className="text-sm text-text-tertiary py-4 px-8">
					&copy; 2025 InspoSnaps.com
				</div>
			</div>
			<div className="hidden lg:flex flex-1 justify-center items-center bg-bg-tertiary rounded-2xl">
				<div className="flex justify-center items-center w-200 h-160 bg-bg-quaternary">
					Social Proof
				</div>
			</div>
		</div>
	);
}

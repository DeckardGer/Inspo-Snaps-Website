import {
	Mail01Icon,
	SquareLock02Icon,
	UserIcon,
	ViewIcon,
	ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Google } from "@/components/ui/svgs/google";

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
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onSubmit: loginFormSchema,
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
		<div className="flex min-h-screen p-2">
			<div className="w-2/5 py-4 px-8 flex flex-col justify-between">
				<div className="flex justify-between">
					<div>Icon</div>
					<div>Right</div>
				</div>
				<div className="flex items-center justify-center">
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
							<h1 className="text-2xl font-medium">Login to your account</h1>
							<span className="text-text-tertiary">
								Enter your details to login.
							</span>
						</div>
						<div className="flex gap-3 w-full mt-8">
							<Button variant="outline" className="flex-1">
								<Google />
								Login with Google
							</Button>
						</div>
						<form
							id="login-form"
							onSubmit={(e) => {
								e.preventDefault();
								form.handleSubmit();
							}}
							className="w-full mt-8"
						>
							<FieldGroup>
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
														onChange={(e) => field.handleChange(e.target.value)}
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
														onChange={(e) => field.handleChange(e.target.value)}
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
															icon={showPassword ? ViewIcon : ViewOffSlashIcon}
															size={18}
															strokeWidth={2}
														/>
													</button>
												</div>
												{isInvalid && (
													<FieldError errors={field.state.meta.errors} />
												)}
											</Field>
										);
									}}
								/>
							</FieldGroup>
							<Field orientation="horizontal" className="mt-6">
								<Button type="submit" form="login-form" className="w-full">
									Login
								</Button>
							</Field>
						</form>
					</div>
				</div>
				<div className="text-sm text-text-tertiary">
					&copy; 2025 InspoSnaps.com
				</div>
			</div>
			<div className="flex justify-center items-center w-3/5 bg-bg-tertiary rounded-2xl">
				<div className="flex justify-center items-center w-200 h-160 bg-bg-quaternary">
					Social Proof
				</div>
			</div>
		</div>
	);
}

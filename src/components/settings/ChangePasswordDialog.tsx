import {
	Loading03Icon,
	SquareLock02Icon,
	ViewIcon,
	ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Field,
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
import { changePassword, passwordSchema } from "@/lib/auth/functions";

const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, "Current password is required."),
		newPassword: passwordSchema,
		confirmPassword: z.string().min(1, "Please confirm your new password."),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match.",
		path: ["confirmPassword"],
	})
	.refine((data) => data.currentPassword !== data.newPassword, {
		message: "New password must be different from current password.",
		path: ["newPassword"],
	});

function PasswordField({
	field,
	label,
	showPassword,
	onToggleShow,
	autoComplete,
}: {
	field: {
		name: string;
		state: {
			value: string;
			meta: {
				isTouched: boolean;
				isValid: boolean;
				errors: Array<string | { message?: string } | undefined> | undefined;
			};
		};
		handleBlur: () => void;
		handleChange: (value: string) => void;
	};
	label: string;
	showPassword: boolean;
	onToggleShow: () => void;
	autoComplete: string;
}) {
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	// Transform errors to FieldError format
	const transformedErrors = field.state.meta.errors?.map((error) => {
		if (typeof error === "string") return { message: error };
		return error;
	});

	return (
		<Field data-invalid={isInvalid}>
			<FieldLabel htmlFor={field.name} className="text-sm">
				{label}
			</FieldLabel>
			<InputGroup className="h-8">
				<InputGroupAddon align="inline-start">
					<InputGroupText>
						<HugeiconsIcon
							icon={SquareLock02Icon}
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
					onChange={(e) => field.handleChange(e.target.value)}
					aria-invalid={isInvalid}
					autoComplete={autoComplete}
					type={showPassword ? "text" : "password"}
					className="text-sm"
				/>
				<InputGroupAddon align="inline-end">
					<Tooltip>
						<TooltipTrigger
							render={(props) => (
								<InputGroupButton
									{...props}
									onClick={onToggleShow}
									size="icon-xs"
								>
									<HugeiconsIcon
										icon={showPassword ? ViewIcon : ViewOffSlashIcon}
										className="size-4"
										strokeWidth={2}
									/>
								</InputGroupButton>
							)}
						/>
						<TooltipContent>
							<p>{showPassword ? "Hide password" : "Show password"}</p>
						</TooltipContent>
					</Tooltip>
				</InputGroupAddon>
			</InputGroup>
			{isInvalid && <FieldError errors={transformedErrors} showAll />}
		</Field>
	);
}

interface ChangePasswordDialogProps {
	onOpenChange?: (open: boolean) => void;
}

export function ChangePasswordDialog({
	onOpenChange,
}: ChangePasswordDialogProps) {
	const [open, setOpen] = useState(false);
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const mutation = useMutation({
		mutationFn: changePassword,
		onSuccess: (result) => {
			toast.success(result.message);
			setOpen(false);
		},
		onError: (error) => {
			toast.error("Failed to change password", {
				description: error.message,
			});
		},
	});

	const form = useForm({
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
		validators: {
			onSubmit: changePasswordSchema,
		},
		onSubmit: async ({ value }) => {
			mutation.mutate({ data: value });
		},
	});

	const handleOpenChange = (nextOpen: boolean) => {
		setOpen(nextOpen);
		onOpenChange?.(nextOpen);
		if (!nextOpen) {
			form.reset();
			setShowCurrentPassword(false);
			setShowNewPassword(false);
			setShowConfirmPassword(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger
				render={
					<Button variant="outline" size="sm">
						Change
					</Button>
				}
			/>
			<DialogContent className="gap-4 p-5 sm:max-w-sm">
				<DialogHeader>
					<DialogTitle className="text-base">Change password</DialogTitle>
					<DialogDescription className="text-xs">
						Enter your current password and choose a new one.
					</DialogDescription>
				</DialogHeader>
				<form
					id="change-password-form"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<FieldGroup className="gap-3">
						<form.Field
							name="currentPassword"
							children={(field) => (
								<PasswordField
									field={field}
									label="Current password"
									showPassword={showCurrentPassword}
									onToggleShow={() =>
										setShowCurrentPassword(!showCurrentPassword)
									}
									autoComplete="current-password"
								/>
							)}
						/>
						<form.Field
							name="newPassword"
							children={(field) => (
								<PasswordField
									field={field}
									label="New password"
									showPassword={showNewPassword}
									onToggleShow={() => setShowNewPassword(!showNewPassword)}
									autoComplete="new-password"
								/>
							)}
						/>
						<form.Field
							name="confirmPassword"
							children={(field) => (
								<PasswordField
									field={field}
									label="Confirm new password"
									showPassword={showConfirmPassword}
									onToggleShow={() =>
										setShowConfirmPassword(!showConfirmPassword)
									}
									autoComplete="new-password"
								/>
							)}
						/>
					</FieldGroup>
				</form>
				<DialogFooter className="gap-2">
					<DialogClose
						render={
							<Button variant="outline" size="sm" disabled={mutation.isPending}>
								Cancel
							</Button>
						}
					/>
					<Button
						type="submit"
						form="change-password-form"
						size="sm"
						disabled={mutation.isPending}
					>
						{mutation.isPending ? (
							<>
								<HugeiconsIcon
									icon={Loading03Icon}
									className="size-4 animate-spin"
									strokeWidth={2}
								/>
								Changing...
							</>
						) : (
							"Change password"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

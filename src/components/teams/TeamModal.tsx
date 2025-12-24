import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
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
import { Input } from "@/components/ui/input";
import authClient from "@/lib/auth/auth-client";
import { userOrganizationsQueryOptions } from "@/lib/organizations/queries";

const formSchema = z.object({
	name: z
		.string()
		.min(1, "Team name is required")
		.max(100, "Team name must be at most 100 characters"),
});

interface TeamModalProps {
	trigger?: React.ReactElement;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function TeamModal({ trigger, open, onOpenChange }: TeamModalProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Use external control if provided, otherwise use internal state
	const dialogOpen = open ?? internalOpen;
	const setDialogOpen = onOpenChange ?? setInternalOpen;

	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const form = useForm({
		defaultValues: {
			name: "",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			setIsSubmitting(true);

			try {
				// Generate slug from name
				const slug = value.name
					.toLowerCase()
					.replace(/\s+/g, "-")
					.replace(/[^a-z0-9-]/g, "")
					.replace(/-+/g, "-")
					.replace(/^-|-$/g, "");

				const result = await authClient.organization.create({
					name: value.name.trim(),
					slug: `team-${slug}-${Date.now()}`,
				});

				if (result.error) {
					toast.error(result.error.message || "Failed to create team");
					return;
				}

				// Invalidate organizations query to refresh the list
				await queryClient.invalidateQueries({
					queryKey: userOrganizationsQueryOptions().queryKey,
				});

				toast.success("Team created successfully!");
				setDialogOpen(false);
				form.reset();

				navigate({
					to: "/team-folders/$orgId/{-$folderId}",
					params: { orgId: result.data.id },
				});
			} catch (error) {
				console.error(error);
				toast.error("Failed to create team");
			} finally {
				setIsSubmitting(false);
			}
		},
	});

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			{trigger && <DialogTrigger render={trigger} />}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create New Team</DialogTitle>
					<DialogDescription>
						Create a team to collaborate with others on shared folders.
					</DialogDescription>
				</DialogHeader>

				<form
					id="team-form"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<FieldGroup>
						<form.Field
							name="name"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name} required>
											Team Name
										</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder="Enter team name"
											autoComplete="off"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
					</FieldGroup>
				</form>

				<DialogFooter>
					<Button type="submit" form="team-form" disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<HugeiconsIcon
									icon={Loading03Icon}
									strokeWidth={2}
									className="animate-spin"
								/>
								Creating...
							</>
						) : (
							"Create Team"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

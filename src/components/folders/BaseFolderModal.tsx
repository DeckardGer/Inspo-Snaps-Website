import {
	Delete02Icon,
	Loading03Icon,
	SearchAddIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
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
	Drawer,
	DrawerContent,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { EmojiPicker } from "@/components/ui/emoji-picker";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import {
	COLOR_CLASSES,
	FOLDER_COLORS,
	type FolderColor,
} from "@/lib/folders/constants";

export const folderFormSchema = z.object({
	name: z
		.string()
		.min(1, "Folder name is required")
		.max(100, "Folder name must be at most 100 characters"),
	emoji: z.emoji().nullable(),
	color: z.enum(FOLDER_COLORS),
});

export type FolderFormValues = z.infer<typeof folderFormSchema>;

export interface BaseFolderModalFolder {
	id: string;
	name: string;
	emoji?: string | null;
	color: FolderColor;
}

export interface BaseFolderModalProps {
	/** Existing folder for edit mode (undefined for create mode) */
	folder?: BaseFolderModalFolder;
	/** Trigger element to open the modal */
	trigger?: React.ReactElement;
	/** Controlled open state */
	open?: boolean;
	/** Controlled open state handler */
	onOpenChange?: (open: boolean) => void;
	/** Unique form ID */
	formId: string;
	/** Description text for create mode */
	createDescription?: string;
	/** Called when form is submitted with valid values */
	onSubmit: (values: FolderFormValues, isEditing: boolean) => void;
	/** Whether a mutation is pending */
	isPending: boolean;
}

export function BaseFolderModal({
	folder,
	trigger,
	open,
	onOpenChange,
	formId,
	createDescription = "Add a new folder to organize your content.",
	onSubmit,
	isPending,
}: BaseFolderModalProps) {
	const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
	const [emojiDrawerOpen, setEmojiDrawerOpen] = useState(false);
	const [internalOpen, setInternalOpen] = useState(false);

	// Use external control if provided, otherwise use internal state
	const dialogOpen = open ?? internalOpen;
	const setDialogOpen = onOpenChange ?? setInternalOpen;
	const isMobile = useIsMobile();
	const isEditing = !!folder;

	const form = useForm({
		defaultValues: {
			name: folder?.name ?? "",
			emoji: folder?.emoji ?? null,
			color: folder?.color ?? "indigo",
		},
		validators: {
			onSubmit: folderFormSchema,
		},
		onSubmit: async ({ value }) => {
			onSubmit(value, isEditing);
		},
	});

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			{trigger && <DialogTrigger render={trigger} />}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{isEditing ? "Edit Folder" : "Create New Folder"}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Update the folder name, icon, and color."
							: createDescription}
					</DialogDescription>
				</DialogHeader>

				<form
					id={formId}
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
											Name
										</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder="Enter folder name"
											autoComplete="off"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>

						<form.Field
							name="emoji"
							children={(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>Icon</FieldLabel>
									<div className="flex gap-2">
										{isMobile ? (
											<Drawer
												open={emojiDrawerOpen}
												onOpenChange={setEmojiDrawerOpen}
											>
												<DrawerTrigger asChild>
													<Button
														id={field.name}
														type="button"
														variant="outline"
														className="flex-1 justify-start focus-visible:border-ring! font-normal"
													>
														{field.state.value ? (
															<span className="text-xl">
																{field.state.value}
															</span>
														) : (
															<>
																<HugeiconsIcon
																	icon={SearchAddIcon}
																	strokeWidth={2}
																/>
																<span>Select an Emoji</span>
															</>
														)}
													</Button>
												</DrawerTrigger>
												<DrawerContent className="bg-popover">
													<DrawerTitle className="sr-only">
														Select an Emoji
													</DrawerTitle>
													<EmojiPicker
														onEmojiSelect={(emoji) => {
															field.handleChange(emoji.emoji);
															setEmojiDrawerOpen(false);
														}}
													/>
												</DrawerContent>
											</Drawer>
										) : (
											<Popover
												open={emojiPickerOpen}
												onOpenChange={setEmojiPickerOpen}
											>
												<PopoverTrigger
													render={
														<Button
															id={field.name}
															variant="outline"
															className="flex-1 justify-start focus-visible:border-ring! font-normal"
														/>
													}
												>
													{field.state.value ? (
														<span className="text-xl">{field.state.value}</span>
													) : (
														<>
															<HugeiconsIcon
																icon={SearchAddIcon}
																strokeWidth={2}
															/>
															<span>Select an Emoji</span>
														</>
													)}
												</PopoverTrigger>
												<PopoverContent
													className="w-[var(--anchor-width)] p-0"
													align="start"
												>
													<EmojiPicker
														onEmojiSelect={(emoji) => {
															field.handleChange(emoji.emoji);
															setEmojiPickerOpen(false);
														}}
														className="h-80"
													/>
												</PopoverContent>
											</Popover>
										)}

										{field.state.value && (
											<Button
												variant="destructive"
												size="icon"
												className="border-destructive/50 focus-visible:border-destructive"
												onClick={() => field.handleChange(null)}
											>
												<HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
											</Button>
										)}
									</div>
								</Field>
							)}
						/>

						<form.Field
							name="color"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Color</FieldLabel>
										<Select
											name={field.name}
											value={field.state.value}
											onValueChange={(value) => {
												if (value) field.handleChange(value);
											}}
										>
											<SelectTrigger
												id={field.name}
												aria-invalid={isInvalid}
												className="min-w-[120px]"
											>
												<SelectValue data-placeholder="Select a color">
													<div className="flex items-center gap-2">
														<div
															className={`h-3 w-3 rounded-full ${COLOR_CLASSES[field.state.value as FolderColor]}`}
														/>
														<span className="capitalize">
															{field.state.value}
														</span>
													</div>
												</SelectValue>
											</SelectTrigger>
											<SelectContent className="max-h-full">
												{FOLDER_COLORS.map((color) => (
													<SelectItem key={color} value={color}>
														<div className="flex items-center gap-2">
															<div
																className={`h-3 w-3 rounded-full ${COLOR_CLASSES[color]}`}
															/>
															<span className="capitalize">{color}</span>
														</div>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Field>
								);
							}}
						/>
					</FieldGroup>
				</form>

				<DialogFooter>
					<Button type="submit" form={formId} disabled={isPending}>
						{isPending ? (
							<>
								<HugeiconsIcon
									icon={Loading03Icon}
									strokeWidth={2}
									className="animate-spin"
								/>
								{isEditing ? "Saving..." : "Creating..."}
							</>
						) : isEditing ? (
							"Save Changes"
						) : (
							"Create Folder"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

/** Hook to manage folder modal state and form reset */
export function useFolderModalState(
	onOpenChange?: (open: boolean) => void,
	formReset?: () => void,
) {
	const [internalOpen, setInternalOpen] = useState(false);

	const handleOpenChange = (open: boolean) => {
		if (!open && formReset) {
			formReset();
		}
		setInternalOpen(open);
		onOpenChange?.(open);
	};

	return {
		open: internalOpen,
		setOpen: handleOpenChange,
	};
}

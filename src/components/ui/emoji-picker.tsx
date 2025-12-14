import { Loading03Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	type EmojiPickerListCategoryHeaderProps,
	type EmojiPickerListEmojiProps,
	type EmojiPickerListRowProps,
	EmojiPicker as EmojiPickerPrimitive,
	type EmojiPickerRootProps,
} from "frimousse";
import type { CSSProperties } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmojiPickerProps extends EmojiPickerRootProps {
	autoFocus?: boolean;
}

function EmojiPickerRow({
	children,
	className,
	...props
}: EmojiPickerListRowProps) {
	return (
		<div
			{...props}
			className={cn(
				"scroll-my-[2vw] px-[2vw] sm:scroll-my-1.5 sm:px-1.5",
				className,
			)}
		>
			{children}
		</div>
	);
}

function EmojiPickerEmoji({
	emoji,
	className,
	style,
	...props
}: EmojiPickerListEmojiProps) {
	return (
		<button
			{...props}
			className={cn(
				"relative flex aspect-square min-w-8 max-w-[calc(100%/var(--frimousse-list-columns))] flex-1 items-center justify-center overflow-hidden whitespace-nowrap rounded-[max(2vw,var(--radius-md))] text-[max(4vw,var(--text-lg))] transition-colors duration-200 ease-out data-[active]:bg-muted/80 data-[active]:duration-0 sm:size-8 sm:rounded-md sm:text-xl",
				"before:-z-1 before:absolute before:inset-0 before:hidden before:items-center before:justify-center before:text-[2.5em] before:opacity-0 before:blur-lg before:saturate-200 before:transition-[display,opacity] before:transition-discrete before:duration-200 before:ease-out before:content-(--emoji) data-[active]:before:flex data-[active]:before:opacity-100 data-[active]:before:duration-0",
				className,
			)}
			style={
				{
					"--emoji": `"${emoji.emoji}"`,
					...style,
				} as CSSProperties
			}
		>
			{emoji.emoji}
		</button>
	);
}

function EmojiPickerCategoryHeader({
	category,
	className,
	...props
}: EmojiPickerListCategoryHeaderProps) {
	return (
		<div
			{...props}
			className={cn(
				"after:-top-1 relative bg-popover px-4 pt-3 pb-1.5 font-medium text-secondary-foreground text-xs after:absolute after:inset-x-0 after:h-2 after:bg-popover sm:px-3",
				className,
			)}
		>
			{category.label}
		</div>
	);
}

function EmojiPicker({
	className,
	autoFocus,
	columns,
	...props
}: EmojiPickerProps) {
	const skinToneSelector = (
		<EmojiPickerPrimitive.SkinToneSelector
			className={cn(
				buttonVariants({ variant: "secondary", size: "icon" }),
				"rounded-md",
			)}
			title="Change skin tone"
		/>
	);

	return (
		<EmojiPickerPrimitive.Root
			className={cn(
				"isolate flex h-[calc(100%_-_var(--spacing)*8)] w-full flex-col sm:h-[382px]",
				className,
			)}
			columns={columns}
			{...props}
		>
			<div className="relative z-10 flex flex-none items-center gap-2 px-4 sm:px-2 sm:pt-2">
				<div className="relative flex-1">
					<HugeiconsIcon
						icon={Search01Icon}
						strokeWidth={2}
						className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2 size-4 text-muted-foreground"
					/>
					<EmojiPickerPrimitive.Search
						autoFocus={autoFocus}
						className="focusable h-8 w-full appearance-none rounded-md bg-muted py-1.5 pr-2.5 pl-7.5 transition duration-200 ease-out placeholder:text-muted-foreground sm:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border outline-none"
					/>
				</div>
				<div className="flex-none sm:hidden">{skinToneSelector}</div>
			</div>
			<EmojiPickerPrimitive.Viewport className="scrollbar-track-[transparent] scrollbar-thumb-secondary-foreground/30 relative flex-1 outline-none">
				<EmojiPickerPrimitive.Loading className="absolute inset-0 flex items-center justify-center text-muted-foreground">
					<HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" />
				</EmojiPickerPrimitive.Loading>
				<EmojiPickerPrimitive.Empty className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
					No emoji found.
				</EmojiPickerPrimitive.Empty>
				<EmojiPickerPrimitive.List
					className="select-none pb-[2vw] sm:pb-1.5"
					components={{
						Row: EmojiPickerRow,
						Emoji: EmojiPickerEmoji,
						CategoryHeader: EmojiPickerCategoryHeader,
					}}
				/>
			</EmojiPickerPrimitive.Viewport>
			<div className="h-12.5 z-10 hidden w-full min-w-0 max-w-(--frimousse-viewport-width) flex-none items-center gap-1 p-2 shadow-[0_-1px_--alpha(var(--color-neutral-200)/65%)] sm:flex dark:shadow-[0_-1px_var(--color-neutral-800)]">
				<EmojiPickerPrimitive.ActiveEmoji>
					{({ emoji }) =>
						emoji ? (
							<>
								<div className="flex size-8 flex-none items-center justify-center text-xl">
									{emoji.emoji}
								</div>
								<span className="truncate font-medium text-secondary-foreground text-xs">
									{emoji.label}
								</span>
							</>
						) : (
							<span className="ml-2 truncate font-medium text-muted-foreground text-xs">
								Select an emoji…
							</span>
						)
					}
				</EmojiPickerPrimitive.ActiveEmoji>
			</div>
		</EmojiPickerPrimitive.Root>
	);
}

export { EmojiPicker };

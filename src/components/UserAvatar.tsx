import { memo, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateUserGradient } from "@/lib/utils";

interface UserAvatarProps {
	username: string;
	imageUrl?: string | null;
	className?: string;
	size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
	sm: "h-8 w-8 text-xs",
	md: "h-10 w-10 text-sm",
	lg: "h-14 w-14 text-base",
	xl: "h-20 w-20 text-lg",
};

export const UserAvatar = memo(function UserAvatar({
	username,
	imageUrl,
	className = "",
	size = "md",
}: UserAvatarProps) {
	const gradient = useMemo(() => generateUserGradient(username), [username]);

	const avatarClassName = useMemo(
		() => `${sizeClasses[size]} ${className}`,
		[size, className],
	);

	// Key forces remount when image presence changes, resetting Avatar's internal state
	// This is needed because Base UI Avatar tracks image load status internally
	const avatarKey = imageUrl ? "has-image" : "no-image";

	return (
		<Avatar key={avatarKey} className={avatarClassName}>
			{imageUrl && <AvatarImage src={imageUrl} alt={username} />}
			<AvatarFallback
				{...(imageUrl
					? { className: "animate-pulse bg-muted" }
					: { style: { background: gradient.css } })}
			/>
		</Avatar>
	);
});

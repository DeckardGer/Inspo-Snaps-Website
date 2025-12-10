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

	return (
		<Avatar className={avatarClassName}>
			{imageUrl && <AvatarImage src={imageUrl} alt={username} />}
			<AvatarFallback
				style={{
					background: gradient.css,
				}}
			/>
		</Avatar>
	);
});

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import authClient from "@/lib/auth/auth-client";

interface SocialSignInButtonProps {
	provider: string;
	logo: React.ReactNode;
	disabled?: boolean;
	callbackURL: string;
}

export function SocialSignInButton(props: SocialSignInButtonProps) {
	const providerLabel =
		props.provider === "github"
			? "GitHub"
			: props.provider.charAt(0).toUpperCase() + props.provider.slice(1);

	const mutation = useMutation({
		mutationFn: async () =>
			await authClient.signIn.social(
				{
					provider: props.provider,
					callbackURL: props.callbackURL,
				},
				{
					onError: ({ error }) => {
						toast.error(
							error.message ||
								`An error occurred during ${providerLabel} sign-in.`,
						);
					},
				},
			),
	});

	return (
		<Button
			variant="outline"
			className="flex-1"
			disabled={mutation.isSuccess || mutation.isPending || props.disabled}
			onClick={() => mutation.mutate()}
		>
			{props.logo}
			Login with {providerLabel}
		</Button>
	);
}

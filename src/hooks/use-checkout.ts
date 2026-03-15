import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { trackUpgradeInitiated } from "@/lib/analytics/events";
import authClient from "@/lib/auth/auth-client";
import { authQueryOptions } from "@/lib/auth/queries";

export function useCheckout() {
	const { data: user } = useQuery(authQueryOptions());
	const [verificationOpen, setVerificationOpen] = useState(false);
	const [pendingSlug, setPendingSlug] = useState<string | null>(null);

	const checkout = (slug: string) => {
		if (!user) return;
		if (user.emailVerified) {
			const parts = slug.split("-");
			const cycle = parts.pop() ?? "";
			const plan = parts.join("-");
			trackUpgradeInitiated(plan, cycle);
			authClient.checkout({ slug });
		} else {
			setPendingSlug(slug);
			setVerificationOpen(true);
		}
	};

	return { checkout, verificationOpen, setVerificationOpen, pendingSlug };
}

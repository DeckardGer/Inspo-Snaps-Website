import type { Subscription } from "@polar-sh/sdk/models/components/subscription.js";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { subscription, user } from "@/lib/db/schema";
import { PRODUCT_ID_TO_SLUG } from "./constants";

export async function upsertSubscription(data: Subscription) {
	// Resolve plan slug from product ID
	const planSlug = PRODUCT_ID_TO_SLUG[data.productId] ?? null;

	// Find the user by matching customer email
	const customerEmail = data.customer.email;
	const matchedUser = await db.query.user.findFirst({
		where: eq(user.email, customerEmail),
		columns: { id: true },
	});

	if (!matchedUser) {
		console.warn(
			`[polar webhook] No user found for customer email: ${customerEmail}`,
		);
		return;
	}

	await db
		.insert(subscription)
		.values({
			id: data.id,
			userId: matchedUser.id,
			polarCustomerId: data.customerId,
			productId: data.productId,
			productName: data.product.name,
			planSlug,
			status: data.status,
			recurringInterval: data.recurringInterval,
			currentPeriodStart: data.currentPeriodStart,
			currentPeriodEnd: data.currentPeriodEnd,
			canceledAt: data.canceledAt,
			endedAt: data.endedAt,
		})
		.onConflictDoUpdate({
			target: subscription.id,
			set: {
				status: data.status,
				productId: data.productId,
				productName: data.product.name,
				planSlug,
				recurringInterval: data.recurringInterval,
				currentPeriodStart: data.currentPeriodStart,
				currentPeriodEnd: data.currentPeriodEnd,
				canceledAt: data.canceledAt,
				endedAt: data.endedAt,
			},
		});
}

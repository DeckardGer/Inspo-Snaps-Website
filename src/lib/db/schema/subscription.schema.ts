import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";

export const subscription = pgTable(
	"subscription",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		polarCustomerId: text("polar_customer_id").notNull(),
		productId: text("product_id").notNull(),
		productName: text("product_name"),
		planSlug: text("plan_slug"),
		status: text("status").notNull(),
		recurringInterval: text("recurring_interval"),
		currentPeriodStart: timestamp("current_period_start"),
		currentPeriodEnd: timestamp("current_period_end"),
		canceledAt: timestamp("canceled_at"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("subscription_userId_idx").on(table.userId),
		index("subscription_status_idx").on(table.status),
		index("subscription_userId_status_idx").on(table.userId, table.status),
	],
);

export const subscriptionRelations = relations(subscription, ({ one }) => ({
	user: one(user, {
		fields: [subscription.userId],
		references: [user.id],
	}),
}));

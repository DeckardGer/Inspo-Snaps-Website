import { bigint, index, pgTable, text } from "drizzle-orm/pg-core";

/**
 * Rate limit tracking table for Better Auth.
 * Used to persist rate limit state across serverless invocations.
 * @see https://www.better-auth.com/docs/concepts/rate-limit
 */
export const rateLimit = pgTable(
	"rate_limit",
	{
		id: text("id").primaryKey(),
		key: text("key").notNull(),
		count: bigint("count", { mode: "number" }).notNull(),
		lastRequest: bigint("last_request", { mode: "number" }).notNull(),
	},
	(table) => [index("rate_limit_key_idx").on(table.key)],
);

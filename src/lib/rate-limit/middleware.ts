import { createMiddleware } from "@tanstack/react-start";
import {
	getRequest,
	setResponseHeader,
	setResponseStatus,
} from "@tanstack/react-start/server";
import { and, eq, gt, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/db/schema/rate-limit.schema";

interface RateLimitConfig {
	/**
	 * Time window in seconds
	 * @default 60
	 */
	window?: number;
	/**
	 * Maximum requests allowed in the window
	 * @default 60
	 */
	max?: number;
	/**
	 * Identifier prefix for the rate limit key (e.g., "upload", "api")
	 * Combined with IP address to create unique keys per endpoint type
	 */
	prefix: string;
}

/**
 * Get client IP address from request headers.
 * Handles common proxy headers (X-Forwarded-For, CF-Connecting-IP).
 */
function getClientIp(request: Request): string {
	// Cloudflare
	const cfIp = request.headers.get("cf-connecting-ip");
	if (cfIp) return cfIp;

	// Standard proxy header
	const forwardedFor = request.headers.get("x-forwarded-for");
	if (forwardedFor) {
		// Take the first IP (original client)
		return forwardedFor.split(",")[0].trim();
	}

	// X-Real-IP (nginx)
	const realIp = request.headers.get("x-real-ip");
	if (realIp) return realIp;

	// Fallback - in development this will be undefined
	return "127.0.0.1";
}

/**
 * Normalize IPv6 addresses and convert IPv4-mapped IPv6 to IPv4.
 * Also applies /64 subnet masking for IPv6 to prevent bypasses.
 */
function normalizeIp(ip: string): string {
	// Handle IPv4-mapped IPv6 (::ffff:192.168.1.1)
	if (ip.startsWith("::ffff:")) {
		return ip.substring(7);
	}

	// For IPv6, mask to /64 subnet to prevent per-address bypasses
	if (ip.includes(":")) {
		const parts = ip.split(":");
		// Keep first 4 segments (64 bits)
		return `${parts.slice(0, 4).join(":")}::`;
	}

	return ip;
}

/**
 * Creates a rate limit middleware for server functions.
 *
 * Uses database storage to persist rate limits across serverless invocations.
 * Includes proper cleanup of expired entries.
 *
 * @example
 * ```ts
 * export const uploadImage = createServerFn({ method: "POST" })
 *   .middleware([authMiddleware, createRateLimitMiddleware({ prefix: "upload", max: 30, window: 60 })])
 *   .handler(async ({ data }) => { ... });
 * ```
 */
export function createRateLimitMiddleware(config: RateLimitConfig) {
	const { window = 60, max = 60, prefix } = config;
	const windowMs = window * 1000;

	return createMiddleware().server(async ({ next }) => {
		const request = getRequest();
		const rawIp = getClientIp(request);
		const ip = normalizeIp(rawIp);
		const key = `${prefix}:${ip}`;
		const now = Date.now();
		const windowStart = now - windowMs;

		try {
			// Try to get existing rate limit record
			const existing = await db.query.rateLimit.findFirst({
				where: eq(rateLimit.key, key),
			});

			if (existing) {
				// Check if the record is within the current window
				if (existing.lastRequest > windowStart) {
					// Within window - check if over limit
					if (existing.count >= max) {
						const retryAfter = Math.ceil(
							(existing.lastRequest + windowMs - now) / 1000,
						);
						setResponseStatus(429);
						setResponseHeader("X-Retry-After", String(retryAfter));
						setResponseHeader("X-RateLimit-Limit", String(max));
						setResponseHeader("X-RateLimit-Remaining", "0");
						setResponseHeader(
							"X-RateLimit-Reset",
							String(Math.ceil((existing.lastRequest + windowMs) / 1000)),
						);
						throw new Error(
							`Rate limit exceeded. Try again in ${retryAfter} seconds.`,
						);
					}

					// Increment count
					await db
						.update(rateLimit)
						.set({
							count: sql`${rateLimit.count} + 1`,
							lastRequest: now,
						})
						.where(eq(rateLimit.id, existing.id));

					// Set rate limit headers
					setResponseHeader("X-RateLimit-Limit", String(max));
					setResponseHeader(
						"X-RateLimit-Remaining",
						String(max - existing.count - 1),
					);
					setResponseHeader(
						"X-RateLimit-Reset",
						String(Math.ceil((existing.lastRequest + windowMs) / 1000)),
					);
				} else {
					// Outside window - reset count
					await db
						.update(rateLimit)
						.set({
							count: 1,
							lastRequest: now,
						})
						.where(eq(rateLimit.id, existing.id));

					setResponseHeader("X-RateLimit-Limit", String(max));
					setResponseHeader("X-RateLimit-Remaining", String(max - 1));
					setResponseHeader(
						"X-RateLimit-Reset",
						String(Math.ceil((now + windowMs) / 1000)),
					);
				}
			} else {
				// No existing record - create new one
				await db.insert(rateLimit).values({
					id: crypto.randomUUID(),
					key,
					count: 1,
					lastRequest: now,
				});

				setResponseHeader("X-RateLimit-Limit", String(max));
				setResponseHeader("X-RateLimit-Remaining", String(max - 1));
				setResponseHeader(
					"X-RateLimit-Reset",
					String(Math.ceil((now + windowMs) / 1000)),
				);
			}

			// Periodically clean up old entries (1% chance per request)
			if (Math.random() < 0.01) {
				// Delete entries older than 24 hours
				const dayAgo = now - 24 * 60 * 60 * 1000;
				await db.delete(rateLimit).where(
					and(
						gt(rateLimit.lastRequest, 0), // Ensure valid entries
						sql`${rateLimit.lastRequest} < ${dayAgo}`,
					),
				);
			}
		} catch (error) {
			// Re-throw rate limit errors
			if (
				error instanceof Error &&
				error.message.includes("Rate limit exceeded")
			) {
				throw error;
			}
			// Log but don't block on rate limit failures
			console.error("[RateLimit] Error checking rate limit:", error);
		}

		return next();
	});
}

// Pre-configured rate limiters for common use cases

/**
 * Rate limiter for upload endpoints.
 * 30 uploads per minute per IP.
 */
export const uploadRateLimitMiddleware = createRateLimitMiddleware({
	prefix: "upload",
	max: 30,
	window: 60,
});

/**
 * Rate limiter for sensitive account operations.
 * 10 requests per minute per IP.
 */
export const accountRateLimitMiddleware = createRateLimitMiddleware({
	prefix: "account",
	max: 10,
	window: 60,
});

/**
 * Rate limiter for username availability checks.
 * 30 checks per minute per IP (allows reasonable UX during signup).
 */
export const usernameCheckRateLimitMiddleware = createRateLimitMiddleware({
	prefix: "username-check",
	max: 30,
	window: 60,
});

/**
 * Rate limiter for sharing operations.
 * 20 share operations per minute per IP.
 */
export const shareRateLimitMiddleware = createRateLimitMiddleware({
	prefix: "share",
	max: 20,
	window: 60,
});

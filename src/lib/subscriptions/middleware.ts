import { createMiddleware } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { authMiddleware } from "@/lib/auth/middleware";

/**
 * Middleware that chains after authMiddleware and checks if the user
 * has write access (active trial or paid subscription).
 * Returns 403 if the user's trial has expired and they have no active subscription.
 *
 * Reads canWrite from the session, which is populated by the customSession plugin.
 */
export const writeAccessMiddleware = createMiddleware()
	.middleware([authMiddleware])
	.server(async ({ next, context }) => {
		if (!context.session.canWrite) {
			setResponseStatus(403);
			throw new Error(
				"Your trial has expired. Please upgrade to continue creating and editing content.",
			);
		}

		return next({ context });
	});

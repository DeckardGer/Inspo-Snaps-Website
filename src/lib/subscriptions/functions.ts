import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { resolveUserPlanState } from "./resolve";

export const getUserPlanState = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		return resolveUserPlanState(context.user.id);
	});

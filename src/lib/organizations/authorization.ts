import { and, eq } from "drizzle-orm";
import type { AppSession, AppUser } from "@/lib/auth/types";
import { db } from "@/lib/db";
import { member } from "@/lib/db/schema";

interface TeamMemberContext {
	user: AppUser;
	session: AppSession;
}

/**
 * Verify the user is a member of the organization and return their membership.
 * Throws if the user is not a member.
 */
export async function requireTeamMembership(
	organizationId: string,
	context: TeamMemberContext,
) {
	const membership = await db.query.member.findFirst({
		where: and(
			eq(member.organizationId, organizationId),
			eq(member.userId, context.user.id),
		),
	});

	if (!membership) {
		throw new Error("You are not a member of this organization");
	}

	return membership;
}

/**
 * Verify the user is a member with write access in the team.
 * Requires: non-viewer role + active team or trial subscription.
 * Throws if the user lacks permission.
 */
export async function requireTeamWriteAccess(
	organizationId: string,
	context: TeamMemberContext,
) {
	const membership = await requireTeamMembership(organizationId, context);

	const hasWriteAccess =
		membership.role !== "viewer" &&
		context.session.canWrite &&
		context.session.plan !== "pro";

	if (!hasWriteAccess) {
		throw new Error("You don't have permission to modify content in this team");
	}

	return membership;
}

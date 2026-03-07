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

	if (membership.role === "viewer") {
		throw new Error("Viewers don't have permission to modify content in this team");
	}

	if (!context.session.canWrite || context.session.plan === "pro") {
		throw new Error(
			"A Team subscription is required to create and edit content in teams. Please upgrade to continue.",
		);
	}

	return membership;
}

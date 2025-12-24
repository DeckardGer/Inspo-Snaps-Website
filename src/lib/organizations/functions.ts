import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { authMiddleware } from "@/lib/auth/middleware";
import { db } from "@/lib/db";
import { invitation, member, organization } from "@/lib/db/schema";

const OrganizationIdInput = z.object({
	organizationId: z.string(),
});

const InviteLinkInput = z.object({
	organizationId: z.string(),
	role: z.enum(["admin", "member"]).default("member"),
	expiresInDays: z.number().min(1).max(30).default(7),
});

const InviteCodeInput = z.object({
	inviteCode: z.string(),
});

const RemoveMemberInput = z.object({
	organizationId: z.string(),
	memberId: z.string(),
});

const UpdateMemberRoleInput = z.object({
	organizationId: z.string(),
	memberId: z.string(),
	newRole: z.enum(["admin", "member"]),
});

export type UserOrganization = {
	id: string;
	name: string;
	slug: string;
	logo: string | null;
	role: string;
	createdAt: Date;
};

export const getUserOrganizations = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const memberships = await db.query.member.findMany({
			where: eq(member.userId, context.user.id),
			with: {
				organization: true,
			},
			orderBy: (m, { desc }) => [desc(m.createdAt)],
		});

		return memberships.map((m) => ({
			id: m.organization.id,
			name: m.organization.name,
			slug: m.organization.slug,
			logo: m.organization.logo,
			role: m.role,
			createdAt: m.organization.createdAt,
		})) satisfies UserOrganization[];
	});

// Get organizations with active org info for redirects
export type UserOrganizationsWithActive = {
	organizations: UserOrganization[];
	activeOrganizationId: string | null;
};

export const getUserOrganizationsWithActive = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		// Get user's session to find active organization
		const sessionData = await auth.api.getSession({
			headers: getRequest().headers,
		});

		const activeOrganizationId =
			sessionData?.session?.activeOrganizationId ?? null;

		// Get user's organizations
		const memberships = await db.query.member.findMany({
			where: eq(member.userId, context.user.id),
			with: {
				organization: true,
			},
			orderBy: (m, { desc }) => [desc(m.createdAt)],
		});

		const organizations = memberships.map((m) => ({
			id: m.organization.id,
			name: m.organization.name,
			slug: m.organization.slug,
			logo: m.organization.logo,
			role: m.role,
			createdAt: m.organization.createdAt,
		})) satisfies UserOrganization[];

		return {
			organizations,
			activeOrganizationId,
		} satisfies UserOrganizationsWithActive;
	});

export type OrganizationMember = {
	id: string;
	role: string;
	createdAt: Date;
	user: {
		id: string;
		name: string;
		email: string;
		image: string | null;
	};
};

export type OrganizationDetails = {
	id: string;
	name: string;
	slug: string;
	logo: string | null;
	createdAt: Date;
	members: OrganizationMember[];
	pendingInvitations: Array<{
		id: string;
		email: string;
		role: string | null;
		expiresAt: Date;
		createdAt: Date;
	}>;
	currentUserRole: string;
};

export const getOrganizationDetails = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(OrganizationIdInput)
	.handler(async ({ data, context }) => {
		// Verify user is member
		const membership = await db.query.member.findFirst({
			where: and(
				eq(member.organizationId, data.organizationId),
				eq(member.userId, context.user.id),
			),
		});

		if (!membership) throw new Error("Not a member of this organization");

		const org = await db.query.organization.findFirst({
			where: eq(organization.id, data.organizationId),
			with: {
				members: {
					with: {
						user: {
							columns: { id: true, name: true, email: true, image: true },
						},
					},
				},
				invitations: {
					where: eq(invitation.status, "pending"),
				},
			},
		});

		if (!org) throw new Error("Organization not found");

		return {
			id: org.id,
			name: org.name,
			slug: org.slug,
			logo: org.logo,
			createdAt: org.createdAt,
			members: org.members.map((m) => ({
				id: m.id,
				role: m.role,
				createdAt: m.createdAt,
				user: m.user,
			})),
			pendingInvitations: org.invitations
				.filter((inv) => !inv.email.startsWith("invite-link-"))
				.map((inv) => ({
					id: inv.id,
					email: inv.email,
					role: inv.role,
					expiresAt: inv.expiresAt,
					createdAt: inv.createdAt,
				})),
			currentUserRole: membership.role,
		} satisfies OrganizationDetails;
	});

export const getOrganizationBySlug = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(z.object({ slug: z.string() }))
	.handler(async ({ data, context }) => {
		const org = await db.query.organization.findFirst({
			where: eq(organization.slug, data.slug),
		});

		if (!org) throw new Error("Organization not found");

		// Verify user is member
		const membership = await db.query.member.findFirst({
			where: and(
				eq(member.organizationId, org.id),
				eq(member.userId, context.user.id),
			),
		});

		if (!membership) throw new Error("Not a member of this organization");

		return {
			id: org.id,
			name: org.name,
			slug: org.slug,
			logo: org.logo,
			createdAt: org.createdAt,
			currentUserRole: membership.role,
		};
	});

export const getOrganizationById = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(OrganizationIdInput)
	.handler(async ({ data, context }) => {
		const org = await db.query.organization.findFirst({
			where: eq(organization.id, data.organizationId),
		});

		if (!org) throw new Error("Organization not found");

		// Verify user is member
		const membership = await db.query.member.findFirst({
			where: and(
				eq(member.organizationId, org.id),
				eq(member.userId, context.user.id),
			),
		});

		if (!membership) throw new Error("Not a member of this organization");

		return {
			id: org.id,
			name: org.name,
			slug: org.slug,
			logo: org.logo,
			createdAt: org.createdAt,
			currentUserRole: membership.role,
		};
	});

export const createInviteLink = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(InviteLinkInput)
	.handler(async ({ data, context }) => {
		// Verify user is owner or admin
		const membership = await db.query.member.findFirst({
			where: and(
				eq(member.organizationId, data.organizationId),
				eq(member.userId, context.user.id),
			),
		});

		if (!membership || !["owner", "admin"].includes(membership.role)) {
			throw new Error("Only owners and admins can create invite links");
		}

		const invitationId = crypto.randomUUID();
		const expiresAt = new Date(
			Date.now() + data.expiresInDays * 24 * 60 * 60 * 1000,
		);

		// Create invitation with placeholder email (will be filled on accept)
		await db.insert(invitation).values({
			id: invitationId,
			organizationId: data.organizationId,
			email: `invite-link-${invitationId}@placeholder.local`,
			role: data.role,
			status: "pending",
			expiresAt,
			inviterId: context.user.id,
		});

		return {
			inviteCode: invitationId,
			expiresAt,
		};
	});

export const getInviteDetails = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(InviteCodeInput)
	.handler(async ({ data, context }) => {
		const inv = await db.query.invitation.findFirst({
			where: and(
				eq(invitation.id, data.inviteCode),
				eq(invitation.status, "pending"),
			),
			with: {
				organization: true,
				user: {
					columns: { id: true, name: true, image: true },
				},
			},
		});

		if (!inv) throw new Error("Invalid or expired invite link");
		if (inv.expiresAt < new Date()) throw new Error("Invite link has expired");

		// Check if already a member
		const existingMember = await db.query.member.findFirst({
			where: and(
				eq(member.organizationId, inv.organizationId),
				eq(member.userId, context.user.id),
			),
		});

		return {
			organizationId: inv.organizationId,
			organizationName: inv.organization.name,
			organizationLogo: inv.organization.logo,
			role: inv.role ?? "member",
			invitedBy: inv.user,
			expiresAt: inv.expiresAt,
			alreadyMember: !!existingMember,
		};
	});

export const acceptInviteLink = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(InviteCodeInput)
	.handler(async ({ data, context }) => {
		const inv = await db.query.invitation.findFirst({
			where: and(
				eq(invitation.id, data.inviteCode),
				eq(invitation.status, "pending"),
			),
			with: { organization: true },
		});

		if (!inv) throw new Error("Invalid or expired invite link");
		if (inv.expiresAt < new Date()) throw new Error("Invite link has expired");

		// Check if already a member
		const existingMember = await db.query.member.findFirst({
			where: and(
				eq(member.organizationId, inv.organizationId),
				eq(member.userId, context.user.id),
			),
		});

		if (existingMember) {
			return {
				success: true,
				alreadyMember: true,
				organizationId: inv.organizationId,
				organizationName: inv.organization.name,
				organizationSlug: inv.organization.slug,
			};
		}

		// Add user as member
		await db.insert(member).values({
			id: crypto.randomUUID(),
			organizationId: inv.organizationId,
			userId: context.user.id,
			role: inv.role ?? "member",
			createdAt: new Date(),
		});

		// For link-based invites, mark as accepted
		// (email invites are user-specific so we update differently)
		if (inv.email.startsWith("invite-link-")) {
			await db
				.update(invitation)
				.set({ status: "accepted" })
				.where(eq(invitation.id, data.inviteCode));
		}

		return {
			success: true,
			alreadyMember: false,
			organizationId: inv.organizationId,
			organizationName: inv.organization.name,
			organizationSlug: inv.organization.slug,
		};
	});

export const removeMember = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(RemoveMemberInput)
	.handler(async ({ data, context }) => {
		// Verify requester is owner or admin
		const requesterMembership = await db.query.member.findFirst({
			where: and(
				eq(member.organizationId, data.organizationId),
				eq(member.userId, context.user.id),
			),
		});

		if (
			!requesterMembership ||
			!["owner", "admin"].includes(requesterMembership.role)
		) {
			throw new Error("Only owners and admins can remove members");
		}

		// Get target member
		const targetMember = await db.query.member.findFirst({
			where: eq(member.id, data.memberId),
		});

		if (!targetMember) throw new Error("Member not found");

		// Cannot remove owner
		if (targetMember.role === "owner") {
			throw new Error("Cannot remove the organization owner");
		}

		// Admin cannot remove other admins (only owner can)
		if (targetMember.role === "admin" && requesterMembership.role !== "owner") {
			throw new Error("Only owners can remove admins");
		}

		await db.delete(member).where(eq(member.id, data.memberId));

		return { success: true };
	});

export const updateMemberRole = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(UpdateMemberRoleInput)
	.handler(async ({ data, context }) => {
		// Only owner can change roles
		const requesterMembership = await db.query.member.findFirst({
			where: and(
				eq(member.organizationId, data.organizationId),
				eq(member.userId, context.user.id),
			),
		});

		if (!requesterMembership || requesterMembership.role !== "owner") {
			throw new Error("Only the owner can change member roles");
		}

		const targetMember = await db.query.member.findFirst({
			where: eq(member.id, data.memberId),
		});

		if (!targetMember) throw new Error("Member not found");
		if (targetMember.role === "owner")
			throw new Error("Cannot change owner role");

		await db
			.update(member)
			.set({ role: data.newRole })
			.where(eq(member.id, data.memberId));

		return { success: true };
	});

export const leaveOrganization = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(OrganizationIdInput)
	.handler(async ({ data, context }) => {
		const membership = await db.query.member.findFirst({
			where: and(
				eq(member.organizationId, data.organizationId),
				eq(member.userId, context.user.id),
			),
		});

		if (!membership) throw new Error("Not a member of this organization");

		if (membership.role === "owner") {
			throw new Error(
				"Owner cannot leave the organization. Transfer ownership first or delete the organization.",
			);
		}

		await db.delete(member).where(eq(member.id, membership.id));

		return { success: true };
	});

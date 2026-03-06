import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { authMiddleware } from "@/lib/auth/middleware";
import { ASSIGNABLE_ROLES } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import {
	favouriteFolder,
	folder,
	invitation,
	member,
	organization,
	user,
} from "@/lib/db/schema";
import {
	createTeamInviteAcceptedNotification,
	createTeamInviteDeclinedNotification,
	createTeamInviteNotification,
	createTeamMemberRemovedNotification,
	createTeamRoleChangedNotification,
} from "@/lib/notifications/create";
import { writeAccessMiddleware } from "@/lib/subscriptions/middleware";

const OrganizationIdInput = z.object({
	organizationId: z.string(),
});

const InviteLinkInput = z.object({
	organizationId: z.string(),
	role: z.enum(ASSIGNABLE_ROLES).default("viewer"),
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
	newRole: z.enum(ASSIGNABLE_ROLES),
});

const CreateInvitationInput = z.object({
	organizationId: z.string(),
	emailOrUsername: z.string().min(1),
	role: z.enum(ASSIGNABLE_ROLES).default("viewer"),
});

const InvitationIdInput = z.object({
	organizationId: z.string(),
	invitationId: z.string(),
});

const CreateTeamInput = z.object({
	name: z.string().min(1).max(100),
	slug: z.string().min(1),
});

const UpdateTeamInput = z.object({
	organizationId: z.string(),
	name: z.string().min(1).max(100),
});

export const createTeam = createServerFn({ method: "POST" })
	.middleware([writeAccessMiddleware])
	.inputValidator(CreateTeamInput)
	.handler(async ({ data }) => {
		const headers = getRequest().headers;

		const result = await auth.api.createOrganization({
			headers,
			body: {
				name: data.name,
				slug: data.slug,
			},
		});

		return { id: result.id, name: result.name, slug: result.slug };
	});

export const updateTeam = createServerFn({ method: "POST" })
	.middleware([writeAccessMiddleware])
	.inputValidator(UpdateTeamInput)
	.handler(async ({ data }) => {
		const headers = getRequest().headers;

		await auth.api.updateOrganization({
			headers,
			body: {
				organizationId: data.organizationId,
				data: { name: data.name },
			},
		});

		return { success: true };
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
			(sessionData?.session as { activeOrganizationId?: string | null })
				?.activeOrganizationId ?? null;

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
		username: string | null;
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
							columns: {
								id: true,
								name: true,
								email: true,
								image: true,
								username: true,
							},
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
	.middleware([writeAccessMiddleware])
	.inputValidator(InviteLinkInput)
	.handler(async ({ data, context }) => {
		const headers = getRequest().headers;

		// Check permission using Better Auth access control
		const { success } = await auth.api.hasPermission({
			headers,
			body: {
				permissions: {
					invitation: ["create"],
				},
				organizationId: data.organizationId,
			},
		});

		if (!success) {
			throw new Error("You don't have permission to create invite links");
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
		const headers = getRequest().headers;

		// Get invitation details first to return org info
		const inv = await db.query.invitation.findFirst({
			where: and(
				eq(invitation.id, data.inviteCode),
				eq(invitation.status, "pending"),
			),
			with: { organization: true },
		});

		if (!inv) throw new Error("Invalid or expired invite link");
		if (inv.expiresAt < new Date()) throw new Error("Invite link has expired");

		// Use Better Auth API to accept invitation
		// This handles: adding member, updating invitation status, triggering hooks
		await auth.api.acceptInvitation({
			headers,
			body: {
				invitationId: data.inviteCode,
			},
		});

		// Notify the person who created the invite
		await createTeamInviteAcceptedNotification({
			recipientId: inv.inviterId,
			actorId: context.user.id,
			organizationId: inv.organizationId,
			organizationName: inv.organization.name,
		});

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
		const headers = getRequest().headers;

		// Get member and org details before removal for notification
		const memberToRemove = await db.query.member.findFirst({
			where: and(
				eq(member.id, data.memberId),
				eq(member.organizationId, data.organizationId),
			),
			with: {
				organization: {
					columns: { name: true },
				},
			},
		});

		if (!memberToRemove) throw new Error("Member not found");

		await auth.api.removeMember({
			headers,
			body: {
				memberIdOrEmail: data.memberId,
				organizationId: data.organizationId,
			},
		});

		// Clean up favorites for folders belonging to this organization
		const orgFolders = await db.query.folder.findMany({
			where: eq(folder.organizationId, data.organizationId),
			columns: { id: true },
		});

		if (orgFolders.length > 0) {
			const orgFolderIds = orgFolders.map((f) => f.id);
			await db
				.delete(favouriteFolder)
				.where(
					and(
						eq(favouriteFolder.userId, memberToRemove.userId),
						inArray(favouriteFolder.folderId, orgFolderIds),
					),
				);
		}

		// Notify the removed user
		await createTeamMemberRemovedNotification({
			recipientId: memberToRemove.userId,
			actorId: context.user.id,
			organizationName: memberToRemove.organization.name,
		});

		return { success: true };
	});

export const updateMemberRole = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(UpdateMemberRoleInput)
	.handler(async ({ data, context }) => {
		const headers = getRequest().headers;

		// Get member details before update for notification
		const memberToUpdate = await db.query.member.findFirst({
			where: and(
				eq(member.id, data.memberId),
				eq(member.organizationId, data.organizationId),
			),
			with: {
				organization: {
					columns: { name: true },
				},
			},
		});

		if (!memberToUpdate) throw new Error("Member not found");

		const oldRole = memberToUpdate.role;

		await auth.api.updateMemberRole({
			headers,
			body: {
				memberId: data.memberId,
				role: data.newRole,
				organizationId: data.organizationId,
			},
		});

		// Notify the user whose role changed (only if it's not themselves)
		if (memberToUpdate.userId !== context.user.id) {
			await createTeamRoleChangedNotification({
				recipientId: memberToUpdate.userId,
				actorId: context.user.id,
				organizationId: data.organizationId,
				organizationName: memberToUpdate.organization.name,
				oldRole,
				newRole: data.newRole,
			});
		}

		return { success: true };
	});

export const leaveOrganization = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(OrganizationIdInput)
	.handler(async ({ data, context }) => {
		const headers = getRequest().headers;

		await auth.api.leaveOrganization({
			headers,
			body: {
				organizationId: data.organizationId,
			},
		});

		// Clean up favorites for folders belonging to this organization
		const orgFolders = await db.query.folder.findMany({
			where: eq(folder.organizationId, data.organizationId),
			columns: { id: true },
		});

		if (orgFolders.length > 0) {
			const orgFolderIds = orgFolders.map((f) => f.id);
			await db
				.delete(favouriteFolder)
				.where(
					and(
						eq(favouriteFolder.userId, context.user.id),
						inArray(favouriteFolder.folderId, orgFolderIds),
					),
				);
		}

		return { success: true };
	});

export const createInvitation = createServerFn({ method: "POST" })
	.middleware([writeAccessMiddleware])
	.inputValidator(CreateInvitationInput)
	.handler(async ({ data, context }) => {
		const headers = getRequest().headers;

		// Determine if input is email or username
		const isEmail = data.emailOrUsername.includes("@");
		let targetEmail = data.emailOrUsername;
		let targetUserId: string | null = null;

		if (!isEmail) {
			// Search by username (case-insensitive)
			const usernameSearch = data.emailOrUsername
				.toLowerCase()
				.replace("@", "");
			const targetUser = await db.query.user.findFirst({
				where: eq(user.username, usernameSearch),
			});

			if (!targetUser) {
				throw new Error(`User @${usernameSearch} not found`);
			}

			targetEmail = targetUser.email;
			targetUserId = targetUser.id;
		} else {
			// Find user by email to get their ID for notification
			const targetUser = await db.query.user.findFirst({
				where: eq(user.email, targetEmail),
			});
			targetUserId = targetUser?.id ?? null;
		}

		// Get organization name for notification
		const org = await db.query.organization.findFirst({
			where: eq(organization.id, data.organizationId),
			columns: { name: true },
		});

		if (!org) throw new Error("Organization not found");

		// Use Better Auth API - handles permission checks, duplicate detection, email sending
		const result = await auth.api.createInvitation({
			headers,
			body: {
				email: targetEmail,
				role: data.role,
				organizationId: data.organizationId,
			},
		});

		// Notify the invited user if they exist in the system
		if (targetUserId) {
			await createTeamInviteNotification({
				recipientId: targetUserId,
				actorId: context.user.id,
				invitationId: result.id,
				organizationId: data.organizationId,
				organizationName: org.name,
				role: data.role,
			});
		}

		return {
			id: result.id,
			email: result.email,
			role: result.role,
			expiresAt: result.expiresAt,
			createdAt: result.createdAt,
		};
	});

export const cancelInvitation = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(InvitationIdInput)
	.handler(async ({ data }) => {
		const headers = getRequest().headers;

		await auth.api.cancelInvitation({
			headers,
			body: {
				invitationId: data.invitationId,
			},
		});

		return { success: true };
	});

export const resendInvitation = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(InvitationIdInput)
	.handler(async ({ data }) => {
		const headers = getRequest().headers;

		// Check permission first using Better Auth access control
		const { success } = await auth.api.hasPermission({
			headers,
			body: {
				permissions: {
					invitation: ["create"],
				},
				organizationId: data.organizationId,
			},
		});

		if (!success) {
			throw new Error("You don't have permission to resend invitations");
		}

		// Get the invitation to retrieve email and role
		const inv = await db.query.invitation.findFirst({
			where: and(
				eq(invitation.id, data.invitationId),
				eq(invitation.organizationId, data.organizationId),
				eq(invitation.status, "pending"),
			),
		});

		if (!inv) {
			throw new Error("Invitation not found or already processed");
		}

		// Use Better Auth API with resend flag - triggers sendInvitationEmail callback
		const result = await auth.api.createInvitation({
			headers,
			body: {
				email: inv.email,
				role: (inv.role ?? "viewer") as "admin" | "member" | "viewer",
				organizationId: data.organizationId,
				resend: true,
			},
		});

		return {
			success: true,
			expiresAt: result.expiresAt,
		};
	});

const UserInvitationIdInput = z.object({
	invitationId: z.string(),
});

/**
 * Get details of a team invitation for the current user.
 * Used for the accept/decline invitation page.
 */
export const getTeamInvitationDetails = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(UserInvitationIdInput)
	.handler(async ({ data, context }) => {
		const inv = await db.query.invitation.findFirst({
			where: and(
				eq(invitation.id, data.invitationId),
				eq(invitation.status, "pending"),
			),
			with: {
				organization: {
					columns: { id: true, name: true, slug: true, logo: true },
				},
				user: {
					columns: { id: true, name: true, image: true },
				},
			},
		});

		// Return null if not found - UI handles this gracefully
		if (!inv) {
			return null;
		}

		// Check if invitation has expired
		if (inv.expiresAt < new Date()) {
			return null;
		}

		// Verify this invitation is for the current user (by email)
		if (inv.email !== context.user.email) {
			return null;
		}

		// Check if user is already a member
		const existingMember = await db.query.member.findFirst({
			where: and(
				eq(member.organizationId, inv.organizationId),
				eq(member.userId, context.user.id),
			),
		});

		if (existingMember) {
			return null;
		}

		return {
			id: inv.id,
			organization: inv.organization,
			role: inv.role ?? "member",
			invitedBy: inv.user,
			expiresAt: inv.expiresAt,
			createdAt: inv.createdAt,
		};
	});

/**
 * Accept a direct team invitation (sent to user by email/username).
 */
export const acceptTeamInvitation = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(UserInvitationIdInput)
	.handler(async ({ data, context }) => {
		const headers = getRequest().headers;

		// Get invitation details before accepting for notification
		const inv = await db.query.invitation.findFirst({
			where: and(
				eq(invitation.id, data.invitationId),
				eq(invitation.status, "pending"),
			),
			with: {
				organization: {
					columns: { id: true, name: true, slug: true },
				},
			},
		});

		if (!inv) {
			throw new Error("Invitation not found or already processed");
		}

		if (inv.expiresAt < new Date()) {
			throw new Error("Invitation has expired");
		}

		// Accept the invitation using Better Auth API
		await auth.api.acceptInvitation({
			headers,
			body: {
				invitationId: data.invitationId,
			},
		});

		// Notify the person who created the invite
		await createTeamInviteAcceptedNotification({
			recipientId: inv.inviterId,
			actorId: context.user.id,
			organizationId: inv.organizationId,
			organizationName: inv.organization.name,
		});

		return {
			success: true,
			organizationId: inv.organizationId,
			organizationName: inv.organization.name,
			organizationSlug: inv.organization.slug,
		};
	});

/**
 * Reject/decline a direct team invitation.
 */
export const rejectTeamInvitation = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(UserInvitationIdInput)
	.handler(async ({ data, context }) => {
		const headers = getRequest().headers;

		// Get invitation details before rejecting for notification
		const inv = await db.query.invitation.findFirst({
			where: and(
				eq(invitation.id, data.invitationId),
				eq(invitation.status, "pending"),
			),
			with: {
				organization: {
					columns: { id: true, name: true },
				},
			},
		});

		if (!inv) {
			throw new Error("Invitation not found or already processed");
		}

		// Reject the invitation using Better Auth API
		await auth.api.rejectInvitation({
			headers,
			body: {
				invitationId: data.invitationId,
			},
		});

		// Notify the person who created the invite
		await createTeamInviteDeclinedNotification({
			recipientId: inv.inviterId,
			actorId: context.user.id,
			organizationId: inv.organizationId,
			organizationName: inv.organization.name,
		});

		return { success: true };
	});

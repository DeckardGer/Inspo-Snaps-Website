import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { member } from "@/lib/db/schema";

export const Route = createFileRoute("/api/extension/organizations")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const session = await auth.api.getSession({
					headers: request.headers,
				});

				if (!session?.user) {
					return Response.json({ error: "Unauthorized" }, { status: 401 });
				}

				const memberships = await db.query.member.findMany({
					where: eq(member.userId, session.user.id),
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
				}));

				return Response.json({ organizations });
			},
		},
	},
});

import { queryOptions } from "@tanstack/react-query";
import {
	getInviteDetails,
	getOrganizationById,
	getOrganizationDetails,
	getUserOrganizations,
	getUserOrganizationsWithActive,
} from "./functions";

export const userOrganizationsQueryOptions = () =>
	queryOptions({
		queryKey: ["organizations"],
		queryFn: ({ signal }) => getUserOrganizations({ signal }),
		staleTime: 1000 * 60 * 5,
	});

export const userOrganizationsWithActiveQueryOptions = () =>
	queryOptions({
		queryKey: ["organizations", "withActive"],
		queryFn: ({ signal }) => getUserOrganizationsWithActive({ signal }),
		staleTime: 1000 * 60 * 2,
	});

export const organizationDetailsQueryOptions = (organizationId: string) =>
	queryOptions({
		queryKey: ["organization", organizationId],
		queryFn: ({ signal }) =>
			getOrganizationDetails({ data: { organizationId }, signal }),
		staleTime: 1000 * 60 * 2,
		enabled: !!organizationId,
	});

export const organizationByIdQueryOptions = (organizationId: string) =>
	queryOptions({
		queryKey: ["organization", "id", organizationId],
		queryFn: ({ signal }) =>
			getOrganizationById({ data: { organizationId }, signal }),
		staleTime: 1000 * 60 * 5,
		enabled: !!organizationId,
	});

export const inviteDetailsQueryOptions = (inviteCode: string) =>
	queryOptions({
		queryKey: ["invite", inviteCode],
		queryFn: ({ signal }) => getInviteDetails({ data: { inviteCode }, signal }),
		staleTime: 1000 * 60 * 2,
		enabled: !!inviteCode,
	});

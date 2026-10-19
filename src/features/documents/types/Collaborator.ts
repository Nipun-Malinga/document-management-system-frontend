import type { PageResponse } from "@/shared/types/PageResponse";

type permissions = "READ_ONLY" | "READ_WRITE";

export interface Collaborator {
	userId: number;
	username: string;
	email: string;
	permission: permissions;
}

export type CollaboratorsResponse = PageResponse<Collaborator>;

import type { User } from "@/features/users/types/User";
import type { PageResponse } from "@/shared/types/PageResponse";

export type Status = "PUBLIC" | "PRIVATE";

export interface Version {
	id: string;
	branchId: string;
	documentId: string;
	createdBy: User;
	title: string;
	status: Status;
	createdAt: string;
}

export type VersionResponse = PageResponse<Version>;

export type VersionRequest = Pick<Version, "title" | "status">;

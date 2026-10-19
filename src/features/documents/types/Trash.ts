import type { PageResponse } from "@/shared/types/PageResponse";
import type { Branch } from "./Branch";
import type { Document } from "./Document";

interface Trash {
	id: number;
	addedDate: string;
}

export interface TrashDocument extends Trash {
	document: Document;
}

export interface TrashBranch extends Trash {
	branch: Branch;
}

export type TrashDocumentResponse = PageResponse<TrashDocument>;

export type TrashBranchResponse = PageResponse<TrashBranch>;

// The branch-trash endpoint alone uses snake_case on the wire.
export type TrashBranchWire = Omit<TrashBranch, "addedDate"> & {
	added_date: string;
};

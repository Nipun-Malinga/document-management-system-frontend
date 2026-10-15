import type { QueryClient } from "@tanstack/react-query";
import { assertSession } from "@/states/sessionStore";

export type DocumentMutation =
	| "create"
	| "rename"
	| "save"
	| "favorite"
	| "share"
	| "createBranch"
	| "createVersion"
	| "trashDocument"
	| "restoreDocument"
	| "deleteDocument"
	| "trashBranch"
	| "restoreBranch"
	| "deleteBranch"
	| "merge";

// Prefixes deliberately cover every page, filter, sort and Quick/Recents variant.
export const mutationQueryKeys = (
	action: DocumentMutation,
	documentId: string,
): readonly unknown[][] => {
	const keys: unknown[][] = [
		["documents-own"],
		["shared-with"],
		["document", documentId],
	];
	if (
		["create", "trashDocument", "restoreDocument", "deleteDocument"].includes(
			action,
		)
	) {
		keys.push(
			["documentCount"],
			["sharedWithCount"],
			["document-favorites-count"],
		);
	}
	if (action === "favorite") keys.push(["document-favorites-count"]);
	if (action === "share")
		keys.push(
			["collaborators", documentId],
			["permissions", documentId],
			["sharedWithCount"],
			["documentCount"],
		);
	if (
		[
			"create",
			"save",
			"createBranch",
			"createVersion",
			"merge",
			"trashBranch",
			"restoreBranch",
			"deleteBranch",
			"trashDocument",
			"restoreDocument",
			"deleteDocument",
		].includes(action)
	) {
		keys.push(["branches", documentId]);
	}
	if (["createVersion", "deleteBranch", "deleteDocument"].includes(action))
		keys.push(["versions", documentId]);
	if (["trashDocument", "restoreDocument", "deleteDocument"].includes(action)) {
		keys.push(
			["trashed_documents_own"],
			["trashDocumentCount"],
			["trashed_branches_own"],
			["trashBranchCount"],
			["permissions", documentId],
		);
	}
	if (["trashBranch", "restoreBranch", "deleteBranch"].includes(action))
		keys.push(
			["trashed_branches_own"],
			["trashBranchCount"],
			["permissions", documentId],
		);
	if (action === "rename")
		keys.push(
			["trashed_documents_own"],
			["trashed_branches_own"],
			["permissions", documentId],
		);
	return keys;
};

export const refreshDocumentMutation = async (
	client: QueryClient,
	action: DocumentMutation,
	documentId: string,
	epoch: number,
	branchId?: string,
) => {
	assertSession(epoch);
	if (action === "deleteDocument") {
		// Deleted content must not be available from a previously successful preview.
		for (const key of [
			["branch-content", documentId],
			["version-content", documentId],
		])
			client.removeQueries({ queryKey: key });
	}
	if (action === "deleteBranch" && branchId) {
		client.removeQueries({
			queryKey: ["branch-content", documentId, branchId],
			exact: true,
		});
		// Version entities are deleted with their branch; content keys use version IDs.
		client.removeQueries({ queryKey: ["version-content", documentId] });
	}
	await Promise.all(
		mutationQueryKeys(action, documentId).map((queryKey) =>
			client.invalidateQueries({ queryKey }),
		),
	);
	assertSession(epoch);
};

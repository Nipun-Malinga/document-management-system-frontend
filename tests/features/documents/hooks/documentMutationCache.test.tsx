import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	endSession,
	getSession,
	replaceAccessToken,
} from "@/features/auth/stores/sessionStore";
import useShareDocument from "@/features/documents/hooks/collaboration/useShareDocument";
import useCreateBranch from "@/features/documents/hooks/useCreateBranch";
import useCreateDocument from "@/features/documents/hooks/useCreateDocument";
import useCreateVersion from "@/features/documents/hooks/useCreateVersion";
import useDeleteBranch from "@/features/documents/hooks/useDeleteBranch";
import useDeleteDocument from "@/features/documents/hooks/useDeleteDocument";
import useMergeBranch from "@/features/documents/hooks/useMergeBranch";
import useRestoreBranch from "@/features/documents/hooks/useRestoreBranch";
import useRestoreDocument from "@/features/documents/hooks/useRestoreDocument";
import useSaveDocumentContent from "@/features/documents/hooks/useSaveDocumentContent";
import useToggleFavorite from "@/features/documents/hooks/useToggleFavorite";
import useTrashBranch from "@/features/documents/hooks/useTrashBranch";
import useTrashDocument from "@/features/documents/hooks/useTrashDocument";
import useUpdateDocumentInfo from "@/features/documents/hooks/useUpdateDocumentInfo";
import {
	registerPersistence,
	usePersistenceRegistry,
} from "@/features/editor/persistence/persistenceRegistry";
import { SaveCoordinator } from "@/features/editor/persistence/SaveCoordinator";
import { axiosInstance } from "@/services/apiService";
import { document, tokenFor } from "../../../fixtures";

const json = '{"type":"doc","content":[]}';
let client: QueryClient;
const adapter = axiosInstance.defaults.adapter;
const wrapper = ({ children }: { children: ReactNode }) => (
	<QueryClientProvider client={client}>{children}</QueryClientProvider>
);
const useActions = () => {
	const create = useCreateDocument();
	const rename = useUpdateDocumentInfo("doc");
	const favorite = useToggleFavorite("doc");
	const save = useSaveDocumentContent("doc", "main");
	const branch = useCreateBranch("doc", "main");
	const version = useCreateVersion("doc", "main");
	const trashDocument = useTrashDocument("doc");
	const restoreDocument = useRestoreDocument("doc");
	const deleteDocument = useDeleteDocument("doc");
	const trashBranch = useTrashBranch("doc", "other");
	const restoreBranch = useRestoreBranch("doc", "other");
	const deleteBranch = useDeleteBranch("doc", "other");
	const share = useShareDocument("doc");
	const merge = useMergeBranch("doc", "main", "source");
	return {
		create: () =>
			create.mutateAsync({
				title: "Created",
				status: "PRIVATE",
				templateId: 1,
			}),
		rename: () => rename.mutateAsync({ title: "Renamed", status: "PRIVATE" }),
		favorite: () => favorite.mutateAsync(),
		save: () => save.mutateAsync(json),
		createBranch: () => branch.mutateAsync({ branchName: "Draft" }),
		createVersion: () =>
			version.mutateAsync({ title: "Snapshot", status: "PRIVATE" }),
		trashDocument: () => trashDocument.mutateAsync(),
		restoreDocument: () => restoreDocument.mutateAsync(),
		deleteDocument: () => deleteDocument.mutateAsync(),
		trashBranch: () => trashBranch.mutateAsync(),
		restoreBranch: () => restoreBranch.mutateAsync(),
		deleteBranch: () => deleteBranch.mutateAsync(),
		share: () => share.mutateAsync({ userId: 2, permission: "READ_ONLY" }),
		merge: () => merge.mutateAsync(),
	};
};
const keys = [
	["document", "doc"],
	["documents-own", { page: 0 }],
	["documents-own", { page: 1, favorite: true }],
	["documents-own", { sort: "updatedAt,desc" }],
	["shared-with", { page: 2 }],
	["branches", "doc", { page: 1 }],
	["versions", "doc", { page: 0 }],
	["collaborators", "doc", { page: 1 }],
	["permissions", "doc", "main"],
	["documentCount"],
	["document-favorites-count"],
	["sharedWithCount"],
	["trashed_documents_own", { page: 1 }],
	["trashed_branches_own", { page: 1 }],
	["trashDocumentCount"],
	["trashBranchCount"],
	["branch-content", "doc", "main"],
	["branch-content", "doc", "other"],
	["version-content", "doc", "version"],
	["document", "other"],
];
const cases: [keyof ReturnType<typeof useActions>, string[]][] = [
	["create", ["documentCount", "document-favorites-count", "branches"]],
	[
		"rename",
		[
			"document",
			"trashed_documents_own",
			"trashed_branches_own",
			"permissions",
		],
	],
	["favorite", ["document", "document-favorites-count"]],
	["save", ["document", "branches"]],
	["createBranch", ["document", "branches"]],
	["createVersion", ["versions", "branches"]],
	["merge", ["document", "branches"]],
	["share", ["collaborators", "permissions", "sharedWithCount"]],
	...(["trashDocument", "restoreDocument", "deleteDocument"] as const).map(
		(name): [typeof name, string[]] => [
			name,
			[
				"trashed_documents_own",
				"trashed_branches_own",
				"trashDocumentCount",
				"trashBranchCount",
				"documentCount",
				"document-favorites-count",
				"sharedWithCount",
				"branches",
				"permissions",
			],
		],
	),
	...(["trashBranch", "restoreBranch", "deleteBranch"] as const).map(
		(name): [typeof name, string[]] => [
			name,
			["branches", "trashed_branches_own", "trashBranchCount", "permissions"],
		],
	),
];
beforeEach(() => {
	replaceAccessToken(tokenFor());
	client = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: 3, retryDelay: 0 },
		},
	});
	keys.forEach((key) => {
		client.setQueryData(
			key,
			key[0] === "document" ? document : { content: json },
		);
	});
	const coordinator = new SaveCoordinator({
		epoch: getSession().epoch,
		content: json,
		save: async () => {},
		canWrite: () => true,
		apply: () => undefined,
		lock: () => {},
	});
	registerPersistence({
		documentId: "doc",
		branchId: "main",
		mode: "solo",
		epoch: getSession().epoch,
		coordinator,
	});
	axiosInstance.defaults.adapter = async (config) => ({
		config,
		data: config.url?.endsWith("/content")
			? { content: json }
			: { ...document, title: "Renamed", shared: true },
		status: 200,
		statusText: "OK",
		headers: {},
	});
});
afterEach(() => {
	client.clear();
	usePersistenceRegistry.setState({ active: null });
	axiosInstance.defaults.adapter = adapter;
	vi.restoreAllMocks();
});

describe("document mutation freshness", () => {
	it.each(cases)(
		"%s refreshes all affected variants and preserves unrelated cached content",
		async (action, prefixes) => {
			if (action === "share")
				registerPersistence({
					documentId: "doc",
					branchId: "main",
					mode: "collaborative",
					epoch: getSession().epoch,
					coordinator: null,
				});
			const { result } = renderHook(useActions, { wrapper });
			await act(async () => {
				await result.current[action]();
			});
			for (const key of keys) {
				if (
					["documents-own", "shared-with", ...prefixes].includes(
						String(key[0]),
					) &&
					!(key[0] === "document" && key[1] === "other")
				)
					expect(
						client.getQueryState(key)?.isInvalidated,
						JSON.stringify(key),
					).toBe(true);
			}
			expect(client.getQueryState(["document", "other"])?.isInvalidated).toBe(
				false,
			);
			if (action === "deleteDocument") {
				expect(
					client.getQueryData(["branch-content", "doc", "main"]),
				).toBeUndefined();
				expect(
					client.getQueryData(["version-content", "doc", "version"]),
				).toBeUndefined();
			} else
				expect(
					client.getQueryState(["branch-content", "doc", "main"])
						?.isInvalidated,
				).toBe(false);
			if (action === "deleteBranch") {
				expect(
					client.getQueryData(["branch-content", "doc", "other"]),
				).toBeUndefined();
				expect(
					client.getQueryData(["version-content", "doc", "version"]),
				).toBeUndefined();
			}
			if (action === "rename")
				expect(client.getQueryData(["document", "doc"])).toMatchObject({
					title: "Renamed",
				});
		},
	);

	it("awaits active freshness before resolving the mutation", async () => {
		let finish!: () => void;
		const gate = new Promise<void>((resolve) => {
			finish = resolve;
		});
		vi.spyOn(client, "invalidateQueries").mockReturnValue(gate);
		const { result } = renderHook(useActions, { wrapper });
		let done = false;
		const operation = result.current.favorite().then(() => {
			done = true;
		});
		await vi.waitFor(() => expect(client.invalidateQueries).toHaveBeenCalled());
		expect(done).toBe(false);
		finish();
		await act(async () => {
			await operation;
		});
		expect(done).toBe(true);
	});

	it("does not automatically replay a failed non-idempotent toggle even with global retries", async () => {
		const request = vi.fn(async () => {
			throw new Error("Disconnected after POST");
		});
		axiosInstance.defaults.adapter = request;
		const { result } = renderHook(useActions, { wrapper });
		await act(async () => {
			await expect(result.current.favorite()).rejects.toThrow("Disconnected");
		});
		expect(request).toHaveBeenCalledOnce();
		expect(client.getQueryState(["document", "doc"])?.isInvalidated).toBe(
			false,
		);
	});

	it("rejects a completion from a signed-out session before cache refreshes", async () => {
		let finish!: () => void;
		const gate = new Promise<void>((resolve) => {
			finish = resolve;
		});
		axiosInstance.defaults.adapter = async (config) => {
			await gate;
			return {
				config,
				data: document,
				status: 200,
				statusText: "OK",
				headers: {},
			};
		};
		const { result } = renderHook(useActions, { wrapper });
		const promise = result.current.rename();
		const failure = expect(promise).rejects.toThrow("Session changed");
		await Promise.resolve();
		endSession();
		finish();
		await act(async () => {
			await failure;
		});
		expect(
			client.getQueryState(["documents-own", { page: 0 }])?.isInvalidated,
		).toBe(false);
	});
});

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	registerPersistence,
	usePersistenceRegistry,
} from "@/features/editor/persistence/persistenceRegistry";
import useShareDocument from "@/hooks/document/collaboration/useShareDocument";
import useCreateBranch from "@/hooks/document/useCreateBranch";
import useCreateVersion from "@/hooks/document/useCreateVersion";
import useMergeBranch from "@/hooks/document/useMergeBranch";
import useMergeVersion from "@/hooks/document/useMergeVersion";
import { axiosInstance } from "@/services/apiService";
import { getSession, replaceAccessToken } from "@/states/sessionStore";
import { document, tokenFor } from "../../../fixtures";

let client: QueryClient;
const original = axiosInstance.defaults.adapter;
const wrapper = ({ children }: { children: ReactNode }) => (
	<QueryClientProvider client={client}>{children}</QueryClientProvider>
);
beforeEach(() => {
	replaceAccessToken(tokenFor());
	client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
});
afterEach(() => {
	client.clear();
	usePersistenceRegistry.setState({ active: null });
	axiosInstance.defaults.adapter = original;
	vi.restoreAllMocks();
});

describe("backend-gated workflows", () => {
	it("rejects all collaborative snapshots and replacements without REST writes", async () => {
		const request = vi.fn();
		axiosInstance.defaults.adapter = async (config) => {
			request(config);
			return { config, data: {}, status: 200, statusText: "OK", headers: {} };
		};
		registerPersistence({
			documentId: "doc",
			branchId: "main",
			epoch: getSession().epoch,
			mode: "collaborative",
			coordinator: null,
		});
		const { result } = renderHook(
			() => ({
				branch: useCreateBranch("doc", "main"),
				version: useCreateVersion("doc", "main"),
				mergeBranch: useMergeBranch("doc", "main", "source"),
				mergeVersion: useMergeVersion("doc", "main", "version"),
			}),
			{ wrapper },
		);
		await act(async () => {
			await expect(
				result.current.branch.mutateAsync({ branchName: "draft" }),
			).rejects.toThrow("collaborative persistence");
			await expect(
				result.current.version.mutateAsync({
					title: "Draft",
					status: "PRIVATE",
				}),
			).rejects.toThrow("collaborative persistence");
			await expect(result.current.mergeBranch.mutateAsync()).rejects.toThrow(
				"collaborative persistence",
			);
			await expect(result.current.mergeVersion.mutateAsync()).rejects.toThrow(
				"collaborative persistence",
			);
		});
		expect(request).not.toHaveBeenCalled();
	});

	it("rejects branch self-merges and missing originating editors", async () => {
		const request = vi.fn();
		axiosInstance.defaults.adapter = async (config) => {
			request();
			return { config, data: {}, status: 200, statusText: "OK", headers: {} };
		};
		const { result } = renderHook(
			() => ({
				self: useMergeBranch("doc", "main", "main"),
				branch: useCreateBranch("doc", "missing"),
			}),
			{ wrapper },
		);
		await act(async () => {
			await expect(result.current.self.mutateAsync()).rejects.toThrow(
				"different source",
			);
			await expect(
				result.current.branch.mutateAsync({ branchName: "draft" }),
			).rejects.toThrow("Open the target");
		});
		expect(request).not.toHaveBeenCalled();
	});

	it("allows first sharing from the dashboard and updates document metadata", async () => {
		const request = vi.fn();
		axiosInstance.defaults.adapter = async (config) => {
			request(config.method);
			return {
				config,
				data: document,
				status: 200,
				statusText: "OK",
				headers: {},
			};
		};
		const { result } = renderHook(() => useShareDocument("doc"), { wrapper });
		await act(async () => {
			await result.current.mutateAsync({ userId: 2, permission: "READ_WRITE" });
		});
		expect(request.mock.calls).toEqual([["get"], ["post"]]);
		expect(client.getQueryData(["document", "doc"])).toMatchObject({
			shared: true,
		});
	});

	it("rejects sharing by a non-owner without posting", async () => {
		const request = vi.fn();
		axiosInstance.defaults.adapter = async (config) => {
			request(config.method);
			return {
				config,
				data: { ...document, ownerId: 2 },
				status: 200,
				statusText: "OK",
				headers: {},
			};
		};
		const { result } = renderHook(() => useShareDocument("doc"), { wrapper });
		await act(async () => {
			await expect(
				result.current.mutateAsync({ userId: 3, permission: "READ_WRITE" }),
			).rejects.toThrow("Only the document owner");
		});
		expect(request.mock.calls).toEqual([["get"]]);
	});

	it("awaits affected cache refreshes after sharing an already collaborative document", async () => {
		const request = vi.fn();
		axiosInstance.defaults.adapter = async (config) => {
			request(config);
			return {
				config,
				data: { ...document, shared: true },
				status: 200,
				statusText: "OK",
				headers: {},
			};
		};
		registerPersistence({
			documentId: "doc",
			branchId: "main",
			epoch: getSession().epoch,
			mode: "collaborative",
			coordinator: null,
		});
		const invalidate = vi.spyOn(client, "invalidateQueries");
		const { result } = renderHook(() => useShareDocument("doc"), { wrapper });
		await act(async () => {
			await result.current.mutateAsync({ userId: 2, permission: "READ_ONLY" });
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(request.mock.calls.map(([config]) => config.method)).toEqual([
			"get",
			"post",
		]);
		expect(request.mock.calls[1][0].url).toBe("/documents/doc/share");
		expect(invalidate.mock.calls.map(([filter]) => filter?.queryKey)).toEqual(
			expect.arrayContaining([
				["document", "doc"],
				["collaborators", "doc"],
				["permissions", "doc"],
				["documents-own"],
				["shared-with"],
			]),
		);
	});
});

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { replaceAccessToken } from "@/features/auth/stores/sessionStore";
import { mutationQueryKeys } from "@/features/documents/hooks/documentMutationCache";
import useSidebarData from "@/features/workspace/hooks/useSidebarData";
import { axiosInstance } from "@/services/apiService";
import { tokenFor } from "../../../fixtures";

let client: QueryClient;
const adapter = axiosInstance.defaults.adapter;
const wrapper = ({ children }: { children: ReactNode }) => (
	<QueryClientProvider client={client}>{children}</QueryClientProvider>
);
beforeEach(() => {
	replaceAccessToken(tokenFor());
	client = new QueryClient({
		defaultOptions: { queries: { retry: false, gcTime: 0 } },
	});
});
afterEach(() => {
	client.clear();
	axiosInstance.defaults.adapter = adapter;
});

it("fetches all sidebar counts with one request and preserves the sidebar shape", async () => {
	const request = vi.fn(async (config) => ({
		config,
		data: { documents: 8, favorites: 3, shared: 2, recent: 8, trash: 5 },
		status: 200,
		statusText: "OK",
		headers: {},
	}));
	axiosInstance.defaults.adapter = request;
	const { result } = renderHook(useSidebarData, { wrapper });
	await waitFor(() =>
		expect(result.current).toEqual({
			documents: 8,
			quick: 3,
			shared: 2,
			resents: 8,
			trash: 5,
		}),
	);
	expect(request).toHaveBeenCalledOnce();
	expect(request.mock.calls[0][0].url).toBe("/stats/sidebar");
});

it("preserves zero counts", async () => {
	axiosInstance.defaults.adapter = async (config) => ({
		config,
		data: { documents: 0, favorites: 0, shared: 0, recent: 0, trash: 0 },
		status: 200,
		statusText: "OK",
		headers: {},
	});
	const { result } = renderHook(useSidebarData, { wrapper });
	await waitFor(() => expect(result.current.documents).toBe(0));
	expect(Object.values(result.current)).toEqual([0, 0, 0, 0, 0]);
});

it("returns unavailable counts while loading and on failure", async () => {
	axiosInstance.defaults.adapter = async () => {
		throw new Error("Unavailable");
	};
	const { result } = renderHook(useSidebarData, { wrapper });
	expect(Object.values(result.current)).toEqual([null, null, null, null, null]);
	await waitFor(() =>
		expect(client.getQueryState(["sidebar-stats"])?.status).toBe("error"),
	);
	expect(Object.values(result.current)).toEqual([null, null, null, null, null]);
});

it.each([
	"create",
	"favorite",
	"share",
	"trashDocument",
	"restoreDocument",
	"deleteDocument",
	"trashBranch",
	"restoreBranch",
	"deleteBranch",
] as const)("refreshes sidebar counts after %s", (action) => {
	expect(mutationQueryKeys(action, "doc")).toContainEqual(["sidebar-stats"]);
});

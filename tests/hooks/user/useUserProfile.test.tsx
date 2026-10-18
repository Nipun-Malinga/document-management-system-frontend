import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import ms from "ms";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useUpdateProfile, useUserProfile } from "@/hooks/user";
import { axiosInstance } from "@/services/apiService";
import { getSession, replaceAccessToken } from "@/states/sessionStore";
import { tokenFor } from "../../fixtures";

const baseURL = process.env.DMS_SELF_SERVICE_URL;
const originalBaseURL = axiosInstance.defaults.baseURL;
let client: QueryClient;
let reads: number;
let interceptor: number;

const wrapper = ({ children }: { children: ReactNode }) => (
	<QueryClientProvider client={client}>{children}</QueryClientProvider>
);
const openProfile = () =>
	renderHook(() => ({ query: useUserProfile(), update: useUpdateProfile() }), {
		wrapper,
	});

describe.skipIf(!baseURL)(
	"profile cache against the Postman simulation",
	() => {
		beforeEach(async () => {
			client = new QueryClient({
				defaultOptions: {
					queries: { retry: false },
					mutations: { retry: false },
				},
			});
			await fetch(`${baseURL}/__reset`, { method: "POST" });
			axiosInstance.defaults.baseURL = `${baseURL}/api`;
			replaceAccessToken(tokenFor());
			reads = 0;
			interceptor = axiosInstance.interceptors.request.use((config) => {
				if (config.method === "get" && config.url === "/users/me") reads++;
				return config;
			});
		});
		afterEach(() => {
			vi.restoreAllMocks();
			vi.useRealTimers();
			axiosInstance.interceptors.request.eject(interceptor);
			axiosInstance.defaults.baseURL = originalBaseURL;
			client.clear();
		});

		it("shares fresh cached details across mounts and refetches after five minutes", async () => {
			const first = openProfile();
			await waitFor(() =>
				expect(first.result.current.query.isSuccess).toBe(true),
			);
			expect(reads).toBe(1);
			first.unmount();

			const cached = openProfile();
			await waitFor(() =>
				expect(cached.result.current.query.isSuccess).toBe(true),
			);
			expect(cached.result.current.query.data?.firstname).toBe("Alex");
			expect(cached.result.current.query.isFetching).toBe(false);
			expect(reads).toBe(1);
			cached.unmount();

			vi.spyOn(Date, "now").mockReturnValue(Date.now() + ms("6m"));
			const stale = openProfile();
			await waitFor(() => expect(reads).toBe(2));
			await waitFor(() =>
				expect(
					client.getQueryState(["profile", getSession().epoch])?.fetchStatus,
				).toBe("idle"),
			);
			expect(stale.result.current.query.data?.firstname).toBe("Alex");
			stale.unmount();
		});

		it("reuses saved details immediately and removes inactive cache entries after thirty minutes", async () => {
			const current = openProfile();
			await waitFor(() =>
				expect(current.result.current.query.isSuccess).toBe(true),
			);
			await act(async () => {
				await current.result.current.update.mutateAsync({
					firstname: "Alex",
					lastname: "Morgan",
					email: "updated@example.com",
				});
			});
			const key = ["profile", getSession().epoch];
			expect(client.getQueryData(key)).toMatchObject({
				email: "updated@example.com",
			});
			current.unmount();

			const reopened = openProfile();
			await waitFor(() =>
				expect(reopened.result.current.query.isSuccess).toBe(true),
			);
			expect(reopened.result.current.query.data?.email).toBe(
				"updated@example.com",
			);
			expect(reads).toBe(1);
			vi.useFakeTimers();
			reopened.unmount();
			act(() => vi.advanceTimersByTime(ms("29m")));
			expect(client.getQueryData(key)).toBeDefined();
			act(() => vi.advanceTimersByTime(ms("1m")));
			expect(client.getQueryData(key)).toBeUndefined();
		});
	},
);

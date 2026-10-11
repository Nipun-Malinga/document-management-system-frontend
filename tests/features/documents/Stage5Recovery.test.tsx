import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	act,
	fireEvent,
	render,
	renderHook,
	screen,
	waitFor,
	within,
} from "@testing-library/react";
import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Alert from "@/components/common/Alert";
import DocumentCard from "@/features/documents/components/DocumentCard";
import InfoEditor from "@/features/documents/components/info/InfoEditor";
import MainView from "@/features/documents/layouts/MainView";
import Resents from "@/features/documents/layouts/Resents";
import SearchUser from "@/features/users/components/SearchUser";
import useUserDocuments from "@/hooks/document/useUserDocuments";
import useFavoriteCount from "@/hooks/sidebar/useFavoriteCount";
import useSidebarData from "@/hooks/sidebar/useSidebarData";
import AdminSignin from "@/pages/admin/AdminSignin";
import Register from "@/pages/Register";
import SignIn from "@/pages/SignIn";
import { axiosInstance } from "@/services/apiService";
import { endSession, replaceAccessToken } from "@/states/sessionStore";
import { document, tokenFor } from "../../fixtures";
import { pageOf } from "../../pages";

vi.mock("@/features/documents/components/Templates", () => ({
	default: () => null,
}));
let client: QueryClient;
let requests: InternalAxiosRequestConfig[];
let failRead: boolean;
let failWrite: boolean;
let favorite: boolean;
const original = axiosInstance.defaults.adapter;
const success = (config: InternalAxiosRequestConfig, data: unknown) => ({
	config,
	data,
	status: 200,
	statusText: "OK",
	headers: {},
});
const failure = (
	config: InternalAxiosRequestConfig,
	detail = "Service unavailable",
	status = 503,
) =>
	new AxiosError("Rejected", undefined, config, undefined, {
		...success(config, { detail }),
		status,
	});
const wrapper = ({ children }: { children: ReactNode }) => (
	<QueryClientProvider client={client}>
		<MemoryRouter>{children}</MemoryRouter>
	</QueryClientProvider>
);
const show = (children: ReactNode) => render(children, { wrapper });
beforeEach(() => {
	replaceAccessToken(tokenFor());
	client = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: 2, retryDelay: 0 },
		},
	});
	requests = [];
	failRead = false;
	failWrite = false;
	favorite = false;
	axiosInstance.defaults.adapter = async (config) => {
		requests.push(config);
		if (config.method !== "get") {
			if (failWrite) throw failure(config);
			if (config.url?.endsWith("/favorites/toggle")) favorite = !favorite;
			return success(config, { ...document, title: "Renamed", favorite });
		}
		if (failRead) throw failure(config);
		if (config.url?.startsWith("/users/find/"))
			return success(config, {
				id: 2,
				email: decodeURIComponent(config.url.slice("/users/find/".length)),
			});
		if (config.url === "/documents") {
			const all = config.params.title
				? [{ ...document, title: config.params.title, favorite }]
				: Array.from({ length: 21 }, (_, i) => ({
						...document,
						id: `doc-${i}`,
						title: `Record ${i + 1}`,
						favorite,
					}));
			const { page, size } = config.params;
			return success(
				config,
				pageOf(
					all.slice(page * size, (page + 1) * size),
					page,
					all.length,
					size,
				),
			);
		}
		if (config.url?.includes("/count"))
			return success(config, { count: favorite ? 1 : 0 });
		return success(config, { ...document, favorite });
	};
});
afterEach(() => {
	client.clear();
	axiosInstance.defaults.adapter = original;
	vi.useRealTimers();
	vi.restoreAllMocks();
});

describe("Stage 5 search, recents and recovery", () => {
	it("debounces exact-title search for 300ms, resets a later page, and clears the filter", async () => {
		show(<MainView />);
		await screen.findByText("Record 1");
		fireEvent.click(
			within(
				screen.getByRole("navigation", { name: "documents pagination" }),
			).getByRole("button", { name: "Next" }),
		);
		await screen.findByText("Record 21");
		const count = requests.length;
		vi.useFakeTimers();
		const input = screen.getByRole("textbox", {
			name: "Search documents by exact title",
		});
		fireEvent.change(input, { target: { value: "Target" } });
		await act(async () => {
			await vi.advanceTimersByTimeAsync(150);
		});
		fireEvent.change(input, { target: { value: "Target #1" } });
		await act(async () => {
			await vi.advanceTimersByTimeAsync(299);
		});
		expect(requests).toHaveLength(count);
		await act(async () => {
			await vi.advanceTimersByTimeAsync(1);
		});
		await act(async () => {
			await vi.advanceTimersByTimeAsync(1);
		});
		vi.useRealTimers();
		await screen.findByText("Target #1");
		expect(requests.at(-1)?.params).toMatchObject({
			title: "Target #1",
			page: 0,
		});
		expect(input).toBe(
			screen.getByRole("textbox", { name: "Search documents by exact title" }),
		);
		fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
		await screen.findByText("Record 1");
		expect(input).toHaveValue("");
		expect(
			client.getQueryCache().findAll({ queryKey: ["documents-own"] }).length,
		).toBeGreaterThan(2);
	});
	it("renders paginated recently updated owned documents and counts totalElements", async () => {
		show(<Resents />);
		await screen.findByText("Record 1");
		expect(requests[0].url).toBe("/documents");
		expect(requests[0].params.sort).toBe("updatedAt,desc");
		expect(screen.getByText(/This is not view history/)).toBeInTheDocument();
		const nav = screen.getByRole("navigation", {
			name: "recent documents pagination",
		});
		expect(within(nav).getByText("21 items · Page 1 of 2")).toBeInTheDocument();
		fireEvent.click(within(nav).getByRole("button", { name: "Next" }));
		await screen.findByText("Record 21");
		const { result } = renderHook(useSidebarData, { wrapper });
		await waitFor(() => expect(result.current.resents).toBe(21));
	});
	it("shows a failed Recents query as an error and recovers explicitly", async () => {
		failRead = true;
		show(<Resents />);
		expect(await screen.findByRole("alert")).toHaveTextContent(
			"Service unavailable",
		);
		expect(
			screen.queryByText("No recent documents found."),
		).not.toBeInTheDocument();
		failRead = false;
		fireEvent.click(screen.getByRole("button", { name: "Try again" }));
		await screen.findByText("Record 1");
	});
	it("looks up only submitted valid emails, encodes special characters, and clears cancelled results", async () => {
		show(
			<SearchUser
				title="Invite"
				subTitle="Find a user"
				onClick={() => {}}
				userPending={false}
			/>,
		);
		expect(requests).toHaveLength(0);
		const input = screen.getByLabelText("User email");
		fireEvent.change(input, { target: { value: "invalid" } });
		expect(requests).toHaveLength(0);
		const email = "tag+one#two%three@example.com";
		fireEvent.change(input, { target: { value: email } });
		await waitFor(() =>
			expect(screen.getByRole("button", { name: "Submit" })).toBeEnabled(),
		);
		expect(requests).toHaveLength(0);
		fireEvent.click(screen.getByRole("button", { name: "Submit" }));
		await screen.findByText("User found");
		expect(requests[0].url).toBe(`/users/find/${encodeURIComponent(email)}`);
		fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
		expect(screen.queryByText("User found")).not.toBeInTheDocument();
		expect(input).toHaveValue("");
	});
	it("keeps lookup service errors distinct from not-found and preserves input for retry", async () => {
		failRead = true;
		show(
			<SearchUser
				title="Invite"
				subTitle="Find a user"
				onClick={() => {}}
				userPending={false}
			/>,
		);
		fireEvent.change(screen.getByLabelText("User email"), {
			target: { value: "user@example.com" },
		});
		await waitFor(() =>
			expect(screen.getByRole("button", { name: "Submit" })).toBeEnabled(),
		);
		fireEvent.click(screen.getByRole("button", { name: "Submit" }));
		expect(await screen.findByRole("alert")).toHaveTextContent(
			"Service unavailable",
		);
		expect(screen.getByLabelText("User email")).toHaveValue("user@example.com");
		failRead = false;
		fireEvent.click(screen.getByRole("button", { name: "Retry lookup" }));
		await screen.findByText("User found");
	});
	it("updates active favorites and counts after a toggle without reload", async () => {
		const FavoriteList = () => {
			const list = useUserDocuments({ favorite: true });
			const count = useFavoriteCount();
			return (
				<>
					<output aria-label="Favorite count">{count.data?.count}</output>
					<output aria-label="Favorite list">
						{String(list.data?.content[0]?.favorite)}
					</output>
					<DocumentCard document={document} />
				</>
			);
		};
		show(<FavoriteList />);
		await waitFor(() =>
			expect(screen.getByLabelText("Favorite list")).toHaveTextContent("false"),
		);
		fireEvent.click(screen.getByRole("button", { name: "Toggle bookmark" }));
		await waitFor(() =>
			expect(screen.getByLabelText("Favorite count")).toHaveTextContent("1"),
		);
		await waitFor(() =>
			expect(screen.getByLabelText("Favorite list")).toHaveTextContent("true"),
		);
	});
	it("preserves a rename form on failure and retries only on explicit submit", async () => {
		failWrite = true;
		show(<InfoEditor document={document} />);
		fireEvent.change(screen.getByLabelText("Document Title"), {
			target: { value: "Renamed" },
		});
		await waitFor(() =>
			expect(screen.getByRole("button", { name: "Update" })).toBeEnabled(),
		);
		fireEvent.click(screen.getByRole("button", { name: "Update" }));
		expect(await screen.findByRole("alert")).toHaveTextContent(
			"Service unavailable",
		);
		expect(screen.getByLabelText("Document Title")).toHaveValue("Renamed");
		expect(requests).toHaveLength(1);
		failWrite = false;
		fireEvent.click(screen.getByRole("button", { name: "Update" }));
		await waitFor(() =>
			expect(client.getQueryData(["document", "doc"])).toMatchObject({
				title: "Renamed",
			}),
		);
	});
	it("retains failed destructive confirmation and waits for explicit retry", async () => {
		const action = vi
			.fn()
			.mockRejectedValueOnce(new Error("Delete failed"))
			.mockResolvedValueOnce(undefined);
		show(
			<Alert
				trigger={<button type="button">Delete item</button>}
				title="Delete item?"
				description="This cannot be undone."
				action="Confirm delete"
				onClick={action}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Delete item" }));
		fireEvent.click(screen.getByRole("button", { name: "Confirm delete" }));
		expect(await screen.findByRole("alert")).toHaveTextContent("Delete failed");
		expect(action).toHaveBeenCalledOnce();
		fireEvent.click(screen.getByRole("button", { name: "Confirm delete" }));
		await waitFor(() =>
			expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument(),
		);
		expect(action).toHaveBeenCalledTimes(2);
	});
	it.each([
		["user", <SignIn key="SignIn" />],
		["admin", <AdminSignin key="AdminSignin" />],
	] as const)(
		"the %s sign-in accepts a long valid email and preserves rejected credentials",
		async (_name, page) => {
			endSession();
			failWrite = true;
			show(page);
			const email = "a-very-long-valid-address+tag@example.com";
			fireEvent.change(screen.getByLabelText("Email Address"), {
				target: { value: email },
			});
			fireEvent.change(screen.getByLabelText("Password"), {
				target: { value: "password" },
			});
			await waitFor(() =>
				expect(screen.getByRole("button", { name: "Sign In" })).toBeEnabled(),
			);
			fireEvent.click(screen.getByRole("button", { name: "Sign In" }));
			expect(await screen.findByRole("alert")).toHaveTextContent(
				"Service unavailable",
			);
			expect(screen.getByLabelText("Email Address")).toHaveValue(email);
		},
	);
	it.each(["username", "email"] as const)(
		"registration displays a %s conflict accurately and keeps all inputs",
		async (field) => {
			endSession();
			axiosInstance.defaults.adapter = async (config) => {
				requests.push(config);
				throw failure(
					config,
					`${field}: value is already registered in system.`,
					409,
				);
			};
			show(<Register />);
			for (const [label, value] of [
				["First Name", "Tom"],
				["Last Name", "Cruise"],
				["Username", "owner"],
				["Email Address", "long-valid-email-address+tag@example.com"],
				["Password", "password"],
				["Confirm Password", "password"],
			])
				fireEvent.change(screen.getByLabelText(label), { target: { value } });
			fireEvent.click(screen.getByRole("checkbox"));
			const submit = screen.getByRole("button", { name: /Create Account/ });
			await waitFor(() => expect(submit).toBeEnabled());
			fireEvent.click(submit);
			await waitFor(() =>
				expect(
					screen
						.getAllByRole("alert")
						.some((alert) => alert.textContent?.includes(`${field}: value`)),
				).toBe(true),
			);
			expect(screen.getByLabelText("Username")).toHaveValue("owner");
			expect(screen.getByLabelText("First Name")).toHaveValue("Tom");
			const payload = JSON.parse(requests[0].data);
			expect(payload).not.toHaveProperty("confirmPassword");
			expect(payload).not.toHaveProperty("acceptTerms");
			expect(requests).toHaveLength(1);
		},
	);
});

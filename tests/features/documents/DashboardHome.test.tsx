import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SideBar from "@/components/layout/SideBar";
import { sidebarData } from "@/data/Sidebar";
import { replaceAccessToken } from "@/features/auth/utils/authUtils";
import DocumentCard from "@/features/documents/components/DocumentCard";
import useDocumentInfoPopUp from "@/features/documents/stores/useDocumentInfoPopup";
import useDocumentBranch from "@/features/editor/stores/useDocumentBranch";
import useAside from "@/features/workspace/stores/useAside";
import { axiosInstance } from "@/services/apiService";
import { document as fixture, tokenFor } from "../../fixtures";

const originalAdapter = axiosInstance.defaults.adapter;
let client: QueryClient;
let resize: () => void;
let desktop = false;
beforeEach(() => {
	client = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	});
	replaceAccessToken(tokenFor());
	useAside.setState({ collapsed: true });
	useDocumentInfoPopUp.setState({
		documentId: null,
		collapsed: true,
		shared: false,
	});
	desktop = false;
	vi.stubGlobal(
		"matchMedia",
		vi.fn(() => ({
			get matches() {
				return desktop;
			},
			addEventListener: (_event: string, listener: () => void) => {
				resize = listener;
			},
			removeEventListener: vi.fn(),
		})),
	);
});
afterEach(() => {
	client.clear();
	axiosInstance.defaults.adapter = originalAdapter;
	vi.unstubAllGlobals();
});
const renderCard = (ownerId = 1) =>
	render(
		<QueryClientProvider client={client}>
			<MemoryRouter>
				<DocumentCard
					document={{
						...fixture,
						ownerId,
						shared: true,
						mainBranchId: "actual-main",
					}}
				/>
			</MemoryRouter>
		</QueryClientProvider>,
	);
const renderSidebar = () =>
	render(
		<MemoryRouter initialEntries={["/dashboard/home"]}>
			<button
				id="workspace-menu"
				type="button"
				onClick={() => useAside.getState().toggle()}
			>
				Open navigation
			</button>
			<div id="workspace-content" tabIndex={-1} />
			<SideBar
				sidebarLink={sidebarData({
					documents: 3,
					quick: 1,
					resents: 3,
					shared: null,
					trash: 0,
				})}
			/>
		</MemoryRouter>,
	);

describe("dashboard document actions", () => {
	it("opens the server-provided main branch and selects document information", async () => {
		renderCard();
		expect(screen.getByRole("link", { name: "Open Document" })).toHaveAttribute(
			"href",
			"/document/doc/branch/actual-main/edit",
		);
		useDocumentBranch.setState({ branchName: "other" });
		await userEvent.click(
			screen.getByRole("button", { name: "Information about Document" }),
		);
		expect(useDocumentInfoPopUp.getState()).toMatchObject({
			documentId: "doc",
			collapsed: false,
			shared: true,
		});
		expect(useDocumentBranch.getState().branchName).toBe("main");
	});
	it("keeps bookmarks owner-only and calls the existing mutation", async () => {
		const requests = vi.fn();
		axiosInstance.defaults.adapter = async (config) => {
			requests(config.url);
			return { config, data: {}, status: 200, statusText: "OK", headers: {} };
		};
		const view = renderCard(2);
		expect(
			screen.queryByRole("button", { name: "Toggle bookmark" }),
		).not.toBeInTheDocument();
		view.unmount();
		renderCard();
		await userEvent.click(
			screen.getByRole("button", { name: "Toggle bookmark" }),
		);
		await waitFor(() =>
			expect(requests).toHaveBeenCalledWith("/documents/doc/favorites/toggle"),
		);
	});
});

describe("mobile workspace navigation", () => {
	it("closes on navigation, marks the current collection, and restores menu focus", async () => {
		const user = userEvent.setup();
		renderSidebar();
		await user.click(screen.getByRole("button", { name: "Open navigation" }));
		const dialog = screen.getByRole("dialog", { name: "Workspace navigation" });
		expect(
			within(dialog).getByRole("link", { name: "Home 3" }),
		).toHaveAttribute("aria-current", "page");
		await user.click(
			within(dialog).getByRole("link", { name: "Quick Access 1" }),
		);
		await waitFor(() =>
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
		);
		expect(
			screen.getByRole("button", { name: "Open navigation" }),
		).toHaveFocus();
		expect(
			screen.getByRole("link", { name: "Quick Access 1" }),
		).toHaveAttribute("aria-current", "page");
	});
	it("supports Escape and preserves unavailable counts", async () => {
		const user = userEvent.setup();
		renderSidebar();
		await user.click(screen.getByRole("button", { name: "Open navigation" }));
		expect(
			within(screen.getByRole("dialog")).getByRole("link", {
				name: /Shared With Me count unavailable/,
			}),
		).toBeInTheDocument();
		await user.keyboard("{Escape}");
		await waitFor(() =>
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
		);
		expect(
			screen.getByRole("button", { name: "Open navigation" }),
		).toHaveFocus();
	});
	it("closes the mobile dialog when the viewport becomes desktop", async () => {
		renderSidebar();
		await userEvent.click(
			screen.getByRole("button", { name: "Open navigation" }),
		);
		act(() => {
			desktop = true;
			resize();
		});
		await waitFor(() =>
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
		);
		expect(useAside.getState().collapsed).toBe(true);
		expect(window.document.getElementById("workspace-content")).toHaveFocus();
	});
});

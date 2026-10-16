import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AxiosError } from "axios";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Notification from "@/components/common/Notification";
import UserDropdown from "@/components/common/UserDropdown";
import InfoPopup from "@/features/documents/components/info/InfoPopup";
import ProfilePopup from "@/features/users/components/ProfilePopup";
import { axiosInstance } from "@/services/apiService";
import WebSocketService from "@/services/websocketService";
import useDocumentInfoPopUp from "@/states/useDocumentInfoPopup";
import useUserProfilePopup from "@/states/useUserProfilePopup";
import { replaceAccessToken } from "@/utils/authUtils";
import { document as fixture, tokenFor } from "../../fixtures";
import { pageOf } from "../../pages";

const originalAdapter = axiosInstance.defaults.adapter;
const originalScrollIntoView = Object.getOwnPropertyDescriptor(
	Element.prototype,
	"scrollIntoView",
);
let client: QueryClient;
let ownerId = 1;
let fail = false;
beforeEach(() => {
	Object.defineProperty(Element.prototype, "scrollIntoView", {
		configurable: true,
		value: vi.fn(),
	});
	replaceAccessToken(tokenFor());
	client = new QueryClient({
		defaultOptions: {
			queries: { retry: false, gcTime: 0 },
			mutations: { retry: false },
		},
	});
	useDocumentInfoPopUp.setState({
		documentId: null,
		collapsed: true,
		shared: false,
	});
	useUserProfilePopup.setState({ collapsed: true });
	ownerId = 1;
	fail = false;
	axiosInstance.defaults.adapter = async (config) => {
		if (fail && config.url === "/documents/doc")
			throw new AxiosError("Unavailable", undefined, config, undefined, {
				config,
				status: 500,
				statusText: "Error",
				data: { detail: "Document service unavailable" },
				headers: {},
			});
		return {
			config,
			status: 200,
			statusText: "OK",
			headers: {},
			data:
				config.url === "/documents/doc" ? { ...fixture, ownerId } : pageOf([]),
		};
	};
});
afterEach(() => {
	if (originalScrollIntoView)
		Object.defineProperty(
			Element.prototype,
			"scrollIntoView",
			originalScrollIntoView,
		);
	else Reflect.deleteProperty(Element.prototype, "scrollIntoView");
	client.clear();
	axiosInstance.defaults.adapter = originalAdapter;
});

const InfoHarness = () => {
	const { documentId } = useDocumentInfoPopUp();
	return (
		<>
			<button
				type="button"
				onClick={() => {
					useDocumentInfoPopUp.setState({
						documentId: "doc",
						collapsed: false,
					});
				}}
			>
				Show document information
			</button>
			<InfoPopup documentId={documentId} />
		</>
	);
};
const renderInfo = () =>
	render(
		<QueryClientProvider client={client}>
			<MemoryRouter>
				<InfoHarness />
			</MemoryRouter>
		</QueryClientProvider>,
	);

describe("document information popup", () => {
	it("fits collaborator pages to available space and keeps later people reachable", async () => {
		const user = userEvent.setup();
		const sizes: number[] = [];
		let resize: (height: number) => void = () => {};
		const observe = vi.fn();
		vi.spyOn(WebSocketService.prototype, "subscribe").mockImplementation(
			() => () => {},
		);
		vi.stubGlobal(
			"ResizeObserver",
			class {
				constructor(callback: ResizeObserverCallback) {
					resize = (height) =>
						callback(
							[
								{
									contentRect: new DOMRect(0, 0, 300, height),
								} as ResizeObserverEntry,
							],
							this as unknown as ResizeObserver,
						);
				}
				observe = observe;
				unobserve() {}
				disconnect() {}
			},
		);
		axiosInstance.defaults.adapter = async (config) => {
			let data: unknown = fixture;
			if (config.url?.endsWith("/share/users")) {
				const { page, size } = config.params;
				sizes.push(size);
				const people = Array.from({ length: 5 }, (_, index) => ({
					userId: index + 2,
					username: `Reader ${index + 1}`,
					email: `reader${index + 1}@example.com`,
					permission: "READ_ONLY",
				}));
				data = pageOf(
					people.slice(page * size, (page + 1) * size),
					page,
					people.length,
					size,
				);
			} else if (config.url !== "/documents/doc") data = pageOf([]);
			return { config, data, status: 200, statusText: "OK", headers: {} };
		};
		try {
			renderInfo();
			await user.click(
				screen.getByRole("button", { name: "Show document information" }),
			);
			await user.click(
				await screen.findByRole("tab", { name: "Collaborators" }),
			);
			await screen.findByText("Reader 1");
			expect(sizes).toEqual([1]);
			await waitFor(() => expect(observe).toHaveBeenCalled());
			await act(async () => resize(112));
			await screen.findByText("Reader 2");
			expect(screen.getAllByRole("listitem")).toHaveLength(2);
			const navigation = screen.getByRole("navigation", {
				name: "collaborators pagination",
			});
			await user.click(
				within(navigation).getByRole("button", { name: "Next" }),
			);
			await screen.findByText("Reader 3");
			await act(async () => resize(56));
			await screen.findByText("Reader 1");
			expect(screen.queryByText("Reader 2")).not.toBeInTheDocument();
			expect(navigation).toHaveTextContent("Page 1 of 5");
		} finally {
			vi.unstubAllGlobals();
			vi.restoreAllMocks();
		}
	});

	it("replaces the people list with invitations or filters and restores filter focus", async () => {
		const user = userEvent.setup();
		renderInfo();
		await user.click(
			screen.getByRole("button", { name: "Show document information" }),
		);
		await user.click(await screen.findByRole("tab", { name: "Collaborators" }));
		await screen.findByText("No collaborators yet");
		await user.click(screen.getByRole("button", { name: "Add people" }));
		expect(screen.getByLabelText("User email")).toBeVisible();
		expect(
			screen.queryByRole("navigation", { name: "collaborators pagination" }),
		).not.toBeInTheDocument();
		expect(screen.queryByText("No collaborators yet")).not.toBeInTheDocument();
		await user.click(screen.getByRole("button", { name: "Cancel" }));
		await user.click(
			screen.getByRole("button", { name: "Filter collaborators" }),
		);
		expect(screen.getByLabelText("Exact email")).toBeVisible();
		expect(
			screen.queryByRole("navigation", { name: "collaborators pagination" }),
		).not.toBeInTheDocument();
		expect(
			screen.queryByRole("combobox", { name: "collaborators page size" }),
		).not.toBeInTheDocument();
		await user.click(screen.getByRole("button", { name: "Apply filters" }));
		await screen.findByText("No collaborators yet");
		expect(
			screen.getByRole("button", { name: "Filter collaborators" }),
		).toHaveFocus();
	});

	it.each([
		["PRIVATE", "Public", "PUBLIC"],
		["PUBLIC", "Private", "PRIVATE"],
	] as const)(
		"updates %s visibility to %s and restores saved values on Cancel",
		async (initial, label, status) => {
			const user = userEvent.setup();
			let savedDocument = {
				...fixture,
				status: initial as typeof fixture.status,
			};
			const updates: unknown[] = [];
			axiosInstance.defaults.adapter = async (config) => {
				if (config.method === "put" && config.url === "/documents/doc") {
					const update = JSON.parse(config.data);
					updates.push(update);
					savedDocument = { ...savedDocument, ...update };
				}
				return {
					config,
					status: 200,
					statusText: "OK",
					headers: {},
					data: config.url === "/documents/doc" ? savedDocument : pageOf([]),
				};
			};
			renderInfo();
			await user.click(
				screen.getByRole("button", { name: "Show document information" }),
			);
			await user.click(await screen.findByRole("tab", { name: "Edit" }));
			const title = screen.getByLabelText("Document Title");
			const visibility = screen.getByRole("combobox", { name: "Visibility" });
			expect(visibility).toHaveTextContent(
				initial === "PRIVATE" ? "Private" : "Public",
			);
			await user.clear(title);
			await user.type(title, "Updated document");
			visibility.focus();
			await user.keyboard("{Enter}");
			await user.keyboard(
				status === "PUBLIC" ? "{End}{Enter}" : "{Home}{Enter}",
			);
			expect(visibility).toHaveTextContent(label);
			await user.click(screen.getByRole("button", { name: "Update" }));
			await waitFor(() =>
				expect(updates).toEqual([{ title: "Updated document", status }]),
			);
			await waitFor(() =>
				expect(screen.getByRole("button", { name: "Update" })).toBeEnabled(),
			);
			expect(client.getQueryData(["document", "doc"])).toMatchObject({
				status,
			});
			await user.clear(title);
			await user.type(title, "Discard this change");
			visibility.focus();
			await user.keyboard("{Enter}");
			await user.keyboard(
				status === "PUBLIC" ? "{Home}{Enter}" : "{End}{Enter}",
			);
			await user.click(screen.getByRole("button", { name: "Cancel" }));
			expect(title).toHaveValue("Updated document");
			expect(visibility).toHaveTextContent(label);
			expect(updates).toHaveLength(1);
		},
	);

	it.each([
		["Can edit", "READ_WRITE"],
		["Can view", "READ_ONLY"],
	])("shares a new document with %s access", async (label, permission) => {
		const user = userEvent.setup();
		let shared = false;
		const invitations: unknown[] = [];
		axiosInstance.defaults.adapter = async (config) => {
			if (config.method === "post" && config.url === "/documents/doc/share") {
				invitations.push(JSON.parse(config.data));
				shared = true;
			}
			return {
				config,
				status: 200,
				statusText: "OK",
				headers: {},
				data:
					config.url === "/documents/doc"
						? { ...fixture, shared }
						: config.url?.startsWith("/users/find/")
							? { id: 2, username: "reader", email: "reader@example.com" }
							: pageOf([]),
			};
		};
		renderInfo();
		await user.click(
			screen.getByRole("button", { name: "Show document information" }),
		);
		await user.click(await screen.findByRole("tab", { name: "Collaborators" }));
		const addPeople = screen.getByRole("button", { name: "Add people" });
		expect(addPeople).toBeEnabled();
		await user.click(addPeople);
		await user.type(screen.getByLabelText("User email"), "reader@example.com");
		if (permission === "READ_ONLY") {
			screen.getByRole("combobox", { name: "Access level" }).focus();
			await user.keyboard("{Enter}");
			await user.keyboard("{Home}{Enter}");
			expect(
				screen.getByRole("combobox", { name: "Access level" }),
			).toHaveTextContent(label);
		}
		await user.click(screen.getByRole("button", { name: "Find person" }));
		await user.click(
			await screen.findByRole("button", { name: "Grant access" }),
		);
		expect(await screen.findByText("Collaborator added.")).toHaveAttribute(
			"role",
			"status",
		);
		expect(invitations).toEqual([{ userId: 2, permission }]);
		expect(client.getQueryData(["document", "doc"])).toMatchObject({
			shared: true,
		});
		await waitFor(() => expect(addPeople).toHaveFocus());
	});

	it("hides invitations for a non-owner", async () => {
		ownerId = 2;
		const user = userEvent.setup();
		renderInfo();
		await user.click(
			screen.getByRole("button", { name: "Show document information" }),
		);
		await user.click(await screen.findByRole("tab", { name: "Collaborators" }));
		expect(screen.queryByRole("button", { name: "Add people" })).toBeNull();
	});

	it("contains keyboard focus, dismisses with Escape, and restores its opener", async () => {
		const user = userEvent.setup();
		renderInfo();
		const opener = screen.getByRole("button", {
			name: "Show document information",
		});
		await user.click(opener);
		const dialog = await screen.findByRole("dialog", { name: "Document" });
		expect(
			within(dialog).getByRole("tab", { name: "Information" }),
		).toHaveAttribute("aria-selected", "true");
		const close = within(dialog).getByRole("button", { name: "Close" });
		close.focus();
		await user.tab();
		expect(dialog).toContainElement(
			window.document.activeElement as HTMLElement,
		);
		await user.keyboard("{Escape}");
		await waitFor(() =>
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
		);
		expect(opener).toHaveFocus();
	});
	it("retains owner editing controls and hides them for other users", async () => {
		const user = userEvent.setup();
		renderInfo();
		await user.click(
			screen.getByRole("button", { name: "Show document information" }),
		);
		const dialog = await screen.findByRole("dialog", { name: "Document" });
		await user.click(within(dialog).getByRole("tab", { name: "Edit" }));
		expect(within(dialog).getByLabelText("Document Title")).toHaveValue(
			"Document",
		);
		ownerId = 2;
		await client.invalidateQueries({ queryKey: ["document", "doc"] });
		await waitFor(() =>
			expect(
				within(dialog).queryByRole("tab", { name: "Edit" }),
			).not.toBeInTheDocument(),
		);
		expect(
			within(dialog).queryByRole("button", { name: "Move to Trash" }),
		).not.toBeInTheDocument();
		expect(
			within(dialog).getByRole("tab", { name: "Information" }),
		).toHaveAttribute("aria-selected", "true");
	});
	it("dismisses a nested branch selector without closing document information", async () => {
		const user = userEvent.setup();
		renderInfo();
		await user.click(
			screen.getByRole("button", { name: "Show document information" }),
		);
		const info = await screen.findByRole("dialog", { name: "Document" });
		await user.click(
			await within(info).findByRole("button", { name: "Branches: 0" }),
		);
		expect(
			screen.getByRole("menu", { name: "Branch selection" }),
		).toBeInTheDocument();
		await user.keyboard("{Escape}");
		await waitFor(() =>
			expect(
				screen.queryByRole("menu", { name: "Branch selection" }),
			).not.toBeInTheDocument(),
		);
		expect(
			screen.getByRole("dialog", { name: "Document" }),
		).toBeInTheDocument();
		expect(
			within(info).getByRole("button", { name: "Branches: 0" }),
		).toHaveFocus();
	});
	it("keeps a failed trash action open and closes only after a successful retry", async () => {
		const user = userEvent.setup();
		let failTrash = true;
		let writes = 0;
		axiosInstance.defaults.adapter = async (config) => {
			if (config.method === "delete") {
				writes++;
				if (failTrash)
					throw new AxiosError("Unavailable", undefined, config, undefined, {
						config,
						status: 500,
						statusText: "Error",
						data: { detail: "Move unavailable" },
						headers: {},
					});
			}
			return {
				config,
				status: 200,
				statusText: "OK",
				headers: {},
				data: config.url === "/documents/doc" ? fixture : pageOf([]),
			};
		};
		renderInfo();
		await user.click(
			screen.getByRole("button", { name: "Show document information" }),
		);
		await user.click(
			await screen.findByRole("button", { name: "Move to Trash" }),
		);
		expect(await screen.findByRole("alert")).toHaveTextContent(
			"Move unavailable",
		);
		expect(
			screen.getByRole("dialog", { name: "Document" }),
		).toBeInTheDocument();
		failTrash = false;
		await user.click(screen.getByRole("button", { name: "Move to Trash" }));
		await waitFor(() =>
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
		);
		expect(writes).toBe(2);
	});

	it("shows a failed request and recovers only on an explicit retry", async () => {
		const user = userEvent.setup();
		fail = true;
		renderInfo();
		await user.click(
			screen.getByRole("button", { name: "Show document information" }),
		);
		expect(await screen.findByRole("alert")).toHaveTextContent(
			"Document service unavailable",
		);
		fail = false;
		await user.click(
			screen.getByRole("button", { name: "Retry document information" }),
		);
		expect(
			await screen.findByRole("tab", { name: "Information" }),
		).toBeInTheDocument();
		expect(screen.queryByRole("alert")).not.toBeInTheDocument();
	});
});

describe("account and notification popups", () => {
	it("opens profile from the account menu and restores account focus", async () => {
		const user = userEvent.setup();
		render(
			<MemoryRouter>
				<UserDropdown />
				<ProfilePopup />
			</MemoryRouter>,
		);
		await user.click(screen.getByRole("button", { name: "owner" }));
		await user.click(screen.getByRole("menuitem", { name: "Profile" }));
		const dialog = await screen.findByRole("dialog", { name: "Your profile" });
		expect(within(dialog).getByText("owner@example.com")).toBeInTheDocument();
		expect(dialog).toContainElement(
			window.document.activeElement as HTMLElement,
		);
		await user.keyboard("{Escape}");
		await waitFor(() =>
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
		);
		expect(screen.getByRole("button", { name: "owner" })).toHaveFocus();
	});
	it("explains notification availability without an empty clickable menu item", async () => {
		const user = userEvent.setup();
		render(<Notification />);
		await user.click(screen.getByRole("button", { name: "Notifications" }));
		expect(screen.getByRole("menu")).toHaveTextContent(
			"Notifications are not available yet.",
		);
		expect(screen.queryByRole("menuitem")).not.toBeInTheDocument();
		await user.keyboard("{Escape}");
		expect(screen.getByRole("button", { name: "Notifications" })).toHaveFocus();
	});
});

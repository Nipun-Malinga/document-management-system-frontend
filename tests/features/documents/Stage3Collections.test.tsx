import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
	within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
	type AxiosAdapter,
	AxiosError,
	type InternalAxiosRequestConfig,
} from "axios";
import type { ReactNode } from "react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { replaceAccessToken } from "@/features/auth/stores/sessionStore";
import BranchSwitch from "@/features/documents/components/BranchSwitch";
import Collaborators from "@/features/documents/components/collaborators/Collaborators";
import CollectionFilters from "@/features/documents/components/collections/CollectionFilters";
import { documentSorts } from "@/features/documents/components/collections/collectionFilterOptions";
import Templates from "@/features/documents/components/Templates";
import TrashBranchTable from "@/features/documents/components/trash/TrashBranchTable";
import TrashDocumentTable from "@/features/documents/components/trash/TrashDocumentTable";
import MainView from "@/features/documents/layouts/MainView";
import Quick from "@/features/documents/layouts/Quick";
import Shared from "@/features/documents/layouts/Shared";
import type { DocumentParams } from "@/features/documents/types/CollectionParams";
import Branches from "@/features/editor/components/info/branches/Branches";
import Versions from "@/features/editor/components/info/versions/Versions";
import useEditorTemplate from "@/features/editor/stores/useEditorTemplate";
import { axiosInstance } from "@/services/apiService";
import useCollectionParams from "@/shared/hooks/useCollectionParams";
import { requireValue } from "../../assertions";
import { document, tokenFor } from "../../fixtures";
import { pageOf } from "../../pages";

vi.mock("@/components/common/Alert", () => ({
	default: ({ trigger }: { trigger: ReactNode }) => <>{trigger}</>,
}));
vi.mock("@/features/documents/components/DocumentCard", () => ({
	default: ({ document: doc }: { document: { title: string } }) => (
		<p>{doc.title}</p>
	),
}));
vi.mock(
	"@/features/documents/components/collaborators/CollaboratorCard",
	() => ({
		default: ({ collaborator }: { collaborator: { username: string } }) => (
			<p>{collaborator.username}</p>
		),
	}),
);
vi.mock("@/features/editor", () => ({ ContentRenderer: () => <div /> }));
vi.mock("@/components/ui/carousel", () => {
	const Body = ({ children }: { children: ReactNode }) => <div>{children}</div>;
	return {
		Carousel: Body,
		CarouselContent: Body,
		CarouselItem: Body,
		CarouselNext: () => null,
		CarouselPrevious: () => null,
	};
});
vi.mock("@/components/ui/drawer", () => {
	const Body = ({ children }: { children: ReactNode }) => <div>{children}</div>;
	return {
		Drawer: Body,
		DrawerContent: Body,
		DrawerHeader: Body,
		DrawerTitle: Body,
		DrawerDescription: Body,
		DrawerTrigger: Body,
		DrawerFooter: Body,
		DrawerClose: Body,
	};
});
vi.mock("@/features/editor/components/info/branches/BranchCreateForm", () => ({
	default: () => null,
}));
vi.mock("@/features/editor/components/info/versions/VersionCreateForm", () => ({
	default: () => null,
}));
vi.mock("@/features/editor/components/info/branches/BranchCard", () => ({
	default: ({ branch }: { branch: { branchName: string } }) => (
		<p>{branch.branchName}</p>
	),
}));
vi.mock("@/features/editor/components/info/versions/VersionCard", () => ({
	default: ({ version }: { version: { title: string; createdAt: string } }) => (
		<>
			<p>{version.title}</p>
			<p>{version.createdAt}</p>
		</>
	),
}));

const adapter = axiosInstance.defaults.adapter;
let client: QueryClient;
let requests: InternalAxiosRequestConfig[];
const date = "2026-10-10 12:34:56";
const Location = () => (
	<output aria-label="Current route">{useLocation().pathname}</output>
);
const renderCollection = (children: ReactNode) =>
	render(
		<QueryClientProvider client={client}>
			<MemoryRouter initialEntries={["/dashboard/home"]}>
				<Routes>
					<Route path="/dashboard/:documentId" element={children} />
					<Route path="*" element={null} />
				</Routes>
				<Location />
			</MemoryRouter>
		</QueryClientProvider>,
	);
const success = (config: InternalAxiosRequestConfig, data: unknown) => ({
	config,
	data,
	status: 200,
	statusText: "OK",
	headers: {},
});
const itemFor = (url: string, index: number) => {
	const title = `Record ${index + 1}`;
	if (url.endsWith("/templates"))
		return { id: index + 1, title, template: '{"type":"doc","content":[]}' };
	if (url.endsWith("/share/users"))
		return {
			userId: index + 1,
			username: title,
			email: "user@example.com",
			permission: "READ_ONLY",
		};
	if (url === "/documents/trash/branches")
		return {
			id: index + 1,
			added_date: date,
			branch: {
				id: `branch-${index}`,
				documentId: "doc",
				branchName: title,
				trashed: true,
			},
		};
	if (url === "/documents/trash")
		return {
			id: index + 1,
			addedDate: date,
			document: { ...document, id: `doc-${index}`, title, trashed: true },
		};
	if (url.endsWith("/branches"))
		return {
			id: `branch-${index}`,
			documentId: "doc",
			branchName: title,
			trashed: false,
		};
	if (url.endsWith("/versions"))
		return { id: `version-${index}`, title, createdAt: date };
	return { ...document, id: `doc-${index}`, title, favorite: true };
};
const servePages: AxiosAdapter = async (config) => {
	requests.push(config);
	if (config.url === "/documents/folders") return success(config, []);
	const { page, size } = config.params;
	const all = Array.from({ length: 21 }, (_, i) =>
		itemFor(requireValue(config.url), i),
	);
	return success(
		config,
		pageOf(all.slice(page * size, (page + 1) * size), page, all.length, size),
	);
};
beforeEach(() => {
	replaceAccessToken(tokenFor());
	client = new QueryClient({
		defaultOptions: {
			queries: { retry: false, gcTime: 0 },
			mutations: { retry: false },
		},
	});
	requests = [];
	axiosInstance.defaults.adapter = servePages;
	useEditorTemplate.setState({ id: 0, title: "", template: null });
});
afterEach(() => {
	client.clear();
	axiosInstance.defaults.adapter = adapter;
	vi.restoreAllMocks();
});

const lists = [
	["favorites", <Quick key="Quick" />, "/documents"],
	["shared documents", <Shared key="Shared" />, "/documents/share"],
	["templates", <Templates key="Templates" />, "/documents/templates"],
	[
		"collaborators",
		<Collaborators key="Collaborators" documentId="doc" />,
		"/documents/doc/share/users",
	],
	[
		"trashed branches",
		<TrashBranchTable key="TrashBranchTable" />,
		"/documents/trash/branches",
	],
	[
		"trashed documents",
		<TrashDocumentTable key="TrashDocumentTable" />,
		"/documents/trash",
	],
	["branches", <Branches key="Branches" />, "/documents/home/branches"],
	["versions", <Versions key="Versions" />, "/documents/home/versions"],
] as const;

describe("Stage 3 collection flows", () => {
	it.each(lists)(
		"reaches records beyond page one in %s",
		async (label, element, endpoint) => {
			renderCollection(element);
			await screen.findByText("Record 1");
			expect(screen.queryByText("Record 21")).not.toBeInTheDocument();
			const nav = () =>
				screen.getByRole("navigation", { name: `${label} pagination` });
			expect(
				within(nav()).getByText("21 items · Page 1 of 2"),
			).toBeInTheDocument();
			fireEvent.click(within(nav()).getByRole("button", { name: "Next" }));
			await screen.findByText("Record 21");
			expect(screen.queryByText("Record 1")).not.toBeInTheDocument();
			expect(
				within(nav()).getByRole("button", { name: "Next" }),
			).toBeDisabled();
			expect(requests.filter((config) => config.url === endpoint)).toHaveLength(
				2,
			);
			if (label === "favorites")
				expect(
					requests.every((config) => config.params.favorite === true),
				).toBe(true);
			if (label === "collaborators")
				expect(screen.getByText("21")).toBeInTheDocument();
			if (label.startsWith("trashed"))
				expect(screen.getByText(date)).toBeInTheDocument();
			fireEvent.click(within(nav()).getByRole("button", { name: "Previous" }));
			await screen.findByText("Record 1");
		},
	);

	it("renders Home with a page object for templates and pages owned documents independently", async () => {
		renderCollection(<MainView />);
		await screen.findAllByText("Record 1");
		const nav = await screen.findByRole("navigation", {
			name: "documents pagination",
		});
		fireEvent.click(within(nav).getByRole("button", { name: "Next" }));
		await screen.findByText("Record 21");
		expect(
			requests.filter((config) => config.url === "/documents/templates"),
		).toHaveLength(1);
		expect(
			requests.filter((config) => config.url === "/documents").at(-1)?.params
				.page,
		).toBe(1);
	});

	it("keeps navigation available when a later page becomes empty", async () => {
		axiosInstance.defaults.adapter = async (config) =>
			config.params.page === 0
				? servePages(config)
				: success(config, pageOf([], 1, 20));
		renderCollection(<Quick key="Quick" />);
		await screen.findByText("Record 1");
		fireEvent.click(
			within(
				screen.getByRole("navigation", { name: "favorites pagination" }),
			).getByRole("button", { name: "Next" }),
		);
		await screen.findByText(
			"No favorites on this page. Use Previous to return to earlier results.",
		);
		expect(screen.queryByText("No bookmarks yet")).not.toBeInTheDocument();
		fireEvent.click(
			within(
				screen.getByRole("navigation", { name: "favorites pagination" }),
			).getByRole("button", { name: "Previous" }),
		);
		await screen.findByText("Record 1");
	});

	it("switches branches from a dropdown without filters or paging controls", async () => {
		axiosInstance.defaults.adapter = async (config) => {
			requests.push(config);
			const all = Array.from({ length: 51 }, (_, index) =>
				itemFor("/documents/doc/branches", index),
			);
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
		};
		renderCollection(<BranchSwitch documentId="doc" />);
		await userEvent.click(
			await screen.findByRole("button", { name: "Branches: 51" }),
		);
		const menu = screen.getByRole("menu", { name: "Branch selection" });
		expect(within(menu).queryByRole("form")).not.toBeInTheDocument();
		expect(within(menu).queryByRole("navigation")).not.toBeInTheDocument();
		await userEvent.click(
			within(menu).getByRole("menuitem", { name: "Record 51" }),
		);
		expect(screen.getByLabelText("Current route")).toHaveTextContent(
			"/document/doc/branch/branch-50/edit",
		);
		expect(
			screen.queryByRole("menu", { name: "Branch selection" }),
		).not.toBeInTheDocument();
		expect(requests.map((config) => config.params.page)).toEqual([0, 1]);
	});

	it("keeps an incomplete branch list hidden and retries a later-page failure explicitly", async () => {
		let fail = true;
		axiosInstance.defaults.adapter = async (config) => {
			requests.push(config);
			const { page, size } = config.params;
			if (page === 1 && fail)
				throw new AxiosError("Unavailable", undefined, config, undefined, {
					config,
					status: 500,
					statusText: "Error",
					data: { detail: "Branch service unavailable" },
					headers: {},
				});
			const all = Array.from({ length: 51 }, (_, index) =>
				itemFor("/documents/doc/branches", index),
			);
			return success(
				config,
				pageOf(
					all.slice(page * size, (page + 1) * size),
					page,
					all.length,
					size,
				),
			);
		};
		renderCollection(<BranchSwitch documentId="doc" />);
		await userEvent.click(screen.getByRole("button", { name: /^Branches:/ }));
		expect(await screen.findByRole("alert")).toHaveTextContent(
			"Branch service unavailable",
		);
		expect(
			screen.queryByRole("menuitem", { name: "Record 1" }),
		).not.toBeInTheDocument();
		fail = false;
		await userEvent.click(screen.getByRole("menuitem", { name: "Try again" }));
		expect(
			await screen.findByRole("menuitem", { name: "Record 51" }),
		).toBeInTheDocument();
		expect(requests.map((config) => config.params.page)).toEqual([0, 1, 0, 1]);
	});

	it("resets pagination on filter, sorting, and page-size changes and sends filters to the server", async () => {
		renderCollection(<Quick key="Quick" />);
		await screen.findByText("Record 1");
		const nav = () =>
			screen.getByRole("navigation", { name: "favorites pagination" });
		fireEvent.click(within(nav()).getByRole("button", { name: "Next" }));
		await screen.findByText("Record 21");
		fireEvent.change(screen.getByLabelText("Exact title"), {
			target: { value: "Record 21" },
		});
		fireEvent.submit(screen.getByRole("form", { name: "favorites filters" }));
		await waitFor(() =>
			expect(requests.at(-1)?.params).toMatchObject({
				page: 0,
				title: "Record 21",
				favorite: true,
			}),
		);
		await waitFor(() =>
			expect(within(nav()).getByRole("button", { name: "Next" })).toBeEnabled(),
		);
		fireEvent.click(within(nav()).getByRole("button", { name: "Next" }));
		await waitFor(() => expect(requests.at(-1)?.params.page).toBe(1));
		fireEvent.change(screen.getByLabelText("favorites sort"), {
			target: { value: "title,asc" },
		});
		await waitFor(() =>
			expect(requests.at(-1)?.params).toMatchObject({
				page: 0,
				sort: "title,asc",
			}),
		);
		fireEvent.change(screen.getByLabelText("favorites page size"), {
			target: { value: "50" },
		});
		await waitFor(() =>
			expect(requests.at(-1)?.params).toMatchObject({ page: 0, size: 50 }),
		);
		fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
		await waitFor(() => expect(requests.at(-1)?.params.title).toBeUndefined());
		expect(requests.at(-1)?.params.favorite).toBe(true);
	});

	it("clears unapplied filter input and resets parameters when the document scope changes", () => {
		const Harness = ({ id }: { id: string }) => {
			const { params, update, setPage } =
				useCollectionParams<DocumentParams>(id);
			return (
				<>
					<CollectionFilters
						key={id}
						params={params}
						update={update}
						fields={[{ name: "title", label: "Exact title" }]}
						sorts={documentSorts}
						label="test"
					/>
					<button type="button" onClick={() => setPage(4)}>
						Later page
					</button>
					<output>{JSON.stringify(params)}</output>
				</>
			);
		};
		const view = render(<Harness id="a" />);
		fireEvent.change(screen.getByLabelText("Exact title"), {
			target: { value: "Unapplied" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
		expect(screen.getByLabelText("Exact title")).toHaveValue("");
		fireEvent.click(screen.getByRole("button", { name: "Later page" }));
		expect(screen.getByRole("status")).toHaveTextContent('"page":4');
		view.rerender(<Harness id="b" />);
		expect(screen.getByRole("status")).toHaveTextContent('"page":0');
	});

	it("distinguishes loading, forbidden error, retry, and successful empty results", async () => {
		let reject!: (reason: unknown) => void;
		axiosInstance.defaults.adapter = (config) =>
			new Promise((_, fail) => {
				reject = () =>
					fail(
						new AxiosError("Forbidden", undefined, config, undefined, {
							config,
							status: 403,
							statusText: "Forbidden",
							data: { detail: "Forbidden" },
							headers: {},
						}),
					);
			});
		renderCollection(<Shared key="Shared" />);
		expect(screen.getByText("Loading shared documents…")).toBeInTheDocument();
		expect(
			screen.queryByText("Nothing shared with you yet"),
		).not.toBeInTheDocument();
		await waitFor(() => expect(reject).toBeDefined());
		await act(async () => reject(new Error()));
		expect(await screen.findByRole("alert")).toHaveTextContent(
			"You do not have permission to view shared documents.",
		);
		expect(
			screen.queryByText("Nothing shared with you yet"),
		).not.toBeInTheDocument();
		axiosInstance.defaults.adapter = async (config) =>
			success(config, pageOf([]));
		fireEvent.click(screen.getByRole("button", { name: "Try again" }));
		await screen.findByText("Nothing shared with you yet");
		expect(screen.queryByRole("alert")).not.toBeInTheDocument();
	});

	it("shows a ProblemDetail filter error instead of an empty collection", async () => {
		axiosInstance.defaults.adapter = async (config) => {
			throw new AxiosError("Bad request", undefined, config, undefined, {
				config,
				status: 400,
				statusText: "Bad request",
				data: { detail: "Invalid branch ID" },
				headers: {},
			});
		};
		renderCollection(<Templates key="Templates" />);
		expect(await screen.findByRole("alert")).toHaveTextContent(
			"Invalid branch ID",
		);
		expect(
			screen.queryByText("No templates match these filters."),
		).not.toBeInTheDocument();
	});

	it("catches template creation failure, preserves selection state, and permits an explicit successful retry", async () => {
		let fail = true;
		const post = vi.fn();
		axiosInstance.defaults.adapter = async (config) => {
			if (config.method === "post") {
				post(config);
				if (fail)
					throw new AxiosError("Create failed", undefined, config, undefined, {
						config,
						status: 500,
						statusText: "Error",
						data: { detail: "Document creation unavailable" },
						headers: {},
					});
				return success(config, { ...document, id: "created" });
			}
			return servePages(config);
		};
		renderCollection(<Templates key="Templates" />);
		fireEvent.click(
			await screen.findByRole("button", {
				name: "Create document from Record 1",
			}),
		);
		expect(await screen.findByRole("alert")).toHaveTextContent(
			"Document creation unavailable",
		);
		expect(useEditorTemplate.getState().template).toBeNull();
		expect(screen.getByLabelText("Current route")).toHaveTextContent(
			"/dashboard/home",
		);
		fail = false;
		fireEvent.click(
			screen.getByRole("button", { name: "Create document from Record 1" }),
		);
		await waitFor(() =>
			expect(screen.getByLabelText("Current route")).toHaveTextContent(
				"/document/created/branch/main/edit",
			),
		);
		expect(post).toHaveBeenCalledTimes(2);
		expect(useEditorTemplate.getState()).toMatchObject({
			title: "Record 1",
			template: { type: "doc", content: [] },
		});
		expect(JSON.parse(post.mock.calls[1][0].data)).toMatchObject({
			templateId: 1,
		});
	});

	it("disables template creation while a request is pending and sends a single mutation", async () => {
		let finish!: () => void;
		const post = vi.fn();
		axiosInstance.defaults.adapter = async (config) => {
			if (config.method !== "post") return servePages(config);
			post();
			await new Promise<void>((resolve) => {
				finish = resolve;
			});
			return success(config, document);
		};
		renderCollection(<Templates key="Templates" />);
		const button = await screen.findByRole("button", {
			name: "Create document from Record 1",
		});
		fireEvent.click(button);
		fireEvent.click(button);
		await screen.findByText("Creating document…");
		expect(button).toBeDisabled();
		await waitFor(() => expect(post).toHaveBeenCalledTimes(1));
		await act(async () => finish());
		await waitFor(() =>
			expect(screen.getByLabelText("Current route")).toHaveTextContent(
				"/document/doc/branch/main/edit",
			),
		);
	});
});

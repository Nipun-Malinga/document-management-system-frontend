import { transferableAbortController } from "node:util";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type Content, type Editor, EditorContent } from "@tiptap/react";
import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ReactNode } from "react";
import { useState } from "react";
import {
	createMemoryRouter,
	RouterProvider,
	useNavigate,
	useParams,
} from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import UserDropdown from "@/components/common/UserDropdown";
import AutoSaver from "@/features/editor/components/AutoSaver";
import EditorContainer from "@/features/editor/layouts/EditorContainer";
import { actionError } from "@/features/editor/persistence/actionError";
import { usePersistenceRegistry } from "@/features/editor/persistence/persistenceRegistry";
import useShareDocument from "@/hooks/document/collaboration/useShareDocument";
import useCreateBranch from "@/hooks/document/useCreateBranch";
import useCreateVersion from "@/hooks/document/useCreateVersion";
import useMergeBranch from "@/hooks/document/useMergeBranch";
import useMergeVersion from "@/hooks/document/useMergeVersion";
import ContentView from "@/pages/ContentView";
import { axiosInstance } from "@/services/apiService";
import { getSession, replaceAccessToken } from "@/states/sessionStore";
import { requireValue } from "../../../assertions";
import { document, permission, tokenFor } from "../../../fixtures";

const editors = vi.hoisted(() => ({ current: null as Editor | null }));
vi.mock("@/features/editor/components/CoreEditor", () => ({
	default: ({ editor, children }: { editor: Editor; children: ReactNode }) => {
		editors.current = editor;
		return (
			<>
				<AutoSaver />
				<EditorContent
					editor={editor}
					aria-label="Document editor"
					role="textbox"
				/>
				{children}
			</>
		);
	},
}));
vi.mock("@/features/editor/components/Toolbar", () => ({
	default: ({ disabled }: { disabled: boolean }) => (
		<button type="button" disabled={disabled}>
			Format
		</button>
	),
}));
vi.mock("@/features/editor", () => ({
	ContentRenderer: ({ content }: { content: Content }) => (
		<pre data-testid="preview">{JSON.stringify(content)}</pre>
	),
}));

const json = (text: string) =>
	JSON.stringify({
		type: "doc",
		content: [{ type: "paragraph", content: [{ type: "text", text }] }],
	});
let client: QueryClient;
let router: ReturnType<typeof createMemoryRouter>;
let saved: string;
let shared: boolean;
let failSave: boolean;
let failPost: boolean;
let failReload: boolean;
let merged: boolean;
let writeGate: Promise<void> | undefined;
let writeRequests: InternalAxiosRequestConfig[];
const adapter = axiosInstance.defaults.adapter;
const response = (config: InternalAxiosRequestConfig, data: unknown) => ({
	config,
	data,
	status: 200,
	statusText: "OK",
	headers: {},
});
const reject = (config: InternalAxiosRequestConfig) =>
	new AxiosError("Unavailable", undefined, config, undefined, {
		...response(config, { detail: "Service unavailable" }),
		status: 503,
	});

const Actions = () => {
	const { documentId = "doc", branchId = "main" } = useParams();
	const navigate = useNavigate();
	const branch = useMergeBranch(documentId, branchId, "source");
	const version = useMergeVersion(documentId, branchId, "version");
	const snapshotBranch = useCreateBranch(documentId, branchId);
	const snapshotVersion = useCreateVersion(documentId, branchId);
	const share = useShareDocument(documentId);
	const [error, setError] = useState("");
	const run = (promise: Promise<unknown>) => {
		setError("");
		void promise.catch((error: unknown) => setError(actionError(error)));
	};
	return (
		<>
			<button type="button" onClick={() => navigate("/dashboard/home")}>
				Go Home
			</button>
			<button
				type="button"
				onClick={() =>
					navigate(`/document/${documentId}/branch/${branchId}/view`)
				}
			>
				Go Preview
			</button>
			<button
				type="button"
				onClick={() => navigate(`/document/${documentId}/branch/other/edit`)}
			>
				Go Branch
			</button>
			<button type="button" onClick={() => run(branch.mutateAsync())}>
				Merge branch source
			</button>
			<button type="button" onClick={() => run(version.mutateAsync())}>
				Merge version source
			</button>
			<button
				type="button"
				onClick={() =>
					run(snapshotBranch.mutateAsync({ branchName: "snapshot" }))
				}
			>
				Snapshot branch
			</button>
			<button
				type="button"
				onClick={() =>
					run(
						snapshotVersion.mutateAsync({
							title: "snapshot",
							status: "PRIVATE",
						}),
					)
				}
			>
				Snapshot version
			</button>
			<button
				type="button"
				onClick={() =>
					run(share.mutateAsync({ userId: 2, permission: "READ_WRITE" }))
				}
			>
				Share
			</button>
			{error && <p role="alert">{error}</p>}
			<UserDropdown />
		</>
	);
};
const Editing = () => (
	<>
		<EditorContainer />
		<Actions />
	</>
);
const open = async (strict = false) => {
	router = createMemoryRouter(
		[
			{
				path: "/document/:documentId/branch/:branchId/edit",
				element: <Editing />,
			},
			{
				path: "/document/:documentId/branch/:branchId/view",
				element: <ContentView />,
			},
			{
				path: "/document/:documentId/version/:versionId/view",
				element: <ContentView />,
			},
			{ path: "/dashboard/home", element: <p>Home reached</p> },
			{ path: "/auth/signin", element: <p>Signed out</p> },
		],
		{
			initialEntries: ["/dashboard/home", "/document/doc/branch/main/edit"],
			initialIndex: 1,
		},
	);
	const { StrictMode } = await import("react");
	const body = (
		<QueryClientProvider client={client}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	);
	const view = render(strict ? <StrictMode>{body}</StrictMode> : body);
	await waitFor(() => expect(editors.current?.getText()).toBe("Original"));
	await waitFor(() =>
		expect(usePersistenceRegistry.getState().active?.coordinator).toBeTruthy(),
	);
	return view;
};
const edit = (text = "Latest draft") =>
	act(() => {
		requireValue(editors.current).commands.setContent(JSON.parse(json(text)));
	});

beforeEach(() => {
	// React Router creates Node Request objects; jsdom's AbortSignal is a different class.
	vi.stubGlobal("AbortController", transferableAbortController().constructor);
	replaceAccessToken(tokenFor());
	client = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	});
	saved = json("Original");
	shared = false;
	failSave = false;
	failPost = false;
	failReload = false;
	merged = false;
	writeGate = undefined;
	writeRequests = [];
	axiosInstance.defaults.adapter = async (config) => {
		const url = requireValue(config.url);
		if (config.method === "put") {
			writeRequests.push(config);
			await writeGate;
			if (failSave) throw reject(config);
			saved = JSON.parse(config.data).content;
			return response(config, {});
		}
		if (config.method === "post") {
			writeRequests.push(config);
			if (failPost) throw reject(config);
			if (url.includes("/merge/")) {
				saved = json("Replacement");
				merged = true;
			}
			return response(config, {});
		}
		if (url.startsWith("/permissions/"))
			return response(config, {
				...permission,
				branchId: url.split("/").at(-1),
			});
		if (url.endsWith("/content")) {
			if (merged && failReload) throw reject(config);
			return response(config, { content: saved });
		}
		if (url.includes("/versions/version"))
			return response(config, { content: json("Historical snapshot") });
		return response(config, { ...document, shared });
	};
});
afterEach(() => {
	router?.dispose();
	client.clear();
	axiosInstance.defaults.adapter = adapter;
	vi.useRealTimers();
	vi.unstubAllGlobals();
	editors.current = null;
});

describe("Stage 4 editor persistence flows", () => {
	it.each(["Go Home", "Go Preview", "Go Branch"])(
		"saves the latest content before %s",
		async (button) => {
			await open();
			edit();
			fireEvent.click(screen.getByRole("button", { name: button }));
			await waitFor(() =>
				expect(router.state.location.pathname).not.toBe(
					"/document/doc/branch/main/edit",
				),
			);
			expect(writeRequests).toHaveLength(1);
			expect(
				JSON.parse(JSON.parse(writeRequests[0].data).content),
			).toMatchObject(JSON.parse(json("Latest draft")));
			if (button === "Go Preview")
				expect(await screen.findByTestId("preview")).toHaveTextContent(
					"Latest draft",
				);
			if (button === "Go Branch")
				await waitFor(() =>
					expect(editors.current?.getText()).toBe("Latest draft"),
				);
		},
	);

	it("keeps the same editor and dirty content on navigation failure, then retries", async () => {
		await open();
		edit();
		const editor = editors.current;
		failSave = true;
		fireEvent.click(screen.getByRole("button", { name: "Go Home" }));
		await screen.findByRole("button", { name: "Retry saving and leave" });
		expect(router.state.location.pathname).toBe(
			"/document/doc/branch/main/edit",
		);
		expect(editors.current).toBe(editor);
		expect(requireValue(editor).getText()).toBe("Latest draft");
		failSave = false;
		fireEvent.click(
			screen.getByRole("button", { name: "Retry saving and leave" }),
		);
		await screen.findByText("Home reached");
		expect(writeRequests).toHaveLength(2);
	});

	it("blocks browser Back and requires explicit discard after save failure", async () => {
		await open();
		edit();
		failSave = true;
		await act(async () => {
			await router.navigate(-1);
		});
		await screen.findByRole("button", {
			name: "Discard local changes and leave",
		});
		expect(router.state.location.pathname).toBe(
			"/document/doc/branch/main/edit",
		);
		fireEvent.click(screen.getByRole("button", { name: "Stay here" }));
		expect(requireValue(editors.current).getText()).toBe("Latest draft");
		fireEvent.click(screen.getByRole("button", { name: "Go Home" }));
		await screen.findByRole("button", {
			name: "Discard local changes and leave",
		});
		fireEvent.click(
			screen.getByRole("button", { name: "Discard local changes and leave" }),
		);
		await screen.findByText("Home reached");
		expect(saved).toBe(json("Original"));
	});

	it("warns before unload only while unsaved and cleans up the listener", async () => {
		const view = await open(true);
		const clean = new Event("beforeunload", { cancelable: true });
		expect(window.dispatchEvent(clean)).toBe(true);
		edit();
		const dirty = new Event("beforeunload", { cancelable: true });
		expect(window.dispatchEvent(dirty)).toBe(false);
		await act(async () => {
			await requireValue(
				requireValue(usePersistenceRegistry.getState().active).coordinator,
			).flush();
		});
		expect(
			window.dispatchEvent(new Event("beforeunload", { cancelable: true })),
		).toBe(true);
		view.unmount();
		expect(
			window.dispatchEvent(new Event("beforeunload", { cancelable: true })),
		).toBe(true);
	});

	it.each(["Snapshot branch", "Snapshot version"])(
		"flushes before %s and blocks it on save failure",
		async (name) => {
			await open();
			edit();
			failSave = true;
			fireEvent.click(screen.getByRole("button", { name }));
			await waitFor(() => expect(writeRequests).toHaveLength(1));
			await screen.findAllByRole("alert");
			expect(writeRequests[0].method).toBe("put");
			failSave = false;
			fireEvent.click(screen.getByRole("button", { name }));
			await waitFor(() => expect(writeRequests).toHaveLength(3));
			expect(writeRequests.map((request) => request.method)).toEqual([
				"put",
				"put",
				"post",
			]);
			expect(JSON.parse(saved)).toMatchObject(JSON.parse(json("Latest draft")));
			const suffix =
				name === "Snapshot version" ? "/main/versions" : "/branches/main";
			expect(writeRequests[2].url).toContain(suffix);
		},
	);

	it.each(["Merge branch source", "Merge version source"])(
		"writes to the active target and reloads the same editor for %s",
		async (name) => {
			await open();
			edit();
			const editor = editors.current;
			fireEvent.click(screen.getByRole("button", { name }));
			await waitFor(() =>
				expect(requireValue(editors.current).getText()).toBe("Replacement"),
			);
			expect(editors.current).toBe(editor);
			expect(writeRequests.map((request) => request.method)).toEqual([
				"put",
				"post",
			]);
			expect(writeRequests[1].url).toBe(
				`/documents/doc/branches/main/merge/${name === "Merge version source" ? "versions/version" : "source"}`,
			);
			expect(requireValue(editor).isEditable).toBe(true);
			expect(
				requireValue(
					requireValue(usePersistenceRegistry.getState().active).coordinator,
				).dirty,
			).toBe(false);
		},
	);

	it("preserves content on failed merge and never applies replacement", async () => {
		await open();
		edit();
		failPost = true;
		fireEvent.click(
			screen.getByRole("button", { name: "Merge branch source" }),
		);
		await screen.findByText("Service unavailable");
		expect(requireValue(editors.current).getText()).toBe("Latest draft");
		expect(requireValue(editors.current).isEditable).toBe(true);
		expect(writeRequests).toHaveLength(2);
	});

	it("pauses after merge reload failure and retries only the read", async () => {
		await open();
		edit();
		failReload = true;
		fireEvent.click(
			screen.getByRole("button", { name: "Merge branch source" }),
		);
		await screen.findByRole("button", { name: "Retry reload" });
		expect(requireValue(editors.current).getText()).toBe("Latest draft");
		expect(requireValue(editors.current).isEditable).toBe(false);
		failReload = false;
		fireEvent.click(screen.getByRole("button", { name: "Retry reload" }));
		await waitFor(() =>
			expect(requireValue(editors.current).getText()).toBe("Replacement"),
		);
		expect(writeRequests).toHaveLength(2);
		expect(requireValue(editors.current).isEditable).toBe(true);
	});

	it("waits for an in-flight save before logout and retains the session on failure", async () => {
		await open();
		edit();
		const user = userEvent.setup();
		failSave = true;
		await user.click(screen.getByRole("button", { name: "owner" }));
		await user.click(screen.getByRole("menuitem", { name: "Log out" }));
		await screen.findByRole("button", { name: "Retry save and logout" });
		expect(getSession().status).toBe("authenticated");
		expect(requireValue(editors.current).getText()).toBe("Latest draft");
		let finish!: () => void;
		writeGate = new Promise<void>((resolve) => {
			finish = resolve;
		});
		failSave = false;
		fireEvent.click(
			screen.getByRole("button", { name: "Retry save and logout" }),
		);
		await waitFor(() => expect(writeRequests).toHaveLength(2));
		expect(getSession().status).toBe("authenticated");
		await act(async () => {
			finish();
		});
		await screen.findByText("Signed out");
		expect(getSession().status).toBe("signedOut");
	});

	it("previews version content from its own endpoint and exposes failed preview retry", async () => {
		await open();
		edit();
		const previous = axiosInstance.defaults.adapter;
		let failed = true;
		const urls: string[] = [];
		axiosInstance.defaults.adapter = async (config) => {
			urls.push(requireValue(config.url));
			if (failed && config.url === "/documents/doc/versions/version")
				throw reject(config);
			return (previous as import("axios").AxiosAdapter)(config);
		};
		await act(async () => {
			await router.navigate("/document/doc/version/version/view");
		});
		await screen.findByRole("button", { name: "Retry preview" });
		expect(screen.queryByTestId("preview")).not.toBeInTheDocument();
		failed = false;
		fireEvent.click(screen.getByRole("button", { name: "Retry preview" }));
		expect(await screen.findByTestId("preview")).toHaveTextContent(
			"Historical snapshot",
		);
		expect(
			urls.filter((url) => url === "/documents/doc/versions/version"),
		).toHaveLength(2);
		expect(urls).not.toContain("/documents/doc/branches//content");
	});

	it("preserves a mounted solo editor and pauses editing when sharing metadata changes", async () => {
		await open();
		edit();
		const editor = editors.current;
		shared = true;
		await act(async () => {
			await client.invalidateQueries({ queryKey: ["document", "doc"] });
		});
		await screen.findByText(/Sharing changed while this solo editor was open/);
		expect(editors.current).toBe(editor);
		expect(requireValue(editor).getText()).toBe("Latest draft");
		expect(requireValue(editor).isEditable).toBe(false);
		expect(usePersistenceRegistry.getState().active?.mode).toBe("solo");
		expect(writeRequests).toHaveLength(0);
	});

	it("flushes but blocks first share without switching editor mode", async () => {
		await open();
		edit();
		const editor = editors.current;
		fireEvent.click(screen.getByRole("button", { name: "Share" }));
		await screen.findByText(
			"First sharing is paused until collaborative room initialization from saved content is verified.",
		);
		expect(writeRequests.map((request) => request.method)).toEqual(["put"]);
		expect(editors.current).toBe(editor);
		expect(JSON.parse(saved)).toMatchObject(JSON.parse(json("Latest draft")));
	});
});

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	act,
	render,
	renderHook,
	screen,
	waitFor,
	within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { replaceAccessToken } from "@/features/auth/stores/sessionStore";
import DocumentCard from "@/features/documents/components/DocumentCard";
import FolderDialog from "@/features/documents/components/folders/FolderDialog";
import {
	useFolderDocuments,
	useFolderMutation,
	useFolders,
} from "@/features/documents/hooks/useFolders";
import MainView from "@/features/documents/layouts/MainView";
import type { Folder } from "@/features/documents/types/Folder";
import {
	descendantIds,
	folderPath,
} from "@/features/documents/utils/folderTree";
import { axiosInstance } from "@/services/apiService";
import { document, tokenFor } from "../../fixtures";

vi.mock("@/features/documents/components/Templates", () => ({
	default: () => <p>Templates</p>,
}));

const ROOT = "00000000-0000-0000-0000-000000000001";
const CHILD = "00000000-0000-0000-0000-000000000002";
const ARCHIVE = "00000000-0000-0000-0000-000000000003";
const UNFILED = "10000000-0000-0000-0000-000000000000";
const FILED = "10000000-0000-0000-0000-000000000001";
const folders: Folder[] = [
	{ id: ROOT, parentFolderId: null, name: "Projects", createdAt: "2026-10-19" },
	{
		id: CHILD,
		parentFolderId: ROOT,
		name: "Planning",
		createdAt: "2026-10-19",
	},
	{
		id: ARCHIVE,
		parentFolderId: null,
		name: "Archive",
		createdAt: "2026-10-19",
	},
];

it("builds nested paths and excludes the whole subtree from move destinations, even with cyclic input", () => {
	expect(folderPath(folders, CHILD).map((item) => item.name)).toEqual([
		"Projects",
		"Planning",
	]);
	expect([...descendantIds(folders, ROOT)]).toEqual([ROOT, CHILD]);
	const cyclic = [{ ...folders[0], parentFolderId: CHILD }, folders[1]];
	expect(folderPath(cyclic, CHILD)).toHaveLength(2);
	expect(descendantIds(cyclic, ROOT).size).toBe(2);
});

const baseURL = process.env.DMS_FOLDERS_URL;
const originalBaseURL = axiosInstance.defaults.baseURL;
let client: QueryClient;
const wrapper = ({ children }: { children: ReactNode }) => (
	<QueryClientProvider client={client}>
		<MemoryRouter>{children}</MemoryRouter>
	</QueryClientProvider>
);
const state = async () =>
	(await fetch(`${baseURL}/__state`)).json() as Promise<{
		folders: Folder[];
		documents: { id: string; title: string }[];
		membership: Record<string, string>;
	}>;
const scenario = async (failMutation: boolean) =>
	fetch(`${baseURL}/__scenario`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ failMutation }),
	});
const choose = async (label: string) => {
	const user = userEvent.setup();
	await user.click(screen.getByRole("combobox", { name: "Destination" }));
	await user.keyboard("{ArrowDown}");
	await user.click(await screen.findByRole("option", { name: label }));
};

describe.skipIf(!baseURL)(
	"folders over HTTP against the Postman simulation",
	() => {
		beforeEach(async () => {
			client = new QueryClient({
				defaultOptions: {
					queries: { retry: false, gcTime: 0 },
					mutations: { retry: false },
				},
			});
			await fetch(`${baseURL}/__reset`, { method: "POST" });
			axiosInstance.defaults.baseURL = `${baseURL}/api`;
			replaceAccessToken(tokenFor());
			// Radix Select uses browser APIs that jsdom does not implement.
			Element.prototype.scrollIntoView = vi.fn();
			Element.prototype.hasPointerCapture = vi.fn(() => false);
			Element.prototype.setPointerCapture = vi.fn();
			Element.prototype.releasePointerCapture = vi.fn();
		});
		afterEach(() => {
			client.clear();
			axiosInstance.defaults.baseURL = originalBaseURL;
			vi.restoreAllMocks();
		});

		it("places folders below Templates, navigates nested documents, and preserves unfiled documents in All documents", async () => {
			render(<MainView />, { wrapper });
			const heading = await screen.findByRole("heading", { name: "Folders" });
			expect(
				screen.getByText("Templates").compareDocumentPosition(heading) &
					Node.DOCUMENT_POSITION_FOLLOWING,
			).toBeTruthy();
			await screen.findByRole("heading", { name: "Unfiled document" });
			await userEvent.click(screen.getByRole("button", { name: "Projects" }));
			await screen.findByRole("heading", { name: "Project document" });
			expect(
				screen.queryByRole("heading", { name: "Unfiled document" }),
			).not.toBeInTheDocument();
			await userEvent.click(screen.getByRole("button", { name: "Planning" }));
			await screen.findByRole("heading", { name: "Nested document" });
			expect(screen.getByRole("button", { name: "Planning" })).toHaveAttribute(
				"aria-current",
				"page",
			);
			await userEvent.click(
				screen.getByRole("button", { name: "All documents" }),
			);
			await screen.findByRole("heading", { name: "Unfiled document" });
			expect(
				screen.getByRole("heading", { name: "Project document" }),
			).toBeVisible();
		});

		it("creates and renames nested folders, preserving input after a failed mutation for explicit retry", async () => {
			render(<MainView />, { wrapper });
			await userEvent.click(
				await screen.findByRole("button", { name: "Projects" }),
			);
			await userEvent.click(screen.getByRole("button", { name: "New folder" }));
			await userEvent.type(screen.getByLabelText("Folder name"), "Research");
			await scenario(true);
			await userEvent.click(
				screen.getByRole("button", { name: "Save folder" }),
			);
			expect(await screen.findByRole("alert")).toHaveTextContent(
				"Folder service unavailable",
			);
			expect(screen.getByLabelText("Folder name")).toHaveValue("Research");
			await scenario(false);
			await userEvent.click(
				screen.getByRole("button", { name: "Save folder" }),
			);
			await screen.findByRole("button", { name: "Research" });
			expect(
				(await state()).folders.find((folder) => folder.name === "Research")
					?.parentFolderId,
			).toBe(ROOT);
			await userEvent.click(
				screen.getByRole("button", { name: "Actions for folder Research" }),
			);
			await userEvent.click(screen.getByRole("menuitem", { name: "Rename" }));
			await userEvent.clear(screen.getByLabelText("Folder name"));
			await userEvent.type(screen.getByLabelText("Folder name"), "Reference");
			await userEvent.click(
				screen.getByRole("button", { name: "Save folder" }),
			);
			await screen.findByRole("button", { name: "Reference" });
		});

		it("prevents cyclic destinations and moves a nested folder to root using a null parent", async () => {
			const view = render(
				<FolderDialog
					action={{ type: "move", folder: folders[0] }}
					folders={folders}
					onClose={vi.fn()}
					onDeleted={vi.fn()}
				/>,
				{ wrapper },
			);
			await userEvent.click(
				screen.getByRole("combobox", { name: "Destination" }),
			);
			await userEvent.keyboard("{ArrowDown}");
			expect(
				screen.queryByRole("option", { name: "Projects" }),
			).not.toBeInTheDocument();
			expect(
				screen.queryByRole("option", { name: "Projects / Planning" }),
			).not.toBeInTheDocument();
			await userEvent.keyboard("{Escape}");
			view.unmount();
			const closed = vi.fn();
			render(
				<FolderDialog
					action={{ type: "move", folder: folders[1] }}
					folders={folders}
					onClose={closed}
					onDeleted={vi.fn()}
				/>,
				{ wrapper },
			);
			await choose("Root / No folder");
			await userEvent.click(
				screen.getByRole("button", { name: "Move folder" }),
			);
			await waitFor(() => expect(closed).toHaveBeenCalled());
			expect(
				(await state()).folders.find((folder) => folder.id === CHILD)
					?.parentFolderId,
			).toBeNull();
		});

		it("assigns an unfiled document, moves it between folders, and removes it without deleting the document", async () => {
			const { result } = renderHook(
				() => ({
					mutation: useFolderMutation(),
					folders: useFolders(),
					source: useFolderDocuments(ROOT, {}),
					target: useFolderDocuments(ARCHIVE, {}),
				}),
				{ wrapper },
			);
			await waitFor(() =>
				expect(
					result.current.source.isSuccess && result.current.target.isSuccess,
				).toBe(true),
			);
			await act(async () => {
				await result.current.mutation.mutateAsync({
					type: "create",
					parentFolderId: null,
					name: "New root",
				});
			});
			await waitFor(() =>
				expect(
					result.current.folders.data?.some(
						(folder) => folder.name === "New root",
					),
				).toBe(true),
			);
			await act(async () => {
				await result.current.mutation.mutateAsync({
					type: "assignDocument",
					documentId: UNFILED,
					folderId: ROOT,
				});
			});
			await waitFor(() =>
				expect(
					result.current.source.data?.content.some(
						(item) => item.id === UNFILED,
					),
				).toBe(true),
			);
			await act(async () => {
				await result.current.mutation.mutateAsync({
					type: "moveDocument",
					documentId: UNFILED,
					folderId: ROOT,
					targetFolderId: ARCHIVE,
				});
			});
			await waitFor(() =>
				expect(
					result.current.source.data?.content.some(
						(item) => item.id === UNFILED,
					),
				).toBe(false),
			);
			await waitFor(() =>
				expect(
					result.current.target.data?.content.some(
						(item) => item.id === UNFILED,
					),
				).toBe(true),
			);
			await act(async () => {
				await result.current.mutation.mutateAsync({
					type: "removeDocument",
					documentId: UNFILED,
					folderId: ARCHIVE,
				});
			});
			expect(
				(await state()).documents.some((item) => item.id === UNFILED),
			).toBe(true);
			expect((await state()).membership[UNFILED]).toBeUndefined();
		});

		it("provides owner-only document folder actions and removes from the current folder through the UI", async () => {
			const view = render(
				<DocumentCard document={{ ...document, ownerId: 2 }} folderId={ROOT} />,
				{ wrapper },
			);
			expect(
				screen.queryByRole("button", { name: "Folder actions for Document" }),
			).not.toBeInTheDocument();
			view.unmount();
			render(
				<DocumentCard document={{ ...document, id: FILED }} folderId={ROOT} />,
				{ wrapper },
			);
			await userEvent.click(
				screen.getByRole("button", { name: "Folder actions for Document" }),
			);
			await userEvent.click(
				screen.getByRole("menuitem", { name: "Move to folder" }),
			);
			await screen.findByRole("combobox", { name: "Destination" });
			await choose("Root / No folder");
			await userEvent.click(
				screen.getByRole("button", { name: "Remove from folder" }),
			);
			await waitFor(() =>
				expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
			);
			expect((await state()).membership[FILED]).toBeUndefined();
			expect((await state()).documents.some((item) => item.id === FILED)).toBe(
				true,
			);
		});

		it("requires confirmation before deleting a subtree and refreshes documents while evicting deleted content", async () => {
			render(<MainView />, { wrapper });
			await screen.findByRole("heading", { name: "Nested document" });
			client.setQueryData(["branch-content", FILED, "main"], "deleted content");
			const open = async () => {
				await userEvent.click(
					screen.getByRole("button", { name: "Actions for folder Projects" }),
				);
				await userEvent.click(
					screen.getByRole("menuitem", { name: "Delete permanently" }),
				);
			};
			await open();
			expect(screen.getByRole("alertdialog")).toHaveTextContent(
				"They will not go to Trash",
			);
			await userEvent.click(
				within(screen.getByRole("alertdialog")).getByRole("button", {
					name: "Cancel",
				}),
			);
			expect((await state()).documents).toHaveLength(3);
			await open();
			await userEvent.click(
				within(screen.getByRole("alertdialog")).getByRole("button", {
					name: "Delete permanently",
				}),
			);
			await waitFor(() =>
				expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument(),
			);
			expect((await state()).folders.map((folder) => folder.id)).toEqual([
				ARCHIVE,
			]);
			expect((await state()).documents.map((item) => item.id)).toEqual([
				UNFILED,
			]);
			expect(
				screen.queryByRole("heading", { name: "Nested document" }),
			).not.toBeInTheDocument();
			expect(
				client.getQueryData(["branch-content", FILED, "main"]),
			).toBeUndefined();
		});
	},
);

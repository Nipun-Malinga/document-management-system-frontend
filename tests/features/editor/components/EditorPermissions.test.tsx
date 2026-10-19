import type { HocuspocusProvider } from "@hocuspocus/provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Extension } from "@tiptap/core";
import { type Editor, EditorContent } from "@tiptap/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Doc } from "yjs";
import { initializeSession } from "@/features/auth/stores/sessionStore";
import AutoSaver from "@/features/editor/components/AutoSaver";
import CollaborativeEditorCore from "@/features/editor/components/CollaborativeEditorCore";
import SoloEditorCore from "@/features/editor/components/SoloEditorCore";
import useSoloPersistence from "@/features/editor/persistence/useSoloPersistence";
import APIService from "@/services/apiService";
import { requireValue } from "../../../assertions";
import { tokenFor } from "../../../fixtures";

const state = vi.hoisted(() => ({
	editor: null as Editor | null,
	provider: null as HocuspocusProvider | null,
}));

vi.mock("@/features/editor/components/CoreEditor", () => ({
	default: ({
		editor,
		enableAutoSaver,
		children,
	}: {
		editor: Editor;
		enableAutoSaver: boolean;
		children: ReactNode;
	}) => {
		state.editor = editor;
		return (
			<div data-testid="core" data-autosave={enableAutoSaver}>
				<EditorContent editor={editor} />
				{children}
			</div>
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
vi.mock("@/features/editor/hooks", () => ({
	useProvider: () => state.provider,
}));
vi.mock("@tiptap/extension-collaboration-caret", () => ({
	CollaborationCaret: {
		configure: () => Extension.create({ name: "testCaret" }),
	},
}));

beforeEach(() => {
	localStorage.setItem("jwt-access-token", tokenFor());
	initializeSession();
});
afterEach(() => {
	vi.useRealTimers();
	vi.restoreAllMocks();
	state.editor = null;
	state.provider = null;
});

describe("editor permission changes", () => {
	it("updates solo editability and autosave without recreating content", () => {
		const props = {
			documentId: "doc",
			branchId: "main",
			content: "<p>Preserved text</p>",
		};
		const client = new QueryClient();
		const wrap = ({ children }: { children: ReactNode }) => (
			<QueryClientProvider client={client}>{children}</QueryClientProvider>
		);
		const { rerender, unmount } = render(
			<SoloEditorCore {...props} editable />,
			{ wrapper: wrap },
		);
		const editor = requireValue(state.editor);
		expect(editor.isEditable).toBe(true);
		expect(screen.getByTestId("core")).toHaveAttribute("data-autosave", "true");
		rerender(<SoloEditorCore {...props} editable={false} />);
		expect(state.editor).toBe(editor);
		expect(editor.isEditable).toBe(false);
		expect(editor.getText()).toBe("Preserved text");
		expect(screen.getByRole("button", { name: "Format" })).toBeDisabled();
		expect(screen.getByTestId("core")).toHaveAttribute("data-autosave", "true");
		rerender(<SoloEditorCore {...props} editable />);
		expect(editor.isEditable).toBe(true);
		unmount();
		client.clear();
	});

	it("updates collaborative editability with the same Y.Doc and no REST autosave", () => {
		const ydoc = new Doc();
		state.provider = {
			document: ydoc,
			on: vi.fn(),
			off: vi.fn(),
		} as unknown as HocuspocusProvider;
		const props = { documentId: "doc", branchId: "main" };
		const { rerender, unmount } = render(
			<CollaborativeEditorCore {...props} editable />,
		);
		const editor = requireValue(state.editor);
		expect(editor.isEditable).toBe(true);
		rerender(<CollaborativeEditorCore {...props} editable={false} />);
		expect(state.editor).toBe(editor);
		expect(editor.isEditable).toBe(false);
		expect(screen.getByRole("button", { name: "Format" })).toBeDisabled();
		expect(screen.getByTestId("core")).toHaveAttribute(
			"data-autosave",
			"false",
		);
		rerender(<CollaborativeEditorCore {...props} editable />);
		expect(editor.isEditable).toBe(true);
		expect(screen.getByTestId("core")).toHaveAttribute(
			"data-autosave",
			"false",
		);
		unmount();
		ydoc.destroy();
	});

	it("pauses edits after collaboration authentication fails and retries with the same document", () => {
		const ydoc = new Doc();
		const on = vi.fn<(event: string, callback: () => void) => void>();
		const off = vi.fn();
		const connect = vi.fn(async () => {});
		const socket = { shouldConnect: false };
		state.provider = {
			document: ydoc,
			on,
			off,
			connect,
			configuration: { websocketProvider: socket },
		} as unknown as HocuspocusProvider;
		const { unmount } = render(
			<CollaborativeEditorCore documentId="doc" branchId="main" editable />,
		);
		const editor = requireValue(state.editor);
		const failed = requireValue(
			on.mock.calls.find(([event]) => event === "authenticationFailed"),
		)[1];
		const authenticated = requireValue(
			on.mock.calls.find(([event]) => event === "authenticated"),
		)[1];
		act(() => failed());
		expect(editor.isEditable).toBe(false);
		expect(screen.getByRole("alert")).toHaveTextContent("Editing is paused");
		fireEvent.click(screen.getByRole("button", { name: "Retry connection" }));
		expect(socket.shouldConnect).toBe(true);
		expect(connect).toHaveBeenCalledOnce();
		act(() => authenticated());
		expect(editor.isEditable).toBe(true);
		expect(state.editor).toBe(editor);
		expect(screen.queryByRole("alert")).not.toBeInTheDocument();
		unmount();
		expect(off).toHaveBeenCalledWith("authenticationFailed", failed);
		expect(off).toHaveBeenCalledWith("authenticated", authenticated);
		ydoc.destroy();
	});

	it("reports collaboration disconnection and recovers its status without REST autosaving", () => {
		const ydoc = new Doc();
		const on =
			vi.fn<
				(
					event: string,
					callback: (data: {
						status: "connecting" | "connected" | "disconnected";
					}) => void,
				) => void
			>();
		const off = vi.fn();
		state.provider = {
			document: ydoc,
			on,
			off,
		} as unknown as HocuspocusProvider;
		const { unmount } = render(
			<CollaborativeEditorCore documentId="doc" branchId="main" editable />,
		);
		const status = requireValue(
			on.mock.calls.find(([event]) => event === "status"),
		)[1];
		act(() => status({ status: "disconnected" }));
		expect(screen.getByRole("status")).toHaveTextContent(
			"server persistence is not confirmed",
		);
		act(() => status({ status: "connected" }));
		expect(screen.queryByRole("status")).not.toBeInTheDocument();
		expect(screen.getByTestId("core")).toHaveAttribute(
			"data-autosave",
			"false",
		);
		unmount();
		expect(off).toHaveBeenCalledWith("status", status);
		ydoc.destroy();
	});

	it("writes only dirty content at 30 seconds and stops after permission loss or unmount", async () => {
		vi.useFakeTimers();
		const put = vi.spyOn(APIService.prototype, "put").mockResolvedValue({});
		const client = new QueryClient();
		const { Editor: TiptapEditor } = await import("@tiptap/react");
		const { default: StarterKit } = await import("@tiptap/starter-kit");
		const editor = new TiptapEditor({
			extensions: [StarterKit],
			content: "<p>Text</p>",
		});
		const Persistence = () => {
			useSoloPersistence(editor, "doc", "main", true);
			return <AutoSaver />;
		};
		const { unmount } = render(
			<QueryClientProvider client={client}>
				<Persistence />
			</QueryClientProvider>,
		);
		await act(async () => {
			await vi.advanceTimersByTimeAsync(30000);
		});
		expect(put).not.toHaveBeenCalled();
		act(() => {
			editor.commands.setContent("<p>Changed</p>");
		});
		await act(async () => {
			await vi.advanceTimersByTimeAsync(30000);
		});
		expect(put).toHaveBeenCalledTimes(1);
		await act(async () => {
			await vi.advanceTimersByTimeAsync(30000);
		});
		expect(put).toHaveBeenCalledTimes(1);
		act(() => {
			editor.commands.setContent("<p>Pending</p>");
			editor.setEditable(false, false);
		});
		await act(async () => {
			await vi.advanceTimersByTimeAsync(30000);
		});
		expect(put).toHaveBeenCalledTimes(1);
		unmount();
		await act(async () => {
			await vi.advanceTimersByTimeAsync(30000);
		});
		expect(put).toHaveBeenCalledTimes(1);
		editor.destroy();
		client.clear();
	});
});

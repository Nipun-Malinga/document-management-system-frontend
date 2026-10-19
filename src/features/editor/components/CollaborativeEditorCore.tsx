import type { HocuspocusProvider } from "@hocuspocus/provider";
import Collaboration from "@tiptap/extension-collaboration";
import { CollaborationCaret } from "@tiptap/extension-collaboration-caret";
import { useEditor } from "@tiptap/react";
import { useEffect, useMemo, useState } from "react";
import Button from "@/components/common/Button";
import { useUser } from "@/features/auth/hooks";
import { getSession } from "@/features/auth/stores/sessionStore";
// import { IndexeddbPersistence } from 'y-indexeddb';
import { useProvider } from "@/features/editor/hooks";
import {
	commonEditorConfigs,
	editorExtensions,
} from "../configs/EditorConfigs";
import { registerPersistence } from "../persistence/persistenceRegistry";
import CoreEditor from "./CoreEditor";
import Toolbar from "./Toolbar";

interface Props {
	documentId: string;
	branchId: string;
	editable: boolean;
}

interface EditorProps extends Props {
	provider: HocuspocusProvider;
}

const CollaborativeEditorCore = (props: Props) => {
	const documentKey = `documents/${props.documentId}/branches/${props.branchId}`;
	const provider = useProvider(documentKey);

	if (!provider) return <p>Preparing collaborative editor…</p>;

	return (
		<CollaborativeEditor
			key={provider.document.guid}
			{...props}
			provider={provider}
		/>
	);
};

const CollaborativeEditor = ({
	documentId,
	branchId,
	editable,
	provider,
}: EditorProps) => {
	const user = useUser();
	useEffect(
		() =>
			registerPersistence({
				documentId,
				branchId,
				epoch: getSession().epoch,
				mode: "collaborative",
				coordinator: null,
			}),
		[documentId, branchId],
	);
	const [authenticationFailed, setAuthenticationFailed] = useState(false);
	const [contentError, setContentError] = useState(false);
	const [connectionStatus, setConnectionStatus] = useState<
		"connecting" | "connected" | "disconnected"
	>(provider.configuration?.websocketProvider?.status ?? "connecting");
	const canEdit = editable && !authenticationFailed && !contentError;
	useEffect(() => {
		const failed = () => setAuthenticationFailed(true);
		const authenticated = () => setAuthenticationFailed(false);
		const status = ({
			status,
		}: {
			status: "connecting" | "connected" | "disconnected";
		}) => setConnectionStatus(status);
		provider.on("authenticationFailed", failed);
		provider.on("authenticated", authenticated);
		provider.on("status", status);
		return () => {
			provider.off("authenticationFailed", failed);
			provider.off("authenticated", authenticated);
			provider.off("status", status);
		};
	}, [provider]);

	// Generate a random color for the user
	const currentUser = useMemo(
		() => ({
			name: user?.username || "Anonymous",
			color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
		}),
		[user?.username],
	);

	const editor = useEditor({
		extensions: [
			...editorExtensions(true),
			Collaboration.configure({
				document: provider.document,
			}),
			CollaborationCaret.configure({
				provider: provider,
				user: currentUser,
			}),
		],
		editable: canEdit,
		enableContentCheck: true,
		...commonEditorConfigs,
		onContentError: ({ disableCollaboration }) => {
			disableCollaboration();
			setContentError(true);
		},
	});

	useEffect(() => {
		editor.setEditable(canEdit);
	}, [editor, canEdit]);

	return (
		<CoreEditor
			enableAutoSaver={false}
			editor={editor}
			documentId={documentId}
			branchId={branchId}
		>
			{contentError && (
				<p role="alert">
					Collaborative content is incompatible with this editor. Editing is
					paused; reload after the content or editor configuration has been
					repaired.
				</p>
			)}
			{!authenticationFailed && connectionStatus !== "connected" && (
				<p>
					{connectionStatus === "disconnected"
						? "Collaboration is disconnected. Keep this editor open while it reconnects; server persistence is not confirmed."
						: "Connecting to collaboration… Server persistence is not confirmed."}
				</p>
			)}
			{authenticationFailed && (
				<div role="alert">
					<p>
						Unable to authenticate collaboration. Editing is paused; your local
						document is preserved.
					</p>
					<Button
						title="Retry connection"
						onClick={() => {
							provider.configuration.websocketProvider.shouldConnect = true;
							void provider.connect().catch(() => {});
						}}
					/>
				</div>
			)}
			<Toolbar
				editor={editor}
				canRedo={false}
				canUndo={false}
				disabled={!canEdit}
			/>
		</CoreEditor>
	);
};

export default CollaborativeEditorCore;

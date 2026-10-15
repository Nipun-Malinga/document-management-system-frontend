import UploadFeedback from "./UploadFeedback";
import "../styles/styles.scss";

import { type Editor, EditorContent, EditorContext } from "@tiptap/react";
import { type ReactNode, useMemo } from "react";
import { useDocument } from "@/hooks/document";
import TopToolBar from "./TopToolBar";

interface Props {
	enableAutoSaver: boolean;
	editor: Editor;
	documentId: string;
	branchId: string;
	children?: ReactNode;
}

const CoreEditor = ({
	enableAutoSaver,
	editor,
	documentId,
	branchId,
	children,
}: Props) => {
	const providerValue = useMemo(() => ({ editor }), [editor]);
	const { data } = useDocument(documentId);

	return (
		<EditorContext.Provider value={providerValue}>
			<div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background text-foreground">
				<TopToolBar
					documentTitle={data?.title ?? "Untitled Document"}
					enableAutoSaver={enableAutoSaver}
					documentId={documentId}
					branchId={branchId}
				/>

				<UploadFeedback editor={editor} />

				{children && (
					<div className="shrink-0 bg-card [&>[role=alert]]:px-4 [&>[role=alert]]:py-3 [&>[role=alert]]:text-sm [&>[role=alert]]:text-destructive [&>[role=status]]:px-4 [&>[role=status]]:py-3 [&>[role=status]]:text-sm [&>[role=status]]:text-muted-foreground">
						{children}
					</div>
				)}

				<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-gutter:stable]">
					<div className="mx-auto w-full max-w-4xl px-3 py-5 sm:px-6 sm:py-8 lg:py-10">
						<div className="rounded-xl border border-border bg-card text-card-foreground">
							<EditorContent
								editor={editor}
								role="textbox"
								aria-label="Document editor"
								className="editor-document px-5 py-8 sm:px-10 sm:py-12 lg:px-16 lg:py-16"
							/>
						</div>
					</div>
				</div>
			</div>
		</EditorContext.Provider>
	);
};

export default CoreEditor;

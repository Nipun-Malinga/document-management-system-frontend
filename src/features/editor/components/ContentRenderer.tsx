import type { Content } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { editorExtensions } from "../configs/EditorConfigs";
import "../styles/styles.scss";

interface Props {
	content: Content;
	type?: "primary" | "secondary";
}

const ContentRenderer = ({ content, type = "primary" }: Props) => {
	const editor = useEditor({
		extensions: [...editorExtensions(false)],
		content,
		editable: false,
	});

	if (type === "primary") {
		return (
			<div className="mx-auto w-full max-w-4xl px-3 py-5 sm:px-6 sm:py-8 lg:py-12">
				<div className="editor-sheet rounded-lg border bg-card text-card-foreground">
					<EditorContent
						editor={editor}
						className="editor-document px-5 py-8 sm:px-12 sm:py-14 lg:px-20 lg:py-20"
					/>
				</div>
			</div>
		);
	} else {
		const SCALE = 0.35;

		return (
			<div
				className="origin-top-left p-8.5"
				style={{
					transform: `scale(${SCALE})`,
					width: `${95 / SCALE}%`,
				}}
			>
				<EditorContent editor={editor} />
			</div>
		);
	}
};

export default ContentRenderer;

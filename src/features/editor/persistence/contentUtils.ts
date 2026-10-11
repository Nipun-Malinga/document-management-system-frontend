import type { JSONContent } from "@tiptap/core";

// Replacement must never silently convert an invalid server response to an empty document.
export const parseEditorContent = (content: string): JSONContent => {
	const parsed: unknown = JSON.parse(content);
	if (
		!parsed ||
		typeof parsed !== "object" ||
		!("type" in parsed) ||
		parsed.type !== "doc"
	) {
		throw new Error("The server returned invalid document content.");
	}
	return parsed as JSONContent;
};

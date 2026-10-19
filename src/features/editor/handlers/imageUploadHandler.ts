import type { Editor } from "@tiptap/react";
import { assertSession, getSession } from "@/features/auth/stores/sessionStore";
import type { FileUpload } from "@/features/editor/types/FileUpload";
import APIService from "@/services/apiService";
import { actionError } from "../persistence/actionError";
import { reportUpload } from "./uploadFeedback";

export const imageMimeTypes = ["image/png", "image/jpeg"];
export const imageUploadHandler = async (file: File): Promise<string> => {
	if (!imageMimeTypes.includes(file.type))
		throw new Error("Only PNG and JPEG images are supported.");
	const formData = new FormData();
	formData.append("file", file);
	const response = await new APIService<FormData, FileUpload>(
		"/files/images",
	).post(formData);
	if (
		typeof response?.fileCloudUrl !== "string" ||
		!response.fileCloudUrl.trim()
	)
		throw new Error("The upload returned no image URL. Try uploading again.");
	const url = new URL(response.fileCloudUrl);
	if (!["https:", "http:"].includes(url.protocol))
		throw new Error(
			"The upload returned an invalid image URL. Try uploading again.",
		);
	return url.href;
};

export const insertUploadedImages = async (
	editor: Editor,
	files: File[],
	position: number,
) => {
	const epoch = getSession().epoch;
	const writable = () =>
		!editor.isDestroyed &&
		editor.isEditable &&
		getSession().epoch === epoch &&
		getSession().status === "authenticated";
	if (!writable()) return;
	reportUpload(editor, "");
	for (const file of files) {
		if (!writable()) return;
		try {
			const url = await imageUploadHandler(file);
			assertSession(epoch);
			if (!writable()) return;
			const pos = Math.min(
				Math.max(0, position),
				editor.state.doc.content.size,
			);
			editor
				.chain()
				.insertContentAt(pos, { type: "image", attrs: { src: url } })
				.run();
			position = pos + 1;
		} catch (error) {
			if (getSession().epoch === epoch)
				reportUpload(
					editor,
					`Image upload failed. ${actionError(error)} Choose the file again to retry.`,
				);
		}
	}
};

import { Extension } from "@tiptap/core";
import FileHandler from "@tiptap/extension-file-handler";
import Image from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { Plugin } from "@tiptap/pm/state";
import type { AnyExtension, UseEditorOptions } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	imageMimeTypes,
	insertUploadedImages,
} from "../handlers/imageUploadHandler";
import { reportUpload } from "../handlers/uploadFeedback";

export const editorExtensions = (collaborative = false): AnyExtension[] => {
	const baseExtensions: AnyExtension[] = [
		StarterKit.configure({
			heading: {
				levels: [1, 2, 3, 4, 5, 6],
			},
			undoRedo: collaborative ? false : undefined,
		}),
		TextStyleKit,
		TextAlign.configure({
			types: ["heading", "paragraph"],
			defaultAlignment: "left",
		}),
		TaskList,
		TaskItem.configure({
			nested: true,
		}),
		Image.configure({
			resize: {
				enabled: true,
				alwaysPreserveAspectRatio: true,
			},
		}),
		Extension.create({
			name: "imageUploadFeedback",
			addProseMirrorPlugins() {
				const editor = this.editor;
				const warn = (files: File[]) => {
					if (
						editor.isEditable &&
						files.some((file) => !imageMimeTypes.includes(file.type))
					)
						reportUpload(editor, "Only PNG and JPEG images are supported.");
					return false;
				};
				return [
					new Plugin({
						props: {
							handleDOMEvents: {
								drop: (_view, event) =>
									warn(Array.from(event.dataTransfer?.files ?? [])),
								paste: (_view, event) =>
									warn(Array.from(event.clipboardData?.files ?? [])),
							},
						},
					}),
				];
			},
		}),
		FileHandler.configure({
			allowedMimeTypes: imageMimeTypes,
			onDrop: (editor, files, pos) => {
				void insertUploadedImages(editor, files, pos);
			},
			onPaste: (editor, files, htmlContent) => {
				if (htmlContent) return false;
				void insertUploadedImages(editor, files, editor.state.selection.anchor);
			},
		}),
	];

	return baseExtensions;
};

export const commonEditorConfigs: UseEditorOptions = {
	editorProps: {
		attributes: {
			class: "outline-none px-2 py-4",
		},
	},
};

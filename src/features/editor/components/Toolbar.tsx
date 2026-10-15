import type { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import {
	AlignCenter,
	AlignJustify,
	AlignLeft,
	AlignRight,
	Baseline,
	Bold,
	Code,
	Highlighter,
	ImagePlus,
	Italic,
	Link,
	List,
	ListOrdered,
	Redo2,
	RemoveFormatting,
	Strikethrough,
	Underline,
	Undo2,
	Unlink,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import ToolButton from "./ToolButton";

interface Props {
	editor: Editor;
	canUndo?: boolean;
	canRedo?: boolean;
	onUndo?: () => void;
	onRedo?: () => void;
	disabled: boolean;
}

const COLORS = [
	"#FFFFFF",
	"#000000",
	"#FF0000",
	"#00FF00",
	"#0000FF",
	"#FFFF00",
	"#FF00FF",
	"#00FFFF",
	"#FFA500",
];

const Toolbar = ({
	editor,
	canUndo,
	canRedo,
	onUndo,
	onRedo,
	disabled,
}: Props) => {
	const [showColorPicker, setShowColorPicker] = useState(false);
	const [showHighlightPicker, setShowHighlightPicker] = useState(false);

	/** Close popovers when toolbar is disabled */
	useEffect(() => {
		if (disabled) {
			setShowColorPicker(false);
			setShowHighlightPicker(false);
		}
	}, [disabled]);

	const editorState = useEditorState({
		editor,
		selector(ctx) {
			return {
				bold: ctx.editor.isActive("bold"),
				italic: ctx.editor.isActive("italic"),
				underline: ctx.editor.isActive("underline"),
				strike: ctx.editor.isActive("strike"),
				code: ctx.editor.isActive("code"),
				bullet: ctx.editor.isActive("bulletList"),
				ordered: ctx.editor.isActive("orderedList"),
				left: ctx.editor.isActive({ textAlign: "left" }),
				center: ctx.editor.isActive({ textAlign: "center" }),
				right: ctx.editor.isActive({ textAlign: "right" }),
				justify: ctx.editor.isActive({ textAlign: "justify" }),
			};
		},
	});

	const addImage = useCallback(() => {
		if (disabled || !editor.isEditable) return;
		const url = window.prompt("Image URL");
		if (url) editor.chain().focus().setImage({ src: url }).run();
	}, [editor, disabled]);

	const setLink = () => {
		if (disabled || !editor.isEditable) return;
		const url = window.prompt("Enter URL");
		if (url) editor.chain().focus().setLink({ href: url }).run();
	};

	return (
		<div className="editor-toolbar relative border-b border-border bg-card text-card-foreground">
			<fieldset
				disabled={disabled}
				aria-label="Document formatting"
				className={cn(
					"flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 sm:px-6",
					disabled && "opacity-50",
				)}
			>
				{/* History */}
				{onUndo && onRedo && (
					<div className="flex shrink-0 items-center gap-0.5 border-r border-border pr-3">
						<ToolButton
							label="Undo"
							icon={Undo2}
							onClick={onUndo}
							disabled={!canUndo}
						/>
						<ToolButton
							label="Redo"
							icon={Redo2}
							onClick={onRedo}
							disabled={!canRedo}
						/>
					</div>
				)}

				{/* Headings (space reserved to avoid jump) */}
				<div className="flex w-36 shrink-0 border-r border-border pr-3">
					<select
						aria-label="Text style"
						className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed"
						value={
							editor.isActive("heading", { level: 1 })
								? "1"
								: editor.isActive("heading", { level: 2 })
									? "2"
									: editor.isActive("heading", { level: 3 })
										? "3"
										: "p"
						}
						onChange={(e) => {
							const v = e.target.value;
							if (v === "p") {
								editor.chain().focus().setParagraph().run();
							} else {
								editor
									.chain()
									.focus()
									.toggleHeading({ level: +v as 1 | 2 | 3 })
									.run();
							}
						}}
					>
						<option value="p">Paragraph</option>
						<option value="1">Heading 1</option>
						<option value="2">Heading 2</option>
						<option value="3">Heading 3</option>
					</select>
				</div>

				{/* Text formatting */}
				<div className="flex shrink-0 items-center gap-0.5 border-r border-border pr-3">
					<ToolButton
						label="Bold"
						icon={Bold}
						active={editorState.bold}
						onClick={() => editor.chain().focus().toggleBold().run()}
					/>
					<ToolButton
						label="Italic"
						icon={Italic}
						active={editorState.italic}
						onClick={() => editor.chain().focus().toggleItalic().run()}
					/>
					<ToolButton
						label="Underline"
						icon={Underline}
						active={editorState.underline}
						onClick={() => editor.chain().focus().toggleUnderline().run()}
					/>
					<ToolButton
						label="Strikethrough"
						icon={Strikethrough}
						active={editorState.strike}
						onClick={() => editor.chain().focus().toggleStrike().run()}
					/>
					<ToolButton
						label="Inline code"
						icon={Code}
						active={editorState.code}
						onClick={() => editor.chain().focus().toggleCode().run()}
					/>
				</div>

				{/* Colors */}
				<div className="relative flex shrink-0 items-center gap-0.5 border-r border-border pr-3">
					<ToolButton
						label="Text color"
						icon={Baseline}
						onClick={() => {
							setShowHighlightPicker((v) => !v);
							setShowColorPicker(false);
						}}
					/>
					{showHighlightPicker && (
						<div className="absolute left-0 top-full z-30 mt-2 grid w-36 grid-cols-4 gap-2 rounded-lg bg-popover p-3 text-popover-foreground shadow-lg outline outline-border">
							{COLORS.map((c) => (
								<button
									type="button"
									key={c}
									aria-label={`Apply ${c}`}
									title={`Apply ${c}`}
									className="size-7 rounded-md border border-border outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-popover"
									style={{ backgroundColor: c }}
									onClick={() => {
										editor.chain().focus().setColor(c).run();
										setShowHighlightPicker(false);
									}}
								/>
							))}
						</div>
					)}

					<ToolButton
						label="Highlight color"
						icon={Highlighter}
						onClick={() => {
							setShowColorPicker((v) => !v);
							setShowHighlightPicker(false);
						}}
					/>
					{showColorPicker && (
						<div className="absolute left-0 top-full z-30 mt-2 grid w-36 grid-cols-4 gap-2 rounded-lg bg-popover p-3 text-popover-foreground shadow-lg outline outline-border">
							{COLORS.map((c) => (
								<button
									type="button"
									key={c}
									aria-label={`Apply ${c}`}
									title={`Apply ${c}`}
									className="size-7 rounded-md border border-border outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-popover"
									style={{ backgroundColor: c }}
									onClick={() => {
										editor.chain().focus().setBackgroundColor(c).run();
										setShowColorPicker(false);
									}}
								/>
							))}
						</div>
					)}

					<ToolButton
						label="Clear formatting"
						icon={RemoveFormatting}
						onClick={() => editor.chain().focus().unsetAllMarks().run()}
					/>
				</div>

				{/* Lists */}
				<div className="flex shrink-0 items-center gap-0.5 border-r border-border pr-3">
					<ToolButton
						label="Bullet list"
						icon={List}
						active={editorState.bullet}
						onClick={() => editor.chain().focus().toggleBulletList().run()}
					/>
					<ToolButton
						label="Numbered list"
						icon={ListOrdered}
						active={editorState.ordered}
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
					/>
				</div>

				{/* Links & images */}
				<div className="flex shrink-0 items-center gap-0.5 border-r border-border pr-3">
					<ToolButton label="Insert link" icon={Link} onClick={setLink} />
					<ToolButton
						label="Remove link"
						icon={Unlink}
						onClick={() => editor.chain().focus().unsetLink().run()}
					/>
					<ToolButton
						label="Insert image"
						icon={ImagePlus}
						onClick={addImage}
					/>
				</div>

				{/* Alignment */}
				<div className="flex shrink-0 items-center gap-0.5">
					<ToolButton
						label="Align left"
						icon={AlignLeft}
						active={editorState.left}
						onClick={() => editor.chain().focus().setTextAlign("left").run()}
					/>
					<ToolButton
						label="Align center"
						icon={AlignCenter}
						active={editorState.center}
						onClick={() => editor.chain().focus().setTextAlign("center").run()}
					/>
					<ToolButton
						label="Align right"
						icon={AlignRight}
						active={editorState.right}
						onClick={() => editor.chain().focus().setTextAlign("right").run()}
					/>
					<ToolButton
						label="Justify text"
						icon={AlignJustify}
						active={editorState.justify}
						onClick={() => editor.chain().focus().setTextAlign("justify").run()}
					/>
				</div>
			</fieldset>
		</div>
	);
};

export default Toolbar;

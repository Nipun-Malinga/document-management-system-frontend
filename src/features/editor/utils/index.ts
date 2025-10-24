import { Editor, Element, Transforms } from 'slate';
import type {
  alignKeys,
  customEditor,
  customElement,
  elementKeys,
  markKeys,
} from '../types';

export const isMarkActive = (editor: customEditor, format: markKeys) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const toggleMark = (editor: customEditor, format: markKeys) => {
  isMarkActive(editor, format)
    ? editor.removeMark(format)
    : editor.addMark(format, true);
};

export const isALignFormat = (format: elementKeys) => {
  return ['left', 'center', 'right', 'justify'].includes(format);
};

export const isElementActive = (editor: customEditor, format: elementKeys) => {
  const { selection } = editor;

  if (selection && isALignFormat(format)) {
    const match = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: (node) => {
          return (
            !Editor.isEditor(node) &&
            Element.isElement(node) &&
            node.align === format
          );
        },
      })
    );

    return !!match?.[0];
  }
};

export const toggleElement = (editor: customEditor, format: elementKeys) => {
  let isAlignFormat = isALignFormat(format);
  let align: alignKeys | undefined;

  if (isALignFormat(format))
    align = isElementActive(editor, format) ? undefined : (format as alignKeys);

  let newProperties: Partial<Element> = {};

  if (isAlignFormat) newProperties['align'] = align;

  Transforms.setNodes<Editor>(editor, newProperties);
};

export const parseData = (data: string): customElement[] => {
  try {
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

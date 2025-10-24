import type { IconType } from 'react-icons';
import type { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

/* Slate Custom Types */

export type markKeys =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'superscript';

export type alignKeys = 'left' | 'center' | 'right' | 'justify';

export type elementKeys =
  | alignKeys
  | 'block-quote'
  | 'numbered-list'
  | 'bulleted-list'
  | 'list-item';

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  superscript?: boolean;
};

type BaseElement = {
  type: string;
  children: CustomText[];
  align: alignKeys;
};

export type customEditor = BaseEditor & ReactEditor & HistoryEditor;
export type customElement = BaseElement;
export type customText = CustomText;

/* Toolbar Types */

export type MarkButton = {
  icon: IconType;
  action: markKeys;
};

export type ElementButton = {
  icon: IconType;
  action: elementKeys;
};

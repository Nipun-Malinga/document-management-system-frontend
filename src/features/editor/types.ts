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
};

export type customEditor = BaseEditor & ReactEditor & HistoryEditor;
export type customElement = BaseElement;
export type customText = CustomText;

/* Toolbar Types */

export type ToolBarButton = {
  icon: IconType;
  action: markKeys;
};

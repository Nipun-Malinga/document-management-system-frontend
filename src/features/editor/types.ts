import { ReactEditor } from 'slate-react';
import type { BaseEditor } from 'slate';
import type { IconType } from 'react-icons';

/* Slate Custom Types */

export type customActions =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'superscript'
  | 'subscript'
  | 'leftAlign'
  | 'centerAlign'
  | 'rightAlign'
  | 'alignJustify';

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  superscript?: boolean;
  subscript?: boolean;
  leftAlign?: boolean;
  centerAlign?: boolean;
  rightAlign?: boolean;
  alignJustify?: boolean;
};

type BaseElement = {
  type: string;
  children: CustomText[];
};

export type customEditor = BaseEditor & ReactEditor;
export type customElement = BaseElement;
export type customText = CustomText;

/* Toolbar Types */

export type ToolBarButton = {
  icon: IconType;
  action: customActions;
};

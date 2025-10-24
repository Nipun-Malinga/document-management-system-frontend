import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaUnderline,
  FaSuperscript,
} from 'react-icons/fa';
import type { ElementButton, MarkButton,  } from '../types';

export const markButtons: MarkButton[] = [
  {
    icon: FaBold,
    action: 'bold',
  },
  {
    icon: FaItalic,
    action: 'italic',
  },
  {
    icon: FaUnderline,
    action: 'underline',
  },
  {
    icon: FaStrikethrough,
    action: 'strikethrough',
  },
  {
    icon: FaSuperscript,
    action: 'superscript',
  },
];

export const alignButtons: ElementButton[] = [
  {
    icon: FaAlignLeft,
    action: 'left',
  },
  {
    icon: FaAlignCenter,
    action: 'center',
  },
  {
    icon: FaAlignRight,
    action: 'right',
  },
  {
    icon: FaAlignJustify,
    action: 'justify',
  },
];

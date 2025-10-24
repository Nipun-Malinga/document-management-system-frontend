import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaUnderline,
  FaSuperscript
} from 'react-icons/fa';
import type { ToolBarButton } from '../types';

export const textStyleButtons: ToolBarButton[] = [
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
  }
];

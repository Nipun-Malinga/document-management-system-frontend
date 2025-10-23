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
  FaSubscript,
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
  },
  {
    icon: FaSubscript,
    action: 'subscript',
  },
];

export const alignmentButtons: ToolBarButton[] = [
  {
    icon: FaAlignLeft,
    action: 'leftAlign',
  },
  {
    icon: FaAlignCenter,
    action: 'centerAlign',
  },
  {
    icon: FaAlignRight,
    action: 'rightAlign',
  },
  {
    icon: FaAlignJustify,
    action: 'alignJustify',
  },
];

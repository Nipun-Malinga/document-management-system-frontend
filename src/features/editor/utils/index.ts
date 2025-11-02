import type { Content } from '@tiptap/react';

export const convertToTiptapContent = (content: string): Content => {
  try {
    return JSON.parse(content) as Content;
  } catch {
    return { type: 'doc', content: [] };
  }
};

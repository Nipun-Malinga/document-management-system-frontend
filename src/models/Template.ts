import type { Content } from '@tiptap/core';

export interface Template {
  id: number;
  title: string;
  template: Content;
}

export interface TemplateResponse extends Omit<Template, 'template'> {
  template: string;
}

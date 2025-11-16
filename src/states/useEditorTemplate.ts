import { create } from 'zustand';
import type { Template } from '@/models/Template';

interface EditorTemplateState extends Template {
  setTemplate: (content: Template) => void;
}

const useEditorTemplate = create<EditorTemplateState>((set) => ({
  id: 0,
  title: '',
  template: null,
  setTemplate: (content) =>
    set({ title: content.title, template: content.template }),
}));

export default useEditorTemplate;

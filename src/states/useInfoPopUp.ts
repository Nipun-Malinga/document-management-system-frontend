import { create } from 'zustand';

interface InfoPopUp {
  documentId: string | null;
  collapsed: boolean;
  setDocumentId: (documentId: string | null) => void;
  toggle: () => void;
}

const useInfoPopUp = create<InfoPopUp>((set) => ({
  documentId: null,
  collapsed: true,
  setDocumentId: (documentId) => set({ documentId: documentId }),
  toggle: () => set((state) => ({ collapsed: !state.collapsed })),
}));

export default useInfoPopUp;

import { create } from 'zustand';

interface InfoPopUp {
  documentId: string | null;
  collapsed: boolean;
  shared: boolean;
  setDocumentId: (documentId: string | null) => void;
  toggleCollapsed: () => void;
  setShared: (shared: boolean) => void;
}

const useInfoPopUp = create<InfoPopUp>((set) => ({
  documentId: null,
  collapsed: true,
  shared: false,
  setDocumentId: (documentId) => set({ documentId: documentId }),
  toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
  setShared: (shared) => set({ shared: shared }),
}));

export default useInfoPopUp;

import { create } from 'zustand';

interface DocumentInfoPopupState {
  documentId: string | null;
  collapsed: boolean;
  shared: boolean;
  setDocumentId: (documentId: string | null) => void;
  toggleDocumentInfoPopup: () => void;
  setShared: (shared: boolean) => void;
}

const useDocumentInfoPopUp = create<DocumentInfoPopupState>((set) => ({
  documentId: null,
  collapsed: true,
  shared: false,
  setDocumentId: (documentId) => set({ documentId: documentId }),
  toggleDocumentInfoPopup: () =>
    set((state) => ({ collapsed: !state.collapsed })),
  setShared: (shared) => set({ shared: shared }),
}));

export default useDocumentInfoPopUp;

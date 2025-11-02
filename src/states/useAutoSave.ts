import { create } from 'zustand';

interface AutoSave {
  documentId: string;
  branchId: string;
  saving: boolean;
}

interface AutoSaveState {
  states: AutoSave[];
  addState: (state: AutoSave) => void;
  getState: (documentId: string, branchId: string) => AutoSave | undefined;
  removeState: (documentId: string, branchId: string) => void;
  updateState: (documentId: string, branchId: string, saving: boolean) => void;
}

const useAutoSave = create<AutoSaveState>((set, get) => ({
  states: [],

  addState: (newState) => {
    const existing = get().states.find(
      (s) =>
        s.documentId === newState.documentId && s.branchId === newState.branchId
    );
    if (!existing) {
      set((state) => ({
        states: [...state.states, newState],
      }));
    } else {
      get().updateState(
        newState.documentId,
        newState.branchId,
        newState.saving
      );
    }
  },

  getState: (documentId, branchId) => {
    return get().states.find(
      (s) => s.documentId === documentId && s.branchId === branchId
    );
  },

  removeState: (documentId, branchId) =>
    set((state) => ({
      states: state.states.filter(
        (s) => !(s.documentId === documentId && s.branchId === branchId)
      ),
    })),

  updateState: (documentId, branchId, saving) =>
    set((state) => ({
      states: state.states.map((s) =>
        s.documentId === documentId && s.branchId === branchId
          ? { ...s, saving: saving }
          : s
      ),
    })),
}));

export default useAutoSave;

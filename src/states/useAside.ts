import { create } from 'zustand';

interface AsideState {
  collapsed: boolean;
  toggle: () => void;
}

const useAside = create<AsideState>((set) => ({
  collapsed: false,
  toggle: () => set((state) => ({ collapsed: !state.collapsed })),
}));

export default useAside;

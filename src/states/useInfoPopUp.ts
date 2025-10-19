import { create } from 'zustand';

interface InfoPopUp {
  collapsed: boolean;
  toggle: () => void;
}

const useInfoPopUp = create<InfoPopUp>((set) => ({
  collapsed: true,
  toggle: () => set((state) => ({ collapsed: !state.collapsed })),
}));

export default useInfoPopUp;

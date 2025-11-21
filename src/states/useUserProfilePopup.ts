import { create } from 'zustand';

interface ProfilePopupState {
  userId: number;
  collapsed: boolean;
  setUserId: (userId: number) => void;
  toggleProfilePopup: () => void;
}

const useUserProfilePopup = create<ProfilePopupState>((set) => ({
  userId: 0,
  collapsed: true,
  setUserId: (userId) => set(() => ({ userId: userId })),
  toggleProfilePopup: () => set((state) => ({ collapsed: !state.collapsed })),
}));

export default useUserProfilePopup;

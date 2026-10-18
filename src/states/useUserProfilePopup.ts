import { create } from "zustand";

interface ProfilePopupState {
	collapsed: boolean;
	toggleProfilePopup: () => void;
}

const useUserProfilePopup = create<ProfilePopupState>((set) => ({
	collapsed: true,
	toggleProfilePopup: () => set((state) => ({ collapsed: !state.collapsed })),
}));

export default useUserProfilePopup;

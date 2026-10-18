export type AccountSectionState = {
	pending: boolean;
	dirty: boolean;
};

export type ProfileSectionState = AccountSectionState & { ready: boolean };

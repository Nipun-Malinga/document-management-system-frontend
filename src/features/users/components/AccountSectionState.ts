import type { ReactNode } from "react";

export type AccountSectionState = {
	pending: boolean;
	dirty: boolean;
	renderContent: (pending: boolean) => ReactNode;
	renderActions: (pending: boolean) => ReactNode;
};

export type ProfileSectionState = AccountSectionState & { ready: boolean };

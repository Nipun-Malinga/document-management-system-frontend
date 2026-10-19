import { create } from "zustand";
import { getSession } from "@/features/auth/stores/sessionStore";
import type { SaveCoordinator } from "./SaveCoordinator";

interface ActiveEditor {
	documentId: string;
	branchId: string;
	epoch: number;
	mode: "solo" | "collaborative";
	coordinator: SaveCoordinator | null;
}

export const usePersistenceRegistry = create<{ active: ActiveEditor | null }>(
	() => ({ active: null }),
);
export const registerPersistence = (active: ActiveEditor) => {
	usePersistenceRegistry.setState({ active });
	return () => {
		if (usePersistenceRegistry.getState().active === active)
			usePersistenceRegistry.setState({ active: null });
	};
};

export const requireSoloCoordinator = (
	documentId: string,
	branchId: string,
) => {
	const active = usePersistenceRegistry.getState().active;
	if (
		!active ||
		active.epoch !== getSession().epoch ||
		active.documentId !== documentId ||
		active.branchId !== branchId
	) {
		throw new Error(
			"Open the target branch editor before performing this operation.",
		);
	}
	if (active.mode !== "solo" || !active.coordinator)
		throw new Error(
			"This operation is disabled until collaborative persistence is verified.",
		);
	active.coordinator.assertWritable();
	return active.coordinator;
};

export const flushActiveEditor = async () => {
	const active = usePersistenceRegistry.getState().active;
	if (active?.epoch === getSession().epoch)
		await active.coordinator?.prepareToLeave();
};

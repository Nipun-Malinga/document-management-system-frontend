import { useDocument } from "@/hooks/document";
import { usePersistenceRegistry } from "./persistenceRegistry";
import useSaveState from "./useSaveState";

const useSoloActionState = (documentId: string, branchId: string) => {
	const document = useDocument(documentId);
	const active = usePersistenceRegistry((state) => state.active);
	const scoped =
		active?.documentId === documentId && active.branchId === branchId
			? active
			: null;
	const state = useSaveState(scoped?.coordinator ?? null);
	const collaborative =
		document.data?.shared || scoped?.mode === "collaborative";
	return {
		replacementPending: state.replacementPending,
		disabled: Boolean(collaborative || state.locked || document.isError),
		reason: collaborative
			? "Snapshots and merges are disabled until collaborative persistence and replacement are verified."
			: "",
	};
};
export default useSoloActionState;

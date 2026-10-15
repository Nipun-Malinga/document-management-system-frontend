import { Button } from "@/components/ui/button";
import { usePersistenceRegistry } from "../persistence/persistenceRegistry";
import useSaveState from "../persistence/useSaveState";

const AutoSaver = () => {
	const coordinator = usePersistenceRegistry(
		(state) => state.active?.coordinator ?? null,
	);
	const state = useSaveState(coordinator);
	if (!coordinator) return null;
	return (
		<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
			<span
				role={state.status === "error" ? "alert" : "status"}
				className={state.status === "error" ? "text-destructive" : undefined}
			>
				{state.replacementPending
					? state.error || "Reloading merged branch…"
					: state.status === "error"
						? "Save failed. Changes remain unsaved."
						: state.status === "saving"
							? "Saving…"
							: coordinator.dirty
								? "Unsaved changes"
								: "Saved"}
			</span>
			{state.status === "error" && (
				<Button
					size="sm"
					variant="outline"
					onClick={() => {
						void (
							state.replacementPending
								? coordinator.retryReplacement()
								: coordinator.flush()
						).catch(() => {});
					}}
				>
					{state.replacementPending ? "Retry reload" : "Retry saving"}
				</Button>
			)}
		</div>
	);
};

export default AutoSaver;

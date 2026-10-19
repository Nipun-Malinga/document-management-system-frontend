import { useEffect, useState } from "react";
import { useBlocker } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getSession } from "@/features/auth/stores/sessionStore";
import { usePersistenceRegistry } from "./persistenceRegistry";
import useSaveState from "./useSaveState";

const EditorNavigationGuard = () => {
	const active = usePersistenceRegistry((state) => state.active);
	const coordinator =
		active?.epoch === getSession().epoch ? active.coordinator : null;
	useSaveState(coordinator);
	const blocker = useBlocker(() => Boolean(coordinator?.needsProtection));
	const [error, setError] = useState("");
	const [busy, setBusy] = useState(false);
	const [retry, setRetry] = useState(0);

	// biome-ignore lint/correctness/useExhaustiveDependencies: The retry counter deliberately starts a fresh save attempt for the blocked destination.
	useEffect(() => {
		if (blocker.state !== "blocked" || !coordinator) return;
		let cancelled = false;
		setBusy(true);
		setError("");
		void coordinator
			.prepareToLeave()
			.then(() => {
				if (!cancelled) blocker.proceed();
			})
			.catch((error: unknown) => {
				if (!cancelled)
					setError(
						error instanceof Error
							? error.message
							: "Saving failed. Your changes are still in the editor.",
					);
			})
			.finally(() => {
				if (!cancelled) setBusy(false);
			});
		return () => {
			cancelled = true;
		};
		// The blocked destination is stable while its save attempt runs.
	}, [blocker, coordinator, retry]);

	if (blocker.state !== "blocked") return null;
	return (
		<div
			role={error ? "alert" : "status"}
			className="border-b border-border bg-background p-3 text-sm text-foreground space-y-2"
		>
			<p>{busy ? "Saving before leaving…" : error}</p>
			{!busy && error && (
				<div className="flex flex-wrap gap-2">
					<Button
						variant="outline"
						onClick={() => setRetry((value) => value + 1)}
					>
						Retry saving and leave
					</Button>
					<Button variant="outline" onClick={() => blocker.reset()}>
						Stay here
					</Button>
					<Button variant="destructive" onClick={() => blocker.proceed()}>
						Discard local changes and leave
					</Button>
				</div>
			)}
		</div>
	);
};

export default EditorNavigationGuard;

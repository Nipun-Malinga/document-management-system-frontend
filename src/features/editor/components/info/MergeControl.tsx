import { CheckCircle } from "lucide-react";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useMergeBranch from "@/hooks/document/useMergeBranch";
import useMergeVersion from "@/hooks/document/useMergeVersion";
import { actionError } from "../../persistence/actionError";
import useSoloActionState from "../../persistence/useSoloActionState";

interface Props {
	documentId: string;
	targetBranchId: string;
	source: { kind: "branch" | "version"; id: string; name: string };
}

const MergeControl = ({ documentId, targetBranchId, source }: Props) => {
	const [open, setOpen] = useState(false);
	const [error, setError] = useState("");
	const branch = useMergeBranch(documentId, targetBranchId, source.id);
	const version = useMergeVersion(documentId, targetBranchId, source.id);
	const mutation = source.kind === "branch" ? branch : version;
	const safety = useSoloActionState(documentId, targetBranchId);
	const self = source.kind === "branch" && source.id === targetBranchId;
	const disabled = safety.disabled || self || !targetBranchId;
	return (
		<div className="w-full space-y-2">
			<AlertDialog
				open={open}
				onOpenChange={(next) => {
					if (!mutation.isPending) {
						setOpen(next);
						setError("");
					}
				}}
			>
				<AlertDialogTrigger asChild>
					<Button variant="outline" disabled={disabled} className="w-full">
						<CheckCircle className="w-4 h-4" />
						Merge
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Replace the active branch?</AlertDialogTitle>
						<AlertDialogDescription>
							The selected {source.kind} “{source.name}” is the source. Its
							content will overwrite the active branch ({targetBranchId}). Your
							current solo edits will be saved first. This does not combine
							changes.
						</AlertDialogDescription>
					</AlertDialogHeader>
					{error && (
						<p role="alert" className="text-sm text-destructive">
							{safety.replacementPending
								? "The merge completed, but reloading failed. Close this dialog and use Retry reload. Editing is paused."
								: error}
						</p>
					)}
					<AlertDialogFooter>
						<AlertDialogCancel disabled={mutation.isPending}>
							Cancel
						</AlertDialogCancel>
						<Button
							disabled={disabled || mutation.isPending}
							onClick={() => {
								setError("");
								void mutation
									.mutateAsync()
									.then(() => setOpen(false))
									.catch((error: unknown) => setError(actionError(error)));
							}}
						>
							{mutation.isPending ? "Replacing…" : "Replace active branch"}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			{safety.reason && (
				<p className="text-sm text-muted-foreground">{safety.reason}</p>
			)}
			{self && (
				<p className="text-sm text-muted-foreground">
					Choose a different source branch.
				</p>
			)}
		</div>
	);
};
export default MergeControl;

import { FileText, GitBranch, RotateCcw, Trash2 } from "lucide-react";
import { Alert } from "@/components";
import { Button } from "@/components/ui/button";
import {
	useDeleteBranch,
	useDeleteDocument,
	useRestoreBranch,
	useRestoreDocument,
} from "@/features/documents/hooks";
import type {
	TrashBranch,
	TrashDocument,
} from "@/features/documents/types/Trash";

interface Props {
	trash: TrashDocument | TrashBranch;
}

const TrashTableRow = ({ trash }: Props) => {
	const isBranch = "branch" in trash;
	const itemName = isBranch ? trash.branch.branchName : trash.document.title;
	const itemType = isBranch ? "Branch" : "Document";

	const { mutateAsync: restoreDocument } = useRestoreDocument(
		!isBranch ? trash.document.id : "",
	);

	const { mutateAsync: restoreBranch } = useRestoreBranch(
		isBranch ? trash.branch.documentId : "",
		isBranch ? trash.branch.id : "",
	);

	const { mutateAsync: deleteDocument } = useDeleteDocument(
		!isBranch ? trash.document.id : "",
	);

	const { mutateAsync: deleteBranch } = useDeleteBranch(
		isBranch ? trash.branch.documentId : "",
		isBranch ? trash.branch.id : "",
	);

	const handleRestore = () => {
		return isBranch ? restoreBranch() : restoreDocument();
	};

	const handleDelete = () => {
		return isBranch ? deleteBranch() : deleteDocument();
	};

	const Icon = isBranch ? GitBranch : FileText;
	return (
		<tr className="transition-colors hover:bg-muted/40 focus-within:bg-muted/40">
			<th scope="row" className="px-5 py-5 text-left font-normal">
				<div className="flex min-w-0 items-center gap-3">
					<span
						aria-hidden="true"
						className="flex h-12 w-10 shrink-0 items-center justify-center rounded-md border bg-secondary/50 text-primary"
					>
						<Icon className="size-4" strokeWidth={1.5} />
					</span>
					<div className="flex min-w-0 flex-col gap-1">
						<span className="max-w-96 wrap-anywhere text-sm font-medium">
							{itemName}
						</span>
						<span className="text-xs text-muted-foreground">{itemType}</span>
					</div>
				</div>
			</th>
			<td className="px-5 py-5 text-sm text-muted-foreground tabular-nums">
				<span className="whitespace-nowrap">{trash.addedDate}</span>
			</td>
			<td className="px-5 py-5 text-right">
				<div className="flex items-center justify-end gap-2">
					<Alert
						trigger={
							<Button
								type="button"
								variant="outline"
								aria-label={`Restore ${itemType.toLowerCase()} ${itemName}`}
								title={`Restore ${itemName}`}
							>
								<RotateCcw aria-hidden="true" data-icon="inline-start" />
								<span className="sr-only @min-[40rem]/trash:not-sr-only">
									Restore
								</span>
							</Button>
						}
						title="Restore Item?"
						description={`Restore “${itemName}” to your active ${isBranch ? "branches" : "documents"}?`}
						action="Restore"
						onClick={handleRestore}
					/>
					<Alert
						trigger={
							<Button
								type="button"
								variant="ghost"
								className="text-destructive hover:bg-destructive/10 hover:text-destructive"
								aria-label={`Permanently delete ${itemType.toLowerCase()} ${itemName}`}
								title={`Permanently delete ${itemName}`}
							>
								<Trash2 aria-hidden="true" data-icon="inline-start" />
								<span className="sr-only @min-[40rem]/trash:not-sr-only">
									Delete
								</span>
							</Button>
						}
						title="Permanently Delete?"
						description={`Permanently delete “${itemName}”? This action cannot be undone.`}
						action="Delete Permanently"
						onClick={handleDelete}
					/>
				</div>
			</td>
		</tr>
	);
};

export default TrashTableRow;

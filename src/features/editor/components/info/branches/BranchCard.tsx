import { ArrowRight, Eye, GitBranch, LoaderCircle, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert } from "@/components";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useTrashBranch } from "@/features/documents/hooks";
import useDocumentAccess from "@/features/documents/hooks/useDocumentAccess";
import type { Branch } from "@/features/documents/types/Branch";
import { cn } from "@/lib/utils";
import MergeControl from "../MergeControl";

interface Props {
	branch: Branch;
}

const BranchCard = ({ branch }: Props) => {
	const { branchId } = useParams();
	const navigate = useNavigate();
	const { canWrite, isOwner } = useDocumentAccess(
		branch.documentId,
		branchId ?? "",
	);
	const { mutateAsync, isPending } = useTrashBranch(
		branch.documentId,
		branch.id,
	);
	const isCurrentBranch = branch.id === branchId;
	const isMainBranch = branch.branchName.toLowerCase() === "main";

	return (
		<Card
			aria-current={isCurrentBranch ? "true" : undefined}
			className={cn(
				"min-w-0 gap-3 overflow-hidden py-0 shadow-none transition-colors hover:border-primary/50 focus-within:border-primary/50",
				isCurrentBranch && "border-primary/50",
			)}
		>
			<CardHeader className="px-4 pt-4">
				<div className="flex min-w-0 items-start gap-3">
					<span
						aria-hidden="true"
						className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary"
					>
						<GitBranch className="size-4" />
					</span>
					<div className="flex min-w-0 flex-1 flex-col gap-2">
						<CardTitle>
							<h3 className="wrap-anywhere text-base leading-6">
								{branch.branchName}
							</h3>
						</CardTitle>
						{(isMainBranch || isCurrentBranch) && (
							<div className="flex flex-wrap items-center gap-2">
								{isCurrentBranch && <Badge>Active</Badge>}
								{isMainBranch && <Badge variant="secondary">Main</Badge>}
							</div>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent className="px-4 pb-1">
				<p className="wrap-anywhere text-xs leading-relaxed text-muted-foreground tabular-nums">
					Created {branch.createdAt}
				</p>
			</CardContent>
			<CardFooter className="flex-wrap items-start gap-2 border-t bg-muted/30 px-4 py-3 [.border-t]:pt-3">
				<Button
					variant="ghost"
					size="sm"
					className="flex-1"
					onClick={() =>
						navigate(`/document/${branch.documentId}/branch/${branch.id}/view`)
					}
				>
					<Eye aria-hidden="true" data-icon="inline-start" />
					Preview
				</Button>
				{!isCurrentBranch && (
					<Button
						size="sm"
						className="flex-1"
						onClick={() =>
							navigate(
								`/document/${branch.documentId}/branch/${branch.id}/edit`,
							)
						}
					>
						Switch
						<ArrowRight aria-hidden="true" data-icon="inline-end" />
					</Button>
				)}
				{!isMainBranch && isOwner && (
					<Alert
						className="shrink-0"
						trigger={
							<Button
								variant="destructive"
								size="icon-sm"
								disabled={isPending}
								aria-label={isPending ? "Deleting..." : "Delete"}
								title="Delete branch"
							>
								{isPending ? (
									<LoaderCircle
										aria-hidden="true"
										data-icon="inline-start"
										className="animate-spin motion-reduce:animate-none"
									/>
								) : (
									<Trash2 aria-hidden="true" data-icon="inline-start" />
								)}
							</Button>
						}
						title="Delete Branch?"
						description="Move this branch to Trash. You can restore it later."
						action="Delete"
						onClick={async () => {
							if (isOwner) await mutateAsync();
						}}
					/>
				)}
				{canWrite && (
					<MergeControl
						documentId={branch.documentId}
						targetBranchId={branchId ?? ""}
						source={{ kind: "branch", id: branch.id, name: branch.branchName }}
					/>
				)}
			</CardFooter>
		</Card>
	);
};
export default BranchCard;

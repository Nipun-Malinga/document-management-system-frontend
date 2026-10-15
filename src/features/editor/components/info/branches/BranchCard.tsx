import { Eye, GitBranch, LoaderCircle, Trash2 } from "lucide-react";
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
import { useTrashBranch } from "@/hooks/document";
import useDocumentAccess from "@/hooks/document/useDocumentAccess";
import type { Branch } from "@/models/Branch";
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
		<Card className="min-w-0 gap-4 shadow-none">
			<CardHeader className="gap-3 px-5">
				<div className="flex items-start gap-3">
					<GitBranch
						aria-hidden="true"
						className="mt-0.5 size-5 shrink-0 text-primary"
						strokeWidth={1.5}
					/>
					<div className="flex min-w-0 flex-1 flex-col gap-2">
						<CardTitle>
							<h3 className="break-words text-base leading-relaxed">
								{branch.branchName}
							</h3>
						</CardTitle>
						{(isMainBranch || isCurrentBranch) && (
							<div className="flex flex-wrap items-center gap-2">
								{isMainBranch && <Badge variant="secondary">Main</Badge>}
								{isCurrentBranch && <Badge variant="outline">Active</Badge>}
							</div>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent className="px-5">
				<p className="break-words text-xs text-muted-foreground">
					Created {branch.createdAt}
				</p>
			</CardContent>
			<CardFooter className="flex-col items-stretch gap-3 px-5">
				<div className="flex flex-wrap gap-2">
					<Button
						variant="outline"
						size="sm"
						className="flex-1"
						onClick={() =>
							navigate(
								`/document/${branch.documentId}/branch/${branch.id}/view`,
							)
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
						</Button>
					)}
				</div>
				{canWrite && (
					<MergeControl
						documentId={branch.documentId}
						targetBranchId={branchId ?? ""}
						source={{ kind: "branch", id: branch.id, name: branch.branchName }}
					/>
				)}
				{!isMainBranch && isOwner && (
					<Alert
						className="w-full"
						trigger={
							<Button
								variant="destructive"
								size="sm"
								disabled={isPending}
								className="w-full"
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
								{isPending ? "Deleting..." : "Delete"}
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
			</CardFooter>
		</Card>
	);
};
export default BranchCard;

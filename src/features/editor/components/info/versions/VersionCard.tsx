import { Eye, Globe, History, LockKeyhole, UserRound } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import useDocumentAccess from "@/hooks/document/useDocumentAccess";
import type { Version } from "@/models/Version";
import MergeControl from "../MergeControl";

interface Props {
	version: Version;
}

const VersionCard = ({ version }: Props) => {
	const { branchId } = useParams();
	const navigate = useNavigate();
	const { canWrite } = useDocumentAccess(version.documentId, branchId ?? "");

	const VisibilityIcon = version.status === "PRIVATE" ? LockKeyhole : Globe;

	return (
		<Card className="min-w-0 gap-3 overflow-hidden py-0 shadow-none transition-colors hover:border-primary/50 focus-within:border-primary/50">
			<CardHeader className="px-4 pt-4">
				<div className="flex min-w-0 items-start gap-3">
					<span
						aria-hidden="true"
						className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary"
					>
						<History className="size-4" />
					</span>
					<div className="flex min-w-0 flex-1 flex-col gap-2">
						<CardTitle>
							<h3 className="wrap-anywhere text-base leading-6">
								{version.title}
							</h3>
						</CardTitle>
						<div>
							<Badge variant="secondary">
								<VisibilityIcon aria-hidden="true" />
								{version.status}
							</Badge>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-1.5 px-4 pb-1">
				<p className="flex min-w-0 items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
					<UserRound aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
					<span className="wrap-anywhere">
						Created by {version.createdBy.username}
					</span>
				</p>
				<p className="wrap-anywhere text-xs leading-relaxed text-muted-foreground tabular-nums">
					Created {version.createdAt}
				</p>
			</CardContent>
			<CardFooter className="flex-wrap items-start gap-2 border-t bg-muted/30 px-4 py-3 [.border-t]:pt-3">
				<Button
					variant="ghost"
					size="sm"
					className="flex-1"
					onClick={() =>
						navigate(
							`/document/${version.documentId}/version/${version.id}/view`,
						)
					}
				>
					<Eye aria-hidden="true" data-icon="inline-start" />
					Preview
				</Button>
				{canWrite && (
					<MergeControl
						documentId={version.documentId}
						targetBranchId={branchId ?? ""}
						source={{ kind: "version", id: version.id, name: version.title }}
					/>
				)}
			</CardFooter>
		</Card>
	);
};
export default VersionCard;

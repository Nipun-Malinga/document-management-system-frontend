import { Eye, Globe, History, LockKeyhole } from "lucide-react";
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
import useDocumentAccess from "@/features/documents/hooks/useDocumentAccess";
import type { Version } from "@/features/documents/types/Version";
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
		<Card className="editor-history-entry min-w-0 gap-3 py-4 shadow-none">
			<CardHeader className="px-4">
				<div className="flex min-w-0 items-start gap-3">
					<span aria-hidden="true" className="editor-history-marker">
						<History className="size-4" />
					</span>
					<div className="flex min-w-0 flex-1 flex-col gap-2">
						<CardTitle>
							<h3 className="wrap-anywhere text-sm leading-6">
								{version.title}
							</h3>
						</CardTitle>
						<div>
							<Badge variant="outline">
								<VisibilityIcon aria-hidden="true" />
								{version.status === "PRIVATE" ? "Private" : "Public"}
							</Badge>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-1 pl-16 pr-4">
				<dl className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-xs leading-relaxed text-muted-foreground">
					<dt>Saved by</dt>
					<dd className="wrap-anywhere">{version.createdBy.username}</dd>
				</dl>
				<p className="wrap-anywhere text-xs leading-relaxed text-muted-foreground tabular-nums">
					Created {version.createdAt}
				</p>
			</CardContent>
			<CardFooter className="editor-history-actions flex-wrap items-start gap-2 pl-16 pr-4">
				<Button
					variant="outline"
					size="sm"
					aria-label={`Preview version ${version.title}`}
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

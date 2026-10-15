import { Eye, History } from "lucide-react";
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

	return (
		<Card className="min-w-0 gap-4 shadow-none">
			<CardHeader className="gap-3 px-5">
				<div className="flex items-center gap-2">
					<History aria-hidden="true" className="size-5 text-primary" />
					<Badge variant="secondary">{version.status}</Badge>
				</div>
				<CardTitle>
					<h3 className="break-words text-base leading-relaxed">
						{version.title}
					</h3>
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-2 px-5">
				<p className="break-words text-xs text-muted-foreground">
					Created by {version.createdBy.username}
				</p>
				<p className="break-words text-xs text-muted-foreground">
					Created {version.createdAt}
				</p>
			</CardContent>
			<CardFooter className="flex-col items-stretch gap-3 px-5">
				<Button
					variant="outline"
					size="sm"
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

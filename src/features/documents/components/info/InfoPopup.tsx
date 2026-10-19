import { FileText, LoaderCircle } from "lucide-react";
import PopupWrapper from "@/components/common/PopupWrapper";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useDocument } from "@/features/documents/hooks";
import useDocumentInfoPopUp from "@/features/documents/stores/useDocumentInfoPopup";
import { collectionErrorMessage } from "@/shared/utils/collectionUtils";
import BadgeList from "../BadgeList";
import BranchSwitch from "../BranchSwitch";
import InfoButtons from "./InfoButtons";
import InfoTabs from "./InfoTabs";

interface Props {
	documentId?: string | null;
}
const InfoPopup = ({ documentId }: Props) => {
	const { data, isPending, isError, error, refetch, isFetching } = useDocument(
		documentId ?? "",
	);
	const { collapsed, toggleDocumentInfoPopup } = useDocumentInfoPopUp();
	return (
		<PopupWrapper
			compact
			collapsed={collapsed}
			onClose={toggleDocumentInfoPopup}
			title={data?.title ?? "Document information"}
			description="Document details, settings, and people with access."
			footer={
				data && documentId && !isError ? (
					<InfoButtons documentId={documentId} />
				) : undefined
			}
		>
			{documentId && isPending && (
				<p className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
					<LoaderCircle
						aria-hidden="true"
						className="size-4 animate-spin motion-reduce:animate-none"
					/>
					Loading document information…
				</p>
			)}
			{documentId && isError && (
				<Alert variant="destructive">
					<FileText aria-hidden="true" />
					<AlertTitle>Could not load document information</AlertTitle>
					<AlertDescription>
						<p>{collectionErrorMessage(error, "document information")}</p>
						<Button
							type="button"
							variant="outline"
							disabled={isFetching}
							onClick={() => {
								void refetch();
							}}
						>
							Retry document information
						</Button>
					</AlertDescription>
				</Alert>
			)}
			{data && documentId && !isError && (
				<>
					<div className="flex min-w-0 shrink-0 flex-wrap items-center justify-between gap-2 rounded-lg border bg-muted/30 px-3 py-2">
						<BadgeList document={data} />
						<BranchSwitch documentId={documentId} />
					</div>
					<InfoTabs key={data.id} document={data} />
				</>
			)}
		</PopupWrapper>
	);
};
export default InfoPopup;

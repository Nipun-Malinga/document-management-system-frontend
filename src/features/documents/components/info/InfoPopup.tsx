import { IoClose } from "react-icons/io5";
import { Button, PopupWrapper } from "@/components";
import { useDocument } from "@/hooks/document";
import useDocumentInfoPopUp from "@/states/useDocumentInfoPopup";
import { collectionErrorMessage } from "@/utils/collectionUtils";
import BadgeList from "../BadgeList";
import BranchSwitch from "../BranchSwitch";
import InfoButtons from "./InfoButtons";
import InfoTabs from "./InfoTabs";

interface Props {
	documentId?: string | null;
}

const InfoPopup = ({ documentId }: Props) => {
	const { data, isPending, isError, error, refetch } = useDocument(
		documentId ?? "",
	);
	const { collapsed, toggleDocumentInfoPopup } = useDocumentInfoPopUp();

	return (
		<PopupWrapper collapsed={collapsed}>
			{documentId && !data && (
				<div>
					<Button
						title="Close document information"
						icon={IoClose}
						onClick={toggleDocumentInfoPopup}
					/>
					{isPending && <p role="status">Loading document information…</p>}
					{isError && (
						<div role="alert">
							<p>{collectionErrorMessage(error, "document information")}</p>
							<Button
								title="Retry document information"
								onClick={() => {
									void refetch();
								}}
							/>
						</div>
					)}
				</div>
			)}
			{data && documentId && (
				<>
					{/* Header */}
					<div className="flex flex-row justify-between items-start gap-3">
						<div className="flex flex-row gap-2 flex-wrap items-center">
							<BranchSwitch documentId={documentId} />
							<BadgeList document={data} />
						</div>
						<Button
							icon={IoClose}
							type="button"
							onClick={toggleDocumentInfoPopup}
							className="shrink-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
						/>
					</div>

					{/* Content */}
					<div className="flex flex-col gap-5">
						<div>
							<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
								{data.title}
							</h2>
							<div className="h-px bg-linear-to-r from-gray-200 via-gray-300 to-transparent dark:from-gray-700 dark:via-gray-600" />
						</div>
					</div>

					<InfoTabs document={data} />

					{/* Footer Actions */}
					<div className="pt-4 border-t border-gray-200 dark:border-gray-700">
						<InfoButtons documentId={documentId} />
					</div>
				</>
			)}
		</PopupWrapper>
	);
};

export default InfoPopup;

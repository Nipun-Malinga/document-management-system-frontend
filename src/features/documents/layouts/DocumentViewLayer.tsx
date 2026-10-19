import { Outlet } from "react-router-dom";
import useDocumentInfoPopUp from "@/features/documents/stores/useDocumentInfoPopup";
import { InfoPopup } from "../components/info";

const DocumentViewLayer = () => {
	const { documentId } = useDocumentInfoPopUp();

	return (
		<div className="flex min-h-0 min-w-0 flex-1 flex-col">
			<InfoPopup documentId={documentId} />
			<Outlet />
		</div>
	);
};

export default DocumentViewLayer;

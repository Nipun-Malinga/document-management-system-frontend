import { Outlet } from "react-router-dom";
import { Container } from "@/components";
import useDocumentInfoPopUp from "@/states/useDocumentInfoPopup";
import { InfoPopup } from "../components/info";

const DocumentViewLayer = () => {
	const { documentId } = useDocumentInfoPopUp();

	return (
		<Container>
			<InfoPopup documentId={documentId} />
			<Outlet />
		</Container>
	);
};

export default DocumentViewLayer;

import type { ReactNode } from "react";
import useDocumentInfoPopUp from "@/features/documents/stores/useDocumentInfoPopup";
import DocumentTileGrid from "./DocumentTileGrid";

interface Props {
	children: ReactNode;
}

const DocumentGrid = ({ children }: Props) => {
	const { collapsed, toggleDocumentInfoPopup } = useDocumentInfoPopUp();

	return (
		<div className="relative min-w-0 w-full">
			{!collapsed && (
				<button
					type="button"
					aria-label="Close document information"
					onClick={toggleDocumentInfoPopup}
					className="absolute inset-0 z-10 size-full"
				/>
			)}
			<DocumentTileGrid>{children}</DocumentTileGrid>
		</div>
	);
};

export default DocumentGrid;

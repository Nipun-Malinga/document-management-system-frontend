import type { ReactNode } from "react";

const DocumentTileGrid = ({ children }: { children: ReactNode }) => (
	<div className="@container/documents min-w-0 w-full">
		<div className="grid grid-cols-1 gap-4 @min-[28rem]/documents:grid-cols-2 @min-[48rem]/documents:grid-cols-3 @min-[68rem]/documents:grid-cols-4">
			{children}
		</div>
	</div>
);

export default DocumentTileGrid;

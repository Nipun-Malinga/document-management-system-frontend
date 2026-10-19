import { Badge } from "@/components/ui/badge";
import type { Document } from "@/features/documents/types/Document";

const BadgeList = ({ document }: { document: Document }) => (
	<div className="flex flex-wrap items-center gap-2">
		<Badge variant="secondary">
			{document.status === "PRIVATE"
				? "Private"
				: document.status === "PUBLIC"
					? "Public"
					: "Unknown"}
		</Badge>
		{document.shared && <Badge variant="outline">Shared</Badge>}
	</div>
);
export default BadgeList;

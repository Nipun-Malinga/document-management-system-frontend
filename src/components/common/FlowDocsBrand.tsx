import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

const FlowDocsBrand = () => (
	<Link
		to="/"
		aria-label="FlowDocs home"
		className="inline-flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
	>
		<span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
			<FileText aria-hidden="true" className="size-5" />
		</span>
		<span className="text-xl font-semibold tracking-tight">FlowDocs</span>
	</Link>
);

export default FlowDocsBrand;

import { ArrowLeft, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DarkThemeButton from "@/components/common/DarkThemeButton";
import { Button } from "@/components/ui/button";
import AutoSaver from "./AutoSaver";
import { InfoDrawer } from "./info";

interface Props {
	documentTitle: string;
	enableAutoSaver: boolean;
	documentId: string;
	branchId: string;
}

const TopToolBar = ({
	documentTitle,
	enableAutoSaver,
	documentId,
	branchId,
}: Props) => {
	const navigate = useNavigate();

	return (
		<header className="shrink-0 border-b border-border bg-card px-3 py-3 sm:px-6">
			<div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
				<div className="flex min-w-0 basis-full items-center gap-3 sm:basis-0 sm:flex-1">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						aria-label="Back to Home"
						title="Back to Home"
						onClick={() => navigate("/dashboard/home")}
					>
						<ArrowLeft aria-hidden="true" />
					</Button>
					<h1
						className="min-w-0 flex-1 truncate text-base font-semibold sm:text-lg"
						title={documentTitle}
					>
						{documentTitle}
					</h1>
				</div>
				<div className="order-2 ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() =>
							navigate(`/document/${documentId}/branch/${branchId}/view`)
						}
					>
						<Eye aria-hidden="true" data-icon="inline-start" />
						Preview
					</Button>
					<DarkThemeButton />
					<InfoDrawer />
				</div>
				{enableAutoSaver && (
					<div className="order-1 min-w-0 flex-1 text-muted-foreground sm:order-0 sm:flex-none">
						<AutoSaver />
					</div>
				)}
			</div>
		</header>
	);
};

export default TopToolBar;

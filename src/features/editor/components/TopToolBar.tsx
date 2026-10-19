import { ArrowLeft, Eye, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DarkThemeButton from "@/components/common/DarkThemeButton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
		<header className="shrink-0 border-b bg-card px-3 py-3 sm:px-6 lg:px-8">
			<div className="mx-auto flex min-w-0 max-w-screen-2xl flex-wrap items-center gap-x-4 gap-y-3">
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
					<Separator orientation="vertical" className="h-7" />
					<span
						aria-hidden="true"
						className="hidden size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary sm:flex"
					>
						<FileText className="size-5" strokeWidth={1.5} />
					</span>
					<div className="flex min-w-0 flex-1 flex-col gap-0.5">
						<h1
							className="truncate text-base font-semibold tracking-tight sm:text-lg"
							title={documentTitle}
						>
							{documentTitle}
						</h1>
						{enableAutoSaver && <AutoSaver />}
					</div>
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
			</div>
		</header>
	);
};

export default TopToolBar;

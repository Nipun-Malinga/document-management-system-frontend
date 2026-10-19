import { Plus } from "lucide-react";
import { type ReactNode, useId, useState } from "react";
import PopupWrapper from "@/components/common/PopupWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Templates from "./Templates";

interface Props {
	folders?: ReactNode;
	documentsTitle?: string;
	children: ReactNode;
	preview?: boolean;
	templates?: ReactNode;
	title?: string;
	resultCount?: number;
}


const WorkspaceHome = ({
	folders,
	documentsTitle = "All documents",
	children,
	preview = false,
	templates,
	title = "Your documents",
	resultCount,
}: Props) => {
	const id = useId();
	const [createOpen, setCreateOpen] = useState(false);
	const [creating, setCreating] = useState(false);
	const createButtonId = `${id}-new-document`;
	const Heading = preview ? "h2" : "h1";
	return (
		<div
			className={cn(
				"@container/workspace flex min-w-0 flex-col",
				preview ? "gap-6" : "min-h-0 flex-1 gap-8",
			)}
		>
			<div className="flex shrink-0 flex-wrap items-center justify-between gap-5">
				<div className="flex min-w-0 flex-col gap-2">
					<Heading className="text-3xl font-semibold tracking-tight text-balance @min-[40rem]/workspace:text-4xl">
						{title}
					</Heading>
					<p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
						Pick up where you left off, or start with a fresh page.
					</p>
				</div>
				<Button
					id={createButtonId}
					aria-haspopup="dialog"
					aria-expanded={createOpen}
					onClick={() => setCreateOpen(true)}
				>
					<Plus aria-hidden="true" data-icon="inline-start" />
					New document
				</Button>
			</div>
			<PopupWrapper
				collapsed={!createOpen}
				onClose={() => setCreateOpen(false)}
				title="Create a document"
				description="Choose a template to open a new document in the editor."
				returnFocusId={createButtonId}
				pending={creating}
				className="motion-reduce:animate-none"
			>
				{templates ?? <Templates onCreatingChange={setCreating} />}
			</PopupWrapper>
			{folders}
			<section
				aria-labelledby={`${id}-documents-title`}
				className={cn("flex min-w-0 flex-col gap-5", !preview && "flex-1")}
			>
				<div className="flex shrink-0 items-center gap-3">
					<h2
						id={`${id}-documents-title`}
						className="shrink-0 text-lg font-semibold tracking-tight"
					>
						{documentsTitle}
					</h2>
					{resultCount !== undefined && (
						<Badge variant="secondary" className="tabular-nums">
							{resultCount}
							<span className="sr-only"> documents</span>
						</Badge>
					)}
					<Separator className="min-w-0 flex-1" />
				</div>
				{children}
			</section>
		</div>
	);
};

export default WorkspaceHome;

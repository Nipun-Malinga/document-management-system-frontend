import { Plus } from "lucide-react";
import { type ReactNode, useId } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface Props {
	templates: ReactNode;
	folders?: ReactNode;
	documentsTitle?: string;
	children: ReactNode;
	preview?: boolean;
	createAction?: ReactNode;
	title?: string;
	resultCount?: number;
}

/** The landing preview and the authenticated home use the same composition. */
const WorkspaceHome = ({
	templates,
	folders,
	documentsTitle = "All documents",
	children,
	preview = false,
	createAction,
	title = "Your documents",
	resultCount,
}: Props) => {
	const id = useId();
	const templateId = preview ? `${id}-templates` : "templates";
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
				{createAction ?? (
					<Button asChild>
						<a href={`#${templateId}`}>
							<Plus aria-hidden="true" data-icon="inline-start" />
							New document
						</a>
					</Button>
				)}
			</div>
			{templates && (
				<section
					id={templateId}
					tabIndex={-1}
					aria-labelledby={`${id}-templates-title`}
					className="min-w-0 shrink-0 scroll-mt-6 rounded-2xl border bg-secondary/40 p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring @min-[40rem]/workspace:p-5"
				>
					<div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
						<h2
							id={`${id}-templates-title`}
							className="text-base font-semibold"
						>
							Start something new
						</h2>
						<p className="text-xs text-muted-foreground">
							Make a template your own
						</p>
					</div>
					{templates}
				</section>
			)}
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

import { Plus } from "lucide-react";
import { type ReactNode, useId } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
	templates: ReactNode;
	children: ReactNode;
	preview?: boolean;
	createAction?: ReactNode;
	title?: string;
	resultCount?: number;
}

/** The landing preview and the authenticated home use the same composition. */
const WorkspaceHome = ({
	templates,
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
				preview ? "gap-6" : "min-h-0 flex-1 gap-4",
			)}
		>
			<div className="flex shrink-0 flex-wrap items-start justify-between gap-4">
				<div className="flex min-w-0 flex-col gap-2">
					<Heading className="text-2xl font-semibold tracking-tight @min-[40rem]/workspace:text-3xl">
						{title}
					</Heading>
					<p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
						A place for your work. Room for your next idea.
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
					className="min-w-0 shrink-0 scroll-mt-6 outline-none focus-visible:ring-2 focus-visible:ring-ring"
				>
					<div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
						<h2 id={`${id}-templates-title`} className="text-sm font-semibold">
							Start something new
						</h2>
						<p className="text-xs text-muted-foreground">
							Choose a template to get started
						</p>
					</div>
					{templates}
				</section>
			)}
			<section
				aria-labelledby={`${id}-documents-title`}
				className={cn(
					"flex min-w-0 flex-col gap-3 border-t pt-4",
					!preview && "min-h-0 flex-1",
				)}
			>
				<div className="flex shrink-0 items-baseline gap-3">
					<h2
						id={`${id}-documents-title`}
						className="text-lg font-semibold tracking-tight"
					>
						All documents
					</h2>
					{resultCount !== undefined && (
						<span className="text-sm text-muted-foreground tabular-nums">
							{resultCount}
							<span className="sr-only"> documents</span>
						</span>
					)}
				</div>
				{children}
			</section>
		</div>
	);
};

export default WorkspaceHome;

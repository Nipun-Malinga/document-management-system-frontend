import type { LucideIcon } from "lucide-react";
import { type ReactNode, useId } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Props {
	title: string;
	description: string;
	count?: number;
	icon: LucideIcon;
	resultsTitle?: string;
	filters?: ReactNode;
	children: ReactNode;
}

const CollectionPage = ({
	title,
	description,
	count,
	icon: Icon,
	resultsTitle,
	filters,
	children,
}: Props) => {
	const id = useId();
	return (
		<div className="@container/collection flex min-w-0 flex-1 flex-col gap-8">
			<header className="flex shrink-0 flex-col items-start gap-4 @min-[40rem]/collection:flex-row @min-[40rem]/collection:gap-5">
				<span
					aria-hidden="true"
					className="flex size-12 shrink-0 items-center justify-center rounded-xl border bg-card text-primary @min-[40rem]/collection:size-14"
				>
					<Icon className="size-6" strokeWidth={1.5} />
				</span>
				<div className="flex min-w-0 flex-col gap-2">
					<div className="flex flex-wrap items-center gap-3">
						<h1 className="text-3xl font-semibold tracking-tight text-balance @min-[40rem]/collection:text-4xl">
							{title}
						</h1>
						{count !== undefined && (
							<Badge variant="secondary" className="tabular-nums">
								{count} {count === 1 ? "document" : "documents"}
							</Badge>
						)}
					</div>
					<p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
						{description}
					</p>
				</div>
			</header>
			{filters && (
				<section
					aria-label={`${title} controls`}
					className="min-w-0 shrink-0 rounded-2xl border bg-secondary/40 p-4 @min-[40rem]/collection:p-5"
				>
					{filters}
				</section>
			)}
			<section
				aria-labelledby={resultsTitle ? `${id}-results` : undefined}
				aria-label={resultsTitle ? undefined : `${title} collections`}
				className="flex min-w-0 flex-1 flex-col gap-5"
			>
				{resultsTitle && (
					<div className="flex items-center gap-3">
						<h2
							id={`${id}-results`}
							className="shrink-0 text-lg font-semibold tracking-tight"
						>
							{resultsTitle}
						</h2>
						<Separator className="min-w-0 flex-1" />
					</div>
				)}
				{children}
			</section>
		</div>
	);
};

export default CollectionPage;

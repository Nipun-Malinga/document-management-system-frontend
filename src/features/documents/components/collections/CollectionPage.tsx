import type { ReactNode } from "react";

interface Props {
	title: string;
	description: string;
	count?: number;
	filters?: ReactNode;
	children: ReactNode;
}

const CollectionPage = ({
	title,
	description,
	count,
	filters,
	children,
}: Props) => (
	<div className="@container/collection flex min-h-0 min-w-0 flex-1 flex-col gap-6">
		<header className="flex shrink-0 flex-col gap-2">
			<div className="flex flex-wrap items-baseline gap-3">
				<h1 className="text-2xl font-semibold tracking-tight @min-[40rem]/collection:text-3xl">
					{title}
				</h1>
				{count !== undefined && (
					<span className="text-sm text-muted-foreground tabular-nums">
						{count} {count === 1 ? "document" : "documents"}
					</span>
				)}
			</div>
			<p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
				{description}
			</p>
		</header>
		{filters && (
			<section
				aria-label={`${title} controls`}
				className="min-w-0 shrink-0 rounded-xl border bg-card p-4"
			>
				{filters}
			</section>
		)}
		<div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">{children}</div>
	</div>
);

export default CollectionPage;

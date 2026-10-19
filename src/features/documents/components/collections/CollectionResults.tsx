import { AlertCircle, SearchX } from "lucide-react";
import type { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import type { PageResponse } from "@/shared/types/PageResponse";
import { collectionErrorMessage } from "@/shared/utils/collectionUtils";

export interface CollectionQuery<T> {
	data?: PageResponse<T>;
	isPending: boolean;
	isFetching: boolean;
	isError: boolean;
	error: unknown;
	refetch: () => unknown;
}

interface Props<T> {
	query: CollectionQuery<T>;
	label: string;
	fill?: boolean;
	empty?: ReactNode;
	children: (items: T[]) => ReactNode;
}

const CollectionResults = <T,>({
	query,
	label,
	empty,
	children,
	fill = false,
}: Props<T>) => {
	const render = () => {
		if (query.isError)
			return (
				<Alert className="my-2">
					<AlertCircle aria-hidden="true" />
					<AlertTitle>Could not load {label}</AlertTitle>
					<AlertDescription className="gap-3">
						<p>{collectionErrorMessage(query.error, label)}</p>
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								void query.refetch();
							}}
							disabled={query.isFetching}
						>
							Try again
						</Button>
					</AlertDescription>
				</Alert>
			);
		if (query.isPending || !query.data)
			return (
				<div className="flex flex-col gap-4 py-2" aria-busy="true">
					<p role="status" className="text-sm text-muted-foreground">
						Loading {label}…
					</p>
					<div
						aria-hidden="true"
						className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
					>
						{["first", "second", "third"].map((key) => (
							<div
								key={key}
								className="flex flex-col gap-4 rounded-xl border bg-card p-5"
							>
								<Skeleton className="size-10" />
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-3 w-1/2" />
							</div>
						))}
					</div>
				</div>
			);
		if (!query.data.content.length && query.data.page > 0)
			return (
				<p className="my-4 text-sm text-muted-foreground">
					No {label} on this page. Use Previous to return to earlier results.
				</p>
			);
		if (!query.data.content.length)
			return (
				<>
					{empty ?? (
						<Empty className="min-h-40 border bg-card p-6 md:p-8">
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<SearchX aria-hidden="true" />
								</EmptyMedia>
								<EmptyTitle>No {label} match these filters.</EmptyTitle>
								<EmptyDescription>
									Try a different title or adjust your filters.
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					)}
				</>
			);
		return (
			<div aria-busy={query.isFetching}>{children(query.data.content)}</div>
		);
	};
	return fill ? (
		<div className="flex min-h-40 min-w-0 flex-1 flex-col overflow-y-auto">
			{render()}
		</div>
	) : (
		render()
	);
};

export default CollectionResults;

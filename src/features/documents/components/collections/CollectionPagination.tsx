import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { PageResponse } from "@/models/PageResponse";

interface Props {
	data?: Pick<
		PageResponse<unknown>,
		"page" | "totalPages" | "totalElements" | "hasPrevious" | "hasNext"
	>;
	pending: boolean;
	onPage: (page: number) => void;
	label: string;
	className?: string;
	compact?: boolean;
}

type PageItem = number | "start-ellipsis" | "end-ellipsis";

const getPageItems = (page: number, totalPages: number): PageItem[] => {
	if (totalPages <= 7)
		return Array.from({ length: totalPages }, (_, index) => index);
	const last = totalPages - 1;
	if (page <= 3) return [0, 1, 2, 3, 4, "end-ellipsis", last];
	if (page >= last - 3)
		return [0, "start-ellipsis", last - 4, last - 3, last - 2, last - 1, last];
	return [0, "start-ellipsis", page - 1, page, page + 1, "end-ellipsis", last];
};

const CollectionPagination = ({
	data,
	pending,
	onPage,
	label,
	className,
	compact = false,
}: Props) => {
	if (!data) return null;
	const currentPage = data.totalPages === 0 ? 0 : data.page + 1;
	if (compact)
		return (
			<nav
				aria-label={`${label} pagination`}
				aria-busy={pending}
				className={cn(
					"flex shrink-0 items-center justify-between gap-2 border-t pt-2",
					className,
				)}
			>
				<Button
					type="button"
					variant="outline"
					size="icon-sm"
					aria-label="Previous"
					disabled={pending || !data.hasPrevious}
					onClick={() => onPage(Math.max(0, data.page - 1))}
				>
					<ChevronLeft aria-hidden="true" />
				</Button>
				<p
					role="status"
					aria-atomic="true"
					className="text-xs text-muted-foreground tabular-nums"
				>
					<span className="sr-only">{data.totalElements} items · </span>Page{" "}
					{currentPage} of {data.totalPages}
				</p>
				<Button
					type="button"
					variant="outline"
					size="icon-sm"
					aria-label="Next"
					disabled={pending || !data.hasNext}
					onClick={() => onPage(data.page + 1)}
				>
					<ChevronRight aria-hidden="true" />
				</Button>
			</nav>
		);
	return (
		<nav
			aria-label={`${label} pagination`}
			aria-busy={pending}
			className={cn("@container/pagination mt-5 min-w-0 shrink-0", className)}
		>
			<Separator aria-hidden="true" />
			<div className="flex min-w-0 flex-col gap-3 py-4 @min-[48rem]/pagination:flex-row @min-[48rem]/pagination:items-center @min-[48rem]/pagination:justify-between">
				<p
					role="status"
					aria-atomic="true"
					className="text-sm text-muted-foreground tabular-nums"
				>
					{data.totalElements} items · Page {currentPage} of {data.totalPages}
				</p>
				<div className="flex min-w-0 items-center justify-between gap-2 @min-[34rem]/pagination:justify-end">
					<Button
						type="button"
						variant="outline"
						className="h-10"
						disabled={pending || !data.hasPrevious}
						onClick={() => onPage(Math.max(0, data.page - 1))}
					>
						<ChevronLeft aria-hidden="true" data-icon="inline-start" />
						Previous
					</Button>
					<span
						aria-hidden="true"
						className="min-w-0 truncate text-sm font-medium tabular-nums @min-[34rem]/pagination:hidden"
					>
						{data.totalPages
							? `${currentPage} / ${data.totalPages}`
							: "No pages"}
					</span>
					<ul className="hidden items-center gap-1 @min-[34rem]/pagination:flex">
						{getPageItems(data.page, data.totalPages).map((item) =>
							typeof item === "number" ? (
								<li key={item}>
									<Button
										type="button"
										size="icon-lg"
										variant={item === data.page ? "default" : "ghost"}
										aria-label={`Page ${item + 1}`}
										aria-current={item === data.page ? "page" : undefined}
										disabled={pending}
										onClick={() => {
											if (item !== data.page) onPage(item);
										}}
										className="tabular-nums"
									>
										<span className="truncate">{item + 1}</span>
									</Button>
								</li>
							) : (
								<li
									key={item}
									aria-hidden="true"
									className="flex size-10 items-center justify-center text-muted-foreground"
								>
									<MoreHorizontal className="size-4" />
								</li>
							),
						)}
					</ul>
					<Button
						type="button"
						variant="outline"
						className="h-10"
						disabled={pending || !data.hasNext}
						onClick={() => onPage(data.page + 1)}
					>
						Next
						<ChevronRight aria-hidden="true" data-icon="inline-end" />
					</Button>
				</div>
			</div>
		</nav>
	);
};

export default CollectionPagination;

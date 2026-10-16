import { SlidersHorizontal, Users } from "lucide-react";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useCollaborators from "@/hooks/document/collaboration/useCollaborators";
import useCollectionParams from "@/hooks/useCollectionParams";
import { cn } from "@/lib/utils";
import type { CollaboratorParams } from "@/models/PageResponse";
import CollectionEmpty from "../collections/CollectionEmpty";
import CollectionFilter from "../collections/CollectionFilter";
import CollectionFilters from "../collections/CollectionFilters";
import CollectionPagination from "../collections/CollectionPagination";
import CollectionResults from "../collections/CollectionResults";
import { permissionField } from "../collections/collectionFilterOptions";
import hasCollectionFilters from "../collections/hasCollectionFilters";
import CollaboratorCard from "./CollaboratorCard";

interface Props {
	documentId: string;
	actions?: ReactNode;
	children?: ReactNode;
	compact?: boolean;
	showList?: boolean;
}

const Collaborators = ({
	documentId,
	actions,
	children,
	compact = false,
	showList = true,
}: Props) => {
	const { params, update, setPage } = useCollectionParams<CollaboratorParams>(
		documentId,
		compact ? { size: 1 } : {},
	);
	const query = useCollaborators(documentId, params);
	const [filtersOpen, setFiltersOpen] = useState(false);
	const filtersId = useId();
	const filterButton = useRef<HTMLButtonElement>(null);
	const listRegion = useRef<HTMLDivElement>(null);
	const resizePage = useRef<(size: number) => void>(() => {});
	const restoreFilterFocus = useRef(false);
	useEffect(() => {
		resizePage.current = (size) => {
			if (params.size !== size) update({ size });
		};
	});
	useEffect(() => {
		if (
			!compact ||
			!showList ||
			filtersOpen ||
			!listRegion.current ||
			typeof ResizeObserver === "undefined"
		)
			return;
		const observer = new ResizeObserver(([entry]) => {
			// Compact identity rows occupy 56px, including their divider.
			resizePage.current(
				Math.max(1, Math.min(8, Math.floor(entry.contentRect.height / 56))),
			);
		});
		observer.observe(listRegion.current);
		return () => observer.disconnect();
	}, [compact, showList, filtersOpen]);
	useEffect(() => {
		if (!filtersOpen && restoreFilterFocus.current) {
			filterButton.current?.focus();
			restoreFilterFocus.current = false;
		}
	}, [filtersOpen]);
	const fields = [
		{ name: "username", label: "Exact username", maxLength: 100 },
		{ name: "email", label: "Exact email", type: "email" as const },
		permissionField,
	];
	const sorts = [
		["id,asc", "Default order"],
		["sharedUser.username,asc", "Username A–Z"],
	] as const;
	return (
		<div
			className={cn(
				"flex min-w-0 flex-col gap-4",
				compact && "info-collaborators min-h-0 flex-1 gap-3",
			)}
		>
			<div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
				<div className="flex min-w-0 flex-col gap-1.5">
					<div className="flex items-center gap-2">
						<h3 className="font-semibold">People with access</h3>
						{query.data && !query.isError && (
							<Badge variant="secondary" className="tabular-nums">
								{query.data.totalElements}
							</Badge>
						)}
					</div>
					<p
						className={cn(
							"text-sm leading-relaxed text-muted-foreground",
							compact && "sr-only",
						)}
					>
						See who can view or edit this document.
					</p>
				</div>
				<div className="flex shrink-0 items-center gap-2">
					{actions}
					{compact && (
						<Button
							ref={filterButton}
							type="button"
							variant="outline"
							size="icon-sm"
							aria-label={
								filtersOpen
									? "Close collaborator filters"
									: "Filter collaborators"
							}
							aria-expanded={filtersOpen && showList}
							aria-controls={filtersId}
							disabled={!showList}
							onClick={() => setFiltersOpen((value) => !value)}
						>
							<SlidersHorizontal aria-hidden="true" />
						</Button>
					)}
				</div>
			</div>
			{children}

			{compact ? (
				<section
					id={filtersId}
					hidden={!filtersOpen || !showList}
					className="info-collaborator-filters"
					onSubmit={() => {
						restoreFilterFocus.current = true;
						setFiltersOpen(false);
					}}
				>
					<CollectionFilters
						key={documentId}
						params={params}
						update={update}
						fields={fields}
						sorts={sorts}
						label="collaborators"
						compact
					/>
				</section>
			) : (
				<CollectionFilter
					key={documentId}
					params={params}
					update={update}
					fields={fields}
					sorts={sorts}
					label="collaborators"
				/>
			)}
			{(!compact || (showList && !filtersOpen)) && (
				<>
					<div
						ref={listRegion}
						className={
							compact
								? "flex min-h-14 flex-1 flex-col overflow-y-auto"
								: undefined
						}
					>
						<CollectionResults
							query={query}
							label="collaborators"
							empty={
								hasCollectionFilters(params) ? undefined : (
									<CollectionEmpty
										icon={Users}
										title="No collaborators yet"
										description="People invited to this document will appear here, along with their access level."
									/>
								)
							}
						>
							{(items) => (
								<ul
									aria-label="People with access"
									className="overflow-hidden rounded-xl border bg-card"
								>
									{items.map((collaborator) => (
										<li
											key={collaborator.userId}
											className="border-b last:border-b-0"
										>
											<CollaboratorCard
												collaborator={collaborator}
												compact={compact}
											/>
										</li>
									))}
								</ul>
							)}
						</CollectionResults>
					</div>
					<CollectionPagination
						compact={compact}
						className="mt-0"
						data={
							query.data ??
							(compact
								? {
										page: params.page ?? 0,
										totalPages: 0,
										totalElements: 0,
										hasPrevious: false,
										hasNext: false,
									}
								: undefined)
						}
						pending={query.isFetching}
						onPage={setPage}
						label="collaborators"
					/>
				</>
			)}
		</div>
	);
};

export default Collaborators;

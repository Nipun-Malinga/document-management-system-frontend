import { Users } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import useCollaborators from "@/hooks/document/collaboration/useCollaborators";
import useCollectionParams from "@/hooks/useCollectionParams";
import type { CollaboratorParams } from "@/models/PageResponse";
import CollectionEmpty from "../collections/CollectionEmpty";
import CollectionFilter from "../collections/CollectionFilter";
import CollectionPagination from "../collections/CollectionPagination";
import CollectionResults from "../collections/CollectionResults";
import { permissionField } from "../collections/collectionFilterOptions";
import hasCollectionFilters from "../collections/hasCollectionFilters";
import CollaboratorCard from "./CollaboratorCard";

interface Props {
	documentId: string;
	actions?: ReactNode;
	children?: ReactNode;
}

const Collaborators = ({ documentId, actions, children }: Props) => {
	const { params, update, setPage } =
		useCollectionParams<CollaboratorParams>(documentId);
	const query = useCollaborators(documentId, params);
	return (
		<div className="flex min-w-0 flex-col gap-4">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div className="flex min-w-0 flex-col gap-1.5">
					<div className="flex items-center gap-2">
						<h3 className="font-semibold">People with access</h3>
						{query.data && !query.isError && (
							<Badge variant="secondary" className="tabular-nums">
								{query.data.totalElements}
							</Badge>
						)}
					</div>
					<p className="text-sm leading-relaxed text-muted-foreground">
						See who can view or edit this document.
					</p>
				</div>
				{actions}
			</div>
			{children}

			<CollectionFilter
				key={documentId}
				params={params}
				update={update}
				fields={[
					{ name: "username", label: "Exact username", maxLength: 100 },
					{ name: "email", label: "Exact email", type: "email" },
					permissionField,
				]}
				sorts={[
					["id,asc", "Default order"],
					["sharedUser.username,asc", "Username A–Z"],
				]}
				label="collaborators"
			/>
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
								<CollaboratorCard collaborator={collaborator} />
							</li>
						))}
					</ul>
				)}
			</CollectionResults>
			<CollectionPagination
				className="mt-0"
				data={query.data}
				pending={query.isFetching}
				onPage={setPage}
				label="collaborators"
			/>
		</div>
	);
};

export default Collaborators;

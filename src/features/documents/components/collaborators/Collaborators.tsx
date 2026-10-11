import { Users } from "lucide-react";
import useCollaborators from "@/hooks/document/collaboration/useCollaborators";
import useCollectionParams from "@/hooks/useCollectionParams";
import type { CollaboratorsResponse } from "@/models/Collaborator";
import type { CollaboratorParams } from "@/models/PageResponse";
import CollectionFilters from "../collections/CollectionFilters";
import CollectionPagination from "../collections/CollectionPagination";
import CollectionResults from "../collections/CollectionResults";
import { permissionField } from "../collections/collectionFilterOptions";
import Collaborator from "./CollaboratorCard";

interface Props {
	documentId: string;
}

const collaboratorRenderer = (collaborators: CollaboratorsResponse) => {
	return (
		<div className="max-h-80 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{collaborators.content.map((collaborator) => (
					<Collaborator collaborator={collaborator} key={collaborator.userId} />
				))}
			</div>
		</div>
	);
};

const Collaborators = ({ documentId }: Props) => {
	const { params, update, setPage } =
		useCollectionParams<CollaboratorParams>(documentId);
	const query = useCollaborators(documentId, params);
	const { data } = query;
	return (
		<div className="space-y-6">
			<CollectionFilters
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
			<CollectionResults query={query} label="collaborators">
				{() => (
					<div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
									<Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
								</div>
								<div>
									<h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
										Collaborators
									</h3>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										People with access to this document
									</p>
								</div>
							</div>
							<span className="px-3 py-1 text-sm font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800">
								{data?.totalElements}
							</span>
						</div>
						{data && collaboratorRenderer(data)}
					</div>
				)}
			</CollectionResults>
			<CollectionPagination
				data={data}
				pending={query.isFetching}
				onPage={setPage}
				label="collaborators"
			/>
		</div>
	);
};

export default Collaborators;

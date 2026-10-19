import type { TrashBranchParams } from "@/features/documents/types/CollectionParams";
import type { TrashBranchWire } from "@/features/documents/types/Trash";
import useCollectionQuery from "@/shared/hooks/useCollectionQuery";

const useTrashedBranches = (params: TrashBranchParams = {}) => {
	const query = useCollectionQuery<TrashBranchWire, TrashBranchParams>(
		"/documents/trash/branches",
		["trashed_branches_own"],
		params,
		{ staleTime: 60000, refetchInterval: 600000 },
	);
	return {
		...query,
		data: query.data && {
			...query.data,
			content: query.data.content.map(({ added_date, ...trash }) => ({
				...trash,
				addedDate: added_date,
			})),
		},
	};
};

export default useTrashedBranches;

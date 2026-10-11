import useTrashBranchCount from "./useTrashBranchCount";
import useTrashDocumentCount from "./useTrashDocumentCount";

const useTrashAllCount = (): number | null => {
	const branches = useTrashBranchCount();
	const documents = useTrashDocumentCount();

	if (
		branches.isError ||
		documents.isError ||
		!branches.data ||
		!documents.data
	)
		return null;
	return branches.data.count + documents.data.count;
};

export default useTrashAllCount;

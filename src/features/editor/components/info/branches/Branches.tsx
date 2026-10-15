import { GitBranch } from "lucide-react";
import { useParams } from "react-router-dom";
import {
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import CollectionFilter from "@/features/documents/components/collections/CollectionFilter";
import CollectionPagination from "@/features/documents/components/collections/CollectionPagination";
import CollectionResults from "@/features/documents/components/collections/CollectionResults";
import {
	branchSorts,
	statusField,
} from "@/features/documents/components/collections/collectionFilterOptions";
import { useBranches } from "@/hooks/document";
import useCollectionParams from "@/hooks/useCollectionParams";
import type { BranchParams } from "@/models/PageResponse";
import InfoDrawerBody from "../InfoDrawerBody";
import BranchCard from "./BranchCard";
import BranchCreateForm from "./BranchCreateForm";

const Branches = () => {
	const { documentId } = useParams();
	const { params, update, setPage } =
		useCollectionParams<BranchParams>(documentId);
	const query = useBranches(documentId ?? "", params);

	return (
		<>
			<div className="flex shrink-0 items-start gap-3 border-y bg-secondary px-5 py-4">
				<GitBranch
					aria-hidden="true"
					className="mt-0.5 size-5 shrink-0 text-primary"
				/>
				<DrawerHeader className="p-0">
					<DrawerTitle>Branches</DrawerTitle>
					<DrawerDescription>
						Explore document branches or create a new direction from your
						current work.
					</DrawerDescription>
				</DrawerHeader>
			</div>
			<InfoDrawerBody emptyTitle="Branches" emptyDescription="">
				<BranchCreateForm />
				<CollectionFilter
					key={documentId}
					params={params}
					update={update}
					fields={[
						{ name: "branchName", label: "Exact branch name" },
						statusField,
					]}
					sorts={branchSorts}
					label="branches"
				/>
				<CollectionResults query={query} label="branches">
					{(items) => (
						<ul className="flex flex-col gap-3">
							{items.map((branch) => (
								<li key={branch.id}>
									<BranchCard branch={branch} />
								</li>
							))}
						</ul>
					)}
				</CollectionResults>
				<CollectionPagination
					data={query.data}
					pending={query.isFetching}
					onPage={setPage}
					label="branches"
				/>
			</InfoDrawerBody>
		</>
	);
};

export default Branches;

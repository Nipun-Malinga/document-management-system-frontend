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
import { useBranches } from "@/features/documents/hooks";
import type { BranchParams } from "@/features/documents/types/CollectionParams";
import useCollectionParams from "@/shared/hooks/useCollectionParams";
import InfoDrawerBody, { InfoDrawerEmpty } from "../InfoDrawerBody";
import BranchCard from "./BranchCard";
import BranchCreateForm from "./BranchCreateForm";

const Branches = () => {
	const { documentId } = useParams();
	const { params, update, setPage } =
		useCollectionParams<BranchParams>(documentId);
	const query = useBranches(documentId ?? "", params);

	return (
		<>
			<DrawerHeader className="shrink-0 gap-2 border-b bg-card px-4 py-5 text-left sm:px-6">
				<DrawerTitle className="flex items-center gap-2">
					<GitBranch
						aria-hidden="true"
						className="size-5 shrink-0 text-primary"
					/>
					Branches
				</DrawerTitle>
				<DrawerDescription>
					Explore document branches or create a new direction from your current
					work.
				</DrawerDescription>
			</DrawerHeader>
			<InfoDrawerBody emptyTitle="Branches" emptyDescription="">
				<CollectionFilter
					toolbar={<BranchCreateForm />}
					buttonLabel="Filters"
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
				<CollectionResults
					query={query}
					label="branches"
					empty={
						<InfoDrawerEmpty
							emptyTitle="No branches match these filters."
							emptyDescription=""
						/>
					}
				>
					{(items) => (
						<ul className="flex min-w-0 flex-col gap-3">
							{items.map((branch) => (
								<li key={branch.id}>
									<BranchCard branch={branch} />
								</li>
							))}
						</ul>
					)}
				</CollectionResults>
				<CollectionPagination
					className="mt-auto"
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

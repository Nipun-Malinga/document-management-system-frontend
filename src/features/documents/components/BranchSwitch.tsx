import { useEffect, useId, useRef, useState } from "react";
import { FaCodeBranch } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useBranches } from "@/hooks/document";
import useCollectionParams from "@/hooks/useCollectionParams";
import type { BranchParams } from "@/models/PageResponse";
import useDocumentBranch from "../../../states/useDocumentBranch";
import CollectionFilters from "./collections/CollectionFilters";
import CollectionPagination from "./collections/CollectionPagination";
import CollectionResults from "./collections/CollectionResults";
import { branchSorts } from "./collections/collectionFilterOptions";

interface Props {
	documentId: string;
}

const BranchSwitch = ({ documentId }: Props) => {
	const [open, setOpen] = useState(false);
	const dropdownId = useId();
	const { branchName } = useDocumentBranch();
	const navigate = useNavigate();
	const { branchId: currentBranchId } = useParams();
	const { params, update, setPage } =
		useCollectionParams<BranchParams>(documentId);
	const query = useBranches(documentId, params);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		};

		if (open) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [open]);

	// Close on Escape key
	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setOpen(false);
			}
		};

		if (open) {
			document.addEventListener("keydown", handleEscape);
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, [open]);

	return (
		<div className="relative inline-block" ref={dropdownRef}>
			<Button
				variant="outline"
				aria-expanded={open}
				aria-controls={dropdownId}
				type="button"
				onClick={() => setOpen(!open)}
				className="h-7.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-800"
			>
				<FaCodeBranch className="text-base text-gray-700 dark:text-gray-300" />
				<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
					Branches: {query.data?.totalElements ?? "…"}
				</span>
			</Button>

			<section
				id={dropdownId}
				hidden={!open}
				className={`absolute top-full left-0 bg-white dark:bg-slate-800 w-80 max-w-[calc(100vw-2rem)] mt-2 py-2 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden z-50 transition-all duration-200 ease-out ${
					open
						? "opacity-100 translate-y-0 pointer-events-auto"
						: "opacity-0 -translate-y-2 pointer-events-none"
				}`}
				aria-label="Branch selection"
			>
				<div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700">
					<p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
						Switch Branch
					</p>
				</div>

				<div className="max-h-80 overflow-y-auto px-2 py-1">
					{open && (
						<>
							<CollectionFilters
								key={documentId}
								params={params}
								update={update}
								fields={[{ name: "branchName", label: "Exact branch name" }]}
								sorts={branchSorts}
								label="branch selection"
							/>
							<CollectionResults query={query} label="branches">
								{(branches) =>
									branches.map((branch) => {
										const isActive = currentBranchId
											? currentBranchId === branch.id
											: branchName === branch.branchName;

										return (
											<button
												onClick={() => {
													setOpen(false);
													navigate(
														`/document/${branch.documentId}/branch/${branch.id}/edit`,
													);
												}}
												className={`w-full text-left px-3 py-2 my-0.5 rounded-md transition-colors ${
													isActive
														? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
														: "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
												}`}
												key={branch.id}
												type="button"
											>
												<div className="w-full flex flex-row justify-between items-center gap-2 cursor-pointer">
													<span
														className={`text-sm truncate ${
															isActive ? "font-semibold" : "font-normal"
														}`}
													>
														{branch.branchName}
													</span>
													{isActive && (
														<span className="shrink-0 w-2 h-2 rounded-full bg-emerald-500" />
													)}
												</div>
											</button>
										);
									})
								}
							</CollectionResults>
							<CollectionPagination
								data={query.data}
								pending={query.isFetching}
								onPage={setPage}
								label="branch selection"
							/>
						</>
					)}
				</div>
			</section>
		</div>
	);
};

export default BranchSwitch;

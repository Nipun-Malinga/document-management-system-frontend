import { Check, ChevronDown, GitBranch } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBranchOptions } from "@/hooks/document";
import useDocumentBranch from "@/states/useDocumentBranch";
import useDocumentInfoPopUp from "@/states/useDocumentInfoPopup";
import { collectionErrorMessage } from "@/utils/collectionUtils";

const BranchSwitch = ({ documentId }: { documentId: string }) => {
	const [open, setOpen] = useState(false);
	const { branchName } = useDocumentBranch();
	const navigate = useNavigate();
	const { branchId: currentBranchId } = useParams();
	const query = useBranchOptions(documentId);
	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm" type="button">
					<GitBranch aria-hidden="true" data-icon="inline-start" />
					Branches: {query.data?.length ?? "…"}
					<ChevronDown aria-hidden="true" data-icon="inline-end" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				aria-label="Branch selection"
				aria-labelledby={undefined}
				className="w-72 max-w-[calc(100vw-2rem)] max-h-[min(20rem,var(--radix-dropdown-menu-content-available-height))]"
			>
				<DropdownMenuLabel>Switch branch</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{query.isPending ? (
					<p className="px-2 py-3 text-sm text-muted-foreground">
						Loading branches…
					</p>
				) : query.isError ? (
					<>
						<p className="px-2 py-3 text-sm text-destructive">
							{collectionErrorMessage(query.error, "branches")}
						</p>
						<DropdownMenuGroup>
							<DropdownMenuItem
								disabled={query.isFetching}
								onSelect={(event) => {
									event.preventDefault();
									void query.refetch();
								}}
							>
								Try again
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</>
				) : query.data?.length ? (
					<DropdownMenuGroup>
						{query.data.map((branch) => {
							const isActive = currentBranchId
								? currentBranchId === branch.id
								: branchName === branch.branchName;
							return (
								<DropdownMenuItem
									key={branch.id}
									aria-current={isActive ? "true" : undefined}
									onSelect={() => {
										setOpen(false);
										const info = useDocumentInfoPopUp.getState();
										if (!info.collapsed) info.toggleDocumentInfoPopup();
										navigate(
											`/document/${branch.documentId}/branch/${branch.id}/edit`,
										);
									}}
								>
									<span className="flex-1 truncate">{branch.branchName}</span>
									{isActive && <Check aria-hidden="true" />}
								</DropdownMenuItem>
							);
						})}
					</DropdownMenuGroup>
				) : (
					<p className="px-2 py-3 text-sm text-muted-foreground">
						No branches available.
					</p>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
export default BranchSwitch;

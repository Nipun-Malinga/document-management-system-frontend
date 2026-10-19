import {
	ChevronRight,
	Folder as FolderIcon,
	FolderPlus,
	MoreHorizontal,
} from "lucide-react";
import { useId, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useFolders } from "@/features/documents/hooks/useFolders";
import {
	descendantIds,
	folderPath,
} from "@/features/documents/utils/folderTree";
import { actionError } from "@/features/editor/persistence/actionError";
import FolderDialog, { type FolderDialogAction } from "./FolderDialog";

interface Props {
	folderId: string | null;
	onNavigate: (folderId: string | null) => void;
}

const FolderEmptyState = ({ folderId }: Pick<Props, "folderId">) => (
	<Empty className="min-h-28 border p-4">
		<EmptyHeader>
			<EmptyTitle>
				{folderId ? "No nested folders" : "No folders yet"}
			</EmptyTitle>
			<EmptyDescription>
				Create a folder to organize your documents.
			</EmptyDescription>
		</EmptyHeader>
	</Empty>
);

const FolderBrowser = ({ folderId, onNavigate }: Props) => {
	const query = useFolders();
	const folders = query.data ?? [];
	const [action, setAction] = useState<FolderDialogAction | null>(null);
	const id = useId();
	const path = folderPath(folders, folderId);
	const missing = Boolean(
		folderId &&
			query.isSuccess &&
			!folders.some((folder) => folder.id === folderId),
	);
	const children = folders
		.filter((folder) => folder.parentFolderId === folderId)
		.sort((a, b) => a.name.localeCompare(b.name));
	return (
		<section
			aria-labelledby={`${id}-title`}
			className="flex min-w-0 flex-col gap-4"
		>
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h2 id={`${id}-title`} className="text-lg font-semibold tracking-tight">
					Folders
				</h2>
				<Button
					variant="outline"
					size="sm"
					disabled={!query.isSuccess || missing}
					onClick={() =>
						setAction({ type: "create", parentFolderId: folderId })
					}
				>
					<FolderPlus aria-hidden="true" data-icon="inline-start" />
					New folder
				</Button>
			</div>
			<nav aria-label="Folder path">
				<ol className="flex flex-wrap items-center gap-1 text-sm">
					<li>
						<Button
							variant="ghost"
							size="sm"
							aria-current={!folderId ? "page" : undefined}
							onClick={() => onNavigate(null)}
						>
							All documents
						</Button>
					</li>
					{path.map((folder) => (
						<li key={folder.id} className="flex min-w-0 items-center gap-1">
							<ChevronRight
								aria-hidden="true"
								className="size-4 shrink-0 text-muted-foreground"
							/>
							<Button
								variant="ghost"
								size="sm"
								className="max-w-64"
								aria-current={folder.id === folderId ? "page" : undefined}
								onClick={() => onNavigate(folder.id)}
							>
								<span className="truncate">{folder.name}</span>
							</Button>
						</li>
					))}
				</ol>
			</nav>
			{query.isError ? (
				<Alert>
					<AlertTitle>Could not load folders</AlertTitle>
					<AlertDescription>
						<p>{actionError(query.error)}</p>
						<Button
							variant="outline"
							disabled={query.isFetching}
							onClick={() => void query.refetch()}
						>
							Try again
						</Button>
					</AlertDescription>
				</Alert>
			) : query.isPending ? (
				<div className="flex flex-col gap-2">
					<span className="text-sm text-muted-foreground">
						Loading folders…
					</span>
					<Skeleton className="h-14 w-full" />
				</div>
			) : missing ? (
				<Alert>
					<AlertTitle>Folder no longer available</AlertTitle>
					<AlertDescription>
						<Button variant="outline" onClick={() => onNavigate(null)}>
							Back to all documents
						</Button>
					</AlertDescription>
				</Alert>
			) : children.length ? (
				<ul className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-3">
					{children.map((folder) => (
						<li
							key={folder.id}
							className="flex min-w-0 items-center gap-1 rounded-xl border bg-card p-2"
						>
							<Button
								variant="ghost"
								className="min-w-0 flex-1 justify-start"
								onClick={() => onNavigate(folder.id)}
							>
								<FolderIcon aria-hidden="true" data-icon="inline-start" />
								<span className="truncate">{folder.name}</span>
							</Button>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										aria-label={`Actions for folder ${folder.name}`}
									>
										<MoreHorizontal aria-hidden="true" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuGroup>
										<DropdownMenuItem
											onSelect={() =>
												setAction({ type: "create", parentFolderId: folder.id })
											}
										>
											New subfolder
										</DropdownMenuItem>
										<DropdownMenuItem
											onSelect={() => setAction({ type: "rename", folder })}
										>
											Rename
										</DropdownMenuItem>
										<DropdownMenuItem
											onSelect={() => setAction({ type: "move", folder })}
										>
											Move folder
										</DropdownMenuItem>
										<DropdownMenuItem
											variant="destructive"
											onSelect={() => setAction({ type: "delete", folder })}
										>
											Delete permanently
										</DropdownMenuItem>
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</li>
					))}
				</ul>
			) : (
				<FolderEmptyState folderId={folderId} />
			)}
			{action && (
				<FolderDialog
					action={action}
					folders={folders}
					onClose={() => setAction(null)}
					onDeleted={(deletedId) => {
						if (folderId && descendantIds(folders, deletedId).has(folderId))
							onNavigate(null);
					}}
				/>
			)}
		</section>
	);
};

export default FolderBrowser;

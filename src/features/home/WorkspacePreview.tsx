import {
	ArrowLeft,
	ArrowUpRight,
	Bookmark,
	FileText,
	Info,
	Plus,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchInput from "@/components/common/SearchInput";
import { workspaceNavigationClass } from "@/components/layout/workspaceNavigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { sidebarData } from "@/data/Sidebar";
import CollectionPagination from "@/features/documents/components/collections/CollectionPagination";
import DocumentTile from "@/features/documents/components/DocumentTile";
import DocumentTileGrid from "@/features/documents/components/DocumentTileGrid";
import TemplateTile from "@/features/documents/components/TemplateTile";
import WorkspaceHome from "@/features/documents/components/WorkspaceHome";
import type { Document } from "@/features/documents/types/Document";
import { cn } from "@/lib/utils";

const sampleDocuments: Document[] = [
	{
		id: "brief",
		title: "The next chapter",
		ownerId: 1,
		status: "PRIVATE",
		shared: false,
		mainBranchId: "main",
		branchCount: 2,
		updatedAt: "2026-10-14T10:00:00Z",
		createdAt: "2026-10-12T10:00:00Z",
		trashed: false,
		favorite: true,
	},
	{
		id: "playbook",
		title: "Team playbook",
		ownerId: 1,
		status: "PRIVATE",
		shared: true,
		mainBranchId: "main",
		branchCount: 1,
		updatedAt: "2026-10-13T10:00:00Z",
		createdAt: "2026-10-12T10:00:00Z",
		trashed: false,
		favorite: false,
	},
	{
		id: "ideas",
		title: "Ideas worth exploring",
		ownerId: 1,
		status: "PUBLIC",
		shared: false,
		mainBranchId: "main",
		branchCount: 3,
		updatedAt: "2026-10-12T10:00:00Z",
		createdAt: "2026-10-12T10:00:00Z",
		trashed: false,
		favorite: false,
	},
	{
		id: "shared",
		title: "Launch notes",
		ownerId: 2,
		status: "PRIVATE",
		shared: true,
		mainBranchId: "main",
		branchCount: 1,
		updatedAt: "2026-10-14T10:00:00Z",
		createdAt: "2026-10-12T10:00:00Z",
		trashed: false,
		favorite: false,
	},
];
const sampleContent: Record<string, string> = {
	brief:
		"A shared space to turn our best ideas into something worth building. Let’s start with what matters.",
	playbook:
		"A few shared habits make great work possible. Share context before starting a draft, invite the people closest to the work, and leave a clear history for the next person.",
	ideas:
		"Not every idea needs an answer yet. Collect the questions, explore a new branch, and see where the work takes us.",
	shared:
		"Keep the team connected as we prepare for launch. Capture decisions, open questions, and the next steps in one place.",
};

const WorkspacePreview = () => {
	const [documents, setDocuments] = useState(sampleDocuments);
	const [collection, setCollection] = useState("home");
	const [search, setSearch] = useState("");
	const [selected, setSelected] = useState<Document | null>(null);
	const detailHeading = useRef<HTMLHeadingElement>(null);
	const returnTarget = useRef("");
	const id = useId();
	const navigate = useNavigate();
	const owned = documents.filter((document) => document.ownerId === 1);
	const bookmarked = owned.filter((document) => document.favorite);
	const shared = documents.filter(
		(document) => document.ownerId !== 1 && document.shared,
	);
	const navigation = sidebarData({
		documents: owned.length,
		quick: bookmarked.length,
		resents: owned.length,
		shared: shared.length,
		trash: 0,
	});
	const collectionDocuments =
		collection === "quick"
			? bookmarked
			: collection === "shared"
				? shared
				: collection === "trash"
					? []
					: owned;
	const visible = collectionDocuments.filter(
		(document) => !search.trim() || document.title === search.trim(),
	);
	const currentTitle =
		navigation.find((item) => item.endpoint === collection)?.title ?? "Home";
	const openSample = (document: Document, button: HTMLButtonElement) => {
		returnTarget.current = button.id;
		setSelected(document);
	};
	useEffect(() => {
		if (selected) detailHeading.current?.focus();
		else if (returnTarget.current) {
			document.getElementById(returnTarget.current)?.focus();
			returnTarget.current = "";
		}
	}, [selected]);

	return (
		<figure
			aria-label="Interactive FlowDocs workspace preview"
			className="home-preview min-w-0"
		>
			<div className="@container/preview overflow-hidden rounded-xl border bg-background">
				<div className="flex h-16 items-center justify-between gap-3 border-b bg-card px-4 py-3">
					<div className="flex min-w-0 items-center gap-2 text-sm font-semibold">
						<FileText
							aria-hidden="true"
							className="size-5 shrink-0 text-primary"
						/>
						FlowDocs
						<span aria-hidden="true" className="text-border">
							/
						</span>
						<span className="truncate font-normal text-muted-foreground">
							{currentTitle}
						</span>
					</div>
					<Badge variant="outline" className="shrink-0">
						Sample workspace
					</Badge>
				</div>
				<div className="grid min-w-0 @min-[40rem]/preview:grid-cols-[10rem_minmax(0,1fr)]">
					<nav
						aria-label="Preview workspace navigation"
						className="flex min-w-0 gap-1 overflow-x-auto border-b bg-card p-2 @min-[40rem]/preview:flex-col @min-[40rem]/preview:overflow-x-visible @min-[40rem]/preview:border-r @min-[40rem]/preview:border-b-0 @min-[40rem]/preview:p-3"
					>
						{navigation.map((item) => (
							<button
								key={item.endpoint}
								type="button"
								aria-current={collection === item.endpoint ? "page" : undefined}
								onClick={() => {
									setCollection(item.endpoint);
									setSearch("");
									setSelected(null);
								}}
								className={cn(
									workspaceNavigationClass(collection === item.endpoint),
									"w-auto shrink-0 gap-2 text-xs @min-[40rem]/preview:w-full",
								)}
							>
								<item.icon aria-hidden="true" className="size-4 shrink-0" />
								<span className="flex-1 whitespace-nowrap">{item.title}</span>
								<span className="tabular-nums">{item.count}</span>
							</button>
						))}
					</nav>
					<div className="home-preview-panel p-4 @min-[40rem]/preview:p-5">
						{selected ? (
							<article className="flex flex-col gap-5">
								<Button
									variant="ghost"
									className="w-fit"
									onClick={() => setSelected(null)}
								>
									<ArrowLeft aria-hidden="true" data-icon="inline-start" />
									Back to documents
								</Button>
								<Badge variant="outline" className="w-fit">
									Sample document · Read only
								</Badge>
								<h2
									ref={detailHeading}
									tabIndex={-1}
									className="text-2xl font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring"
								>
									{selected.title}
								</h2>
								<p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
									{sampleContent[selected.id]}
								</p>
								<Button asChild className="w-fit">
									<Link to="/auth/registration">
										Create your own document
										<ArrowUpRight aria-hidden="true" data-icon="inline-end" />
									</Link>
								</Button>
							</article>
						) : (
							<WorkspaceHome
								preview
								resultCount={visible.length}
								title={collection === "home" ? "Your documents" : currentTitle}
								createAction={
									<Button asChild>
										<Link to="/auth/registration">
											<Plus aria-hidden="true" data-icon="inline-start" />
											New document
										</Link>
									</Button>
								}
								templates={
									collection === "home" && (
										<ul className="flex gap-3 overflow-x-auto pb-2">
											{["Blank document", "Project brief", "Meeting notes"].map(
												(title) => (
													<li key={title} className="w-56 shrink-0">
														<TemplateTile
															title={title}
															aria-label={`Create document from ${title}`}
															onClick={() => navigate("/auth/registration")}
														/>
													</li>
												),
											)}
										</ul>
									)
								}
							>
								<div className="flex flex-col gap-2">
									<SearchInput value={search} output={setSearch} />
									<p className="text-sm text-muted-foreground">
										Matches the full document title.
									</p>
								</div>
								{visible.length ? (
									<DocumentTileGrid>
										{visible.map((document) => (
											<DocumentTile
												key={document.id}
												document={document}
												actions={
													<>
														{document.ownerId === 1 && (
															<Toggle
																size="sm"
																aria-label={`Bookmark ${document.title}`}
																pressed={document.favorite}
																onPressedChange={() =>
																	setDocuments((current) =>
																		current.map((item) =>
																			item.id === document.id
																				? { ...item, favorite: !item.favorite }
																				: item,
																		),
																	)
																}
															>
																<Bookmark
																	aria-hidden="true"
																	fill={
																		document.favorite ? "currentColor" : "none"
																	}
																/>
															</Toggle>
														)}
														<Button
															id={`${id}-${document.id}-info`}
															variant="ghost"
															size="icon"
															aria-label={`Information about ${document.title}`}
															onClick={(event) =>
																openSample(document, event.currentTarget)
															}
														>
															<Info aria-hidden="true" />
														</Button>
													</>
												}
												openAction={
													<Button
														id={`${id}-${document.id}-open`}
														variant="ghost"
														size="sm"
														aria-label={`Open ${document.title}`}
														onClick={(event) =>
															openSample(document, event.currentTarget)
														}
													>
														Open
														<ArrowUpRight
															aria-hidden="true"
															data-icon="inline-end"
														/>
													</Button>
												}
											/>
										))}
									</DocumentTileGrid>
								) : (
									<div
										role="status"
										className="flex flex-col items-start gap-3 py-6 text-sm text-muted-foreground"
									>
										<p>
											{search.trim()
												? "No documents match this exact title."
												: collection === "quick"
													? "Bookmark a document to keep it in Quick Access."
													: collection === "trash"
														? "Your sample trash is empty."
														: "No sample documents in this collection."}
										</p>
										{search && (
											<Button variant="outline" onClick={() => setSearch("")}>
												Clear search
											</Button>
										)}
									</div>
								)}
								<CollectionPagination
									data={{
										page: 0,
										totalPages: visible.length ? 1 : 0,
										totalElements: visible.length,
										hasPrevious: false,
										hasNext: false,
									}}
									pending={false}
									onPage={() => {}}
									label="sample documents"
								/>
							</WorkspaceHome>
						)}
					</div>
				</div>
			</div>
			<figcaption className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
				An interactive preview with sample content. Explore collections,
				bookmarks, and documents.
			</figcaption>
		</figure>
	);
};

export default WorkspacePreview;

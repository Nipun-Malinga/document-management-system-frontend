import type { Content } from "@tiptap/core";
import axios from "axios";
import { AlertCircle, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCreateDocument, useGetTemplates } from "@/features/documents/hooks";
import type { TemplateParams } from "@/features/documents/types/CollectionParams";
import useEditorTemplate from "@/features/editor/stores/useEditorTemplate";
import { convertToTiptapContent } from "@/features/editor/utils";
import useCollectionParams from "@/shared/hooks/useCollectionParams";
import type { ProblemDetail } from "@/shared/types/ProblemDetail";
import CollectionFilters from "./collections/CollectionFilters";
import CollectionPagination from "./collections/CollectionPagination";
import CollectionResults from "./collections/CollectionResults";
import TemplateTile from "./TemplateTile";

interface Props {
	onCreatingChange?: (creating: boolean) => void;
}

const Templates = ({ onCreatingChange }: Props) => {
	const { params, update, setPage } = useCollectionParams<TemplateParams>();
	const query = useGetTemplates(params);
	const [creationError, setCreationError] = useState("");
	const creating = useRef(false);
	const { mutateAsync, isPending, variables } = useCreateDocument();
	const setTemplate = useEditorTemplate((state) => state.setTemplate);
	const navigate = useNavigate();

	const createDocument = async (
		templateId: number,
		name: string,
		content: Content,
	) => {
		if (creating.current) return;
		creating.current = true;
		onCreatingChange?.(true);
		setCreationError("");
		try {
			const doc = await mutateAsync({
				title: name,
				status: "PUBLIC",
				templateId,
			});
			setTemplate({ id: templateId, title: name, template: content });
			await navigate(`/document/${doc.id}/branch/${doc.mainBranchId}/edit`);
		} catch (error) {
			const detail = axios.isAxiosError<ProblemDetail>(error)
				? error.response?.data?.detail
				: undefined;
			setCreationError(
				typeof detail === "string" && detail.trim()
					? detail
					: "Could not create the document. Choose a template to try again.",
			);
		} finally {
			creating.current = false;
			onCreatingChange?.(false);
		}
	};

	return (
		<div
			className="@container/templates flex min-w-0 flex-col gap-4"
			aria-busy={isPending}
		>
			<p aria-live="polite" className="sr-only">
				{isPending ? "Creating your document. Please wait." : ""}
			</p>
			{creationError && (
				<Alert variant="destructive">
					<AlertCircle aria-hidden="true" />
					<AlertTitle>Document could not be created</AlertTitle>
					<AlertDescription>{creationError}</AlertDescription>
				</Alert>
			)}
			<details className="group/options rounded-lg border bg-card px-4">
				<summary className="flex min-h-11 cursor-pointer list-none flex-wrap items-center gap-2 rounded-sm py-3 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
					<SlidersHorizontal aria-hidden="true" className="size-4" />
					<span className="font-medium text-foreground">Template options</span>
					{query.data && (
						<span className="text-xs tabular-nums">
							{query.data.totalElements} available
						</span>
					)}
					<ChevronDown
						aria-hidden="true"
						className="ml-auto size-4 group-open/options:rotate-180"
					/>
				</summary>
				<CollectionFilters
					params={params}
					update={update}
					fields={[
						{ name: "title", label: "Exact template title", maxLength: 30 },
					]}
					sorts={[
						["id,asc", "Default order"],
						["title,asc", "Title A–Z"],
					]}
					label="templates"
				/>
			</details>
			<CollectionResults query={query} label="templates">
				{(templates) => (
					<ul
						aria-label="Document templates"
						className="grid grid-cols-1 gap-4 @min-[20rem]/templates:grid-cols-2 @min-[36rem]/templates:grid-cols-3"
					>
						{templates.map((template) => (
							<li key={template.id} className="min-w-0">
								<TemplateTile
									type="button"
									title={template.title}
									aria-label={`Create document from ${template.title}`}
									disabled={isPending}
									creating={isPending && variables?.templateId === template.id}
									onClick={() => {
										void createDocument(
											template.id,
											template.title,
											convertToTiptapContent(template.template),
										);
									}}
								/>
							</li>
						))}
					</ul>
				)}
			</CollectionResults>
			{query.data && (query.data.totalPages > 1 || query.data.page > 0) && (
				<CollectionPagination
					data={query.data}
					pending={query.isFetching}
					onPage={setPage}
					label="templates"
				/>
			)}
		</div>
	);
};

export default Templates;

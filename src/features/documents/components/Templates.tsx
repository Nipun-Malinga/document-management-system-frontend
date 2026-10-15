import type { Content } from "@tiptap/core";
import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { convertToTiptapContent } from "@/features/editor/utils";
import { useCreateDocument } from "@/hooks/document";
import { useGetTemplates } from "@/hooks/templates";
import useCollectionParams from "@/hooks/useCollectionParams";
import type { TemplateParams } from "@/models/PageResponse";
import type { ProblemDetail } from "@/models/ProblemDetail";
import useEditorTemplate from "@/states/useEditorTemplate";
import CollectionFilters from "./collections/CollectionFilters";
import CollectionPagination from "./collections/CollectionPagination";
import CollectionResults from "./collections/CollectionResults";
import TemplateTile from "./TemplateTile";

const Templates = () => {
	const { params, update, setPage } = useCollectionParams<TemplateParams>();
	const query = useGetTemplates(params);
	const [creationError, setCreationError] = useState("");
	const creating = useRef(false);
	const { mutateAsync, isPending } = useCreateDocument();
	const { setTemplate } = useEditorTemplate();
	const navigate = useNavigate();

	const createDocument = async (
		templateId: number,
		name: string,
		content: Content,
	) => {
		if (creating.current) return;
		creating.current = true;
		setCreationError("");
		try {
			const doc = await mutateAsync({
				title: name,
				status: "PUBLIC",
				templateId,
			});
			setTemplate({ id: templateId, title: name, template: content });
			navigate(`/document/${doc.id}/branch/${doc.mainBranchId}/edit`);
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
		}
	};

	return (
		<>
			{creationError && (
				<p role="alert" className="my-3 text-sm text-destructive">
					{creationError}
				</p>
			)}
			{isPending && (
				<p role="status" className="my-3 text-sm text-muted-foreground">
					Creating document…
				</p>
			)}
			<CollectionResults query={query} label="templates">
				{(templates) => (
					<ul className="flex gap-3 overflow-x-auto pb-2">
						{templates.map((template) => (
							<li key={template.id} className="w-56 shrink-0">
								<TemplateTile
									type="button"
									title={template.title}
									aria-label={`Create document from ${template.title}`}
									disabled={isPending}
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
			<details className="text-sm">
				<summary className="w-fit cursor-pointer rounded-sm text-muted-foreground underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">
					Template options
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
			{query.data && (query.data.totalPages > 1 || query.data.page > 0) && (
				<CollectionPagination
					data={query.data}
					pending={query.isFetching}
					onPage={setPage}
					label="templates"
				/>
			)}
		</>
	);
};

export default Templates;

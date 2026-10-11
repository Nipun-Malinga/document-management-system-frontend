import useCollectionQuery from "@/hooks/useCollectionQuery";
import type { TemplateParams } from "@/models/PageResponse";
import type { TemplateResponse } from "@/models/Template";

const useGetTemplates = (params: TemplateParams = {}) =>
	useCollectionQuery<TemplateResponse, TemplateParams>(
		`/documents/templates`,
		["templates"],
		params,
		{},
	);

export default useGetTemplates;

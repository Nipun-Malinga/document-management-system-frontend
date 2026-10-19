import type { TemplateParams } from "@/features/documents/types/CollectionParams";
import type { TemplateResponse } from "@/features/documents/types/Template";
import useCollectionQuery from "@/shared/hooks/useCollectionQuery";

const useGetTemplates = (params: TemplateParams = {}) =>
	useCollectionQuery<TemplateResponse, TemplateParams>(
		`/documents/templates`,
		["templates"],
		params,
		{},
	);

export default useGetTemplates;

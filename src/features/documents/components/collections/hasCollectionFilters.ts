export const countCollectionFilters = (
	params: object,
	ignored: readonly string[] = [],
) =>
	Object.entries(params).filter(
		([key, value]) =>
			!["page", "size", "sort", ...ignored].includes(key) &&
			value !== undefined &&
			value !== "",
	).length;

const hasCollectionFilters = (
	params: object,
	ignored: readonly string[] = [],
) => countCollectionFilters(params, ignored) > 0;

export default hasCollectionFilters;

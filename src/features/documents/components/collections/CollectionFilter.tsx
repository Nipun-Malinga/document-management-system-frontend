import type { ReactNode } from "react";
import type { PageParams } from "@/shared/types/PageResponse";
import CollectionFilterPanel from "./CollectionFilterPanel";
import CollectionFilters, {
	type CollectionFiltersProps,
} from "./CollectionFilters";
import { countCollectionFilters } from "./hasCollectionFilters";

interface Props<P extends PageParams> extends CollectionFiltersProps<P> {
	toolbar?: ReactNode;
	buttonLabel?: string;
}

/** Configurable filter form, disclosure, and applied count for any collection. */
const CollectionFilter = <P extends PageParams>({
	toolbar,
	buttonLabel,
	className,
	...filters
}: Props<P>) => (
	<CollectionFilterPanel
		toolbar={toolbar}
		label={buttonLabel}
		className={className}
		activeCount={countCollectionFilters(filters.params)}
	>
		<CollectionFilters {...filters} />
	</CollectionFilterPanel>
);

export default CollectionFilter;

import { useState } from "react";
import type { PageParams } from "@/models/PageResponse";

const useCollectionParams = <P extends PageParams>(
	scope = "",
	defaults = {} as P,
) => {
	const [state, setState] = useState({
		scope,
		params: { ...defaults, page: 0 } as P,
	});
	const params =
		state.scope === scope ? state.params : ({ ...defaults, page: 0 } as P);
	const update = (patch: Partial<P>) =>
		setState({ scope, params: { ...params, ...patch, page: 0 } });
	const setPage = (page: number) =>
		setState({ scope, params: { ...params, page } });
	return { params, update, setPage };
};

export default useCollectionParams;

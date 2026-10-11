import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import ErrorPage from "@/pages/Error";

export default function RootErrorBoundary() {
	const error = useRouteError();

	if (isRouteErrorResponse(error)) {
		return <ErrorPage error={error.data} status={error.status} />;
	}

	return <h1>Unknown Error</h1>;
}

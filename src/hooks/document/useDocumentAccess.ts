import { useUser } from "@/hooks/user";
import { useSessionStore } from "@/states/sessionStore";
import { useValidatePermissions } from "./collaboration";
import useDocument from "./useDocument";

// Mutations fail closed while access is being checked or after a failed check.
// Never authorize using a response for a different user/document/branch.
const useDocumentAccess = (documentId: string, branchId: string) => {
	const user = useUser();
	const authenticated = useSessionStore(
		(state) => state.status === "authenticated",
	);
	const document = useDocument(documentId);
	const permissions = useValidatePermissions(documentId, branchId);
	const permission = permissions.data;
	const valid = Boolean(
		user &&
			documentId &&
			branchId &&
			permission?.userId === user.id &&
			permission.documentId === documentId &&
			permission.branchId === branchId &&
			!permissions.isError,
	);
	const canRead =
		valid &&
		(permission?.permission === "READ_ONLY" ||
			permission?.permission === "READ_WRITE" ||
			permission?.permission === "ADMIN");
	const canWrite =
		authenticated &&
		canRead &&
		!permissions.isFetching &&
		(permission?.permission === "READ_WRITE" ||
			permission?.permission === "ADMIN");

	return {
		canRead,
		error: permissions.error,
		retry: permissions.refetch,
		canWrite,
		isOwner: Boolean(
			authenticated &&
				canRead &&
				!permissions.isFetching &&
				user &&
				!document.isError &&
				!document.isFetching &&
				document.data?.id === documentId &&
				document.data.ownerId === user.id,
		),
		isPending: permissions.isPending,
		isError: permissions.isError,
	};
};

export default useDocumentAccess;

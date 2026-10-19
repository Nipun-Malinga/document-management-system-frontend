import type { Collaborator } from "@/features/documents/types/Collaborator";
import type { CollaboratorParams } from "@/features/documents/types/CollectionParams";
import useCollectionQuery from "@/shared/hooks/useCollectionQuery";

const useCollaborators = (
	documentId: string,
	params: CollaboratorParams = {},
) =>
	useCollectionQuery<Collaborator, CollaboratorParams>(
		`/documents/${documentId}/share/users`,
		["collaborators", documentId],
		params,
		{ enabled: Boolean(documentId), staleTime: 60000 },
	);

export default useCollaborators;

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePersistenceRegistry } from "@/features/editor/persistence/persistenceRegistry";
import type { Document } from "@/models/Document";
import type { ShareDocumentRequest } from "@/models/SharedDocument";
import APIService from "@/services/apiService";
import { assertSession, getSession } from "@/states/sessionStore";
import { refreshDocumentMutation } from "../documentMutationCache";

const useShareDocument = (documentId: string) => {
	const epoch = getSession().epoch;
	const service = new APIService<ShareDocumentRequest>(
		`/documents/${documentId}/share`,
	);
	const metadata = new APIService<Document>(`/documents/${documentId}`);
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["shareDocument", documentId],
		retry: false,
		mutationFn: async (request: ShareDocumentRequest) => {
			const document = await metadata.get();
			assertSession(epoch);
			if (document.ownerId !== getSession().user?.id)
				throw new Error("Only the document owner can grant access.");
			const share = async () => {
				const result = await service.post(request);
				assertSession(epoch);
				// Pause a mounted solo editor even if a subsequent metadata refresh fails.
				queryClient.setQueryData<Document>(["document", documentId], {
					...document,
					shared: true,
				});
				await refreshDocumentMutation(queryClient, "share", documentId, epoch);
				return result;
			};
			const active = usePersistenceRegistry.getState().active;
			if (
				active?.epoch === epoch &&
				active.documentId === documentId &&
				active.mode === "solo"
			) {
				if (!active.coordinator)
					throw new Error("The document editor is still preparing. Try again.");
				const coordinator = active.coordinator;
				return coordinator.exclusive(async () => {
					await coordinator.flush();
					coordinator.assertWritable();
					return share();
				});
			}
			return share();
		},
	});
};
export default useShareDocument;

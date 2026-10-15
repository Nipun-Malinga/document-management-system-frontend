import { LoaderCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { actionError } from "@/features/editor/persistence/actionError";
import { useDocument } from "@/hooks/document";
import useTrashDocument from "@/hooks/document/useTrashDocument";
import { useUser } from "@/hooks/user";
import useDocumentInfoPopUp from "@/states/useDocumentInfoPopup";

interface Props {
	documentId: string;
}

const InfoButtons = ({ documentId }: Props) => {
	const {
		mutateAsync,
		isPending,
		isError: mutationError,
		error,
	} = useTrashDocument(documentId);
	const user = useUser();
	const { data, isError, isFetching } = useDocument(documentId);
	const isOwner = Boolean(
		user &&
			!isError &&
			!isFetching &&
			data?.id === documentId &&
			data.ownerId === user.id,
	);

	if (!isOwner) return null;

	return (
		<div className="flex flex-col gap-4">
			<Separator />
			<div className="flex flex-wrap items-center justify-between gap-3">
				<p className="text-xs text-muted-foreground">
					Move this document to Trash.
				</p>
				<Button
					type="button"
					variant="outline"
					className="text-destructive hover:bg-destructive/10 hover:text-destructive"
					size="sm"
					disabled={isPending}
					onClick={() => {
						if (!isOwner) return;
						void mutateAsync()
							.then(() => {
								const popup = useDocumentInfoPopUp.getState();
								if (!popup.collapsed && popup.documentId === documentId)
									popup.toggleDocumentInfoPopup();
							})
							.catch(() => {});
					}}
				>
					{isPending ? (
						<LoaderCircle
							aria-hidden="true"
							data-icon="inline-start"
							className="animate-spin motion-reduce:animate-none"
						/>
					) : (
						<Trash2 aria-hidden="true" data-icon="inline-start" />
					)}
					{isPending ? "Moving…" : "Move to Trash"}
				</Button>
			</div>
			{mutationError && (
				<p role="alert" className="text-sm text-destructive">
					{actionError(error)}
				</p>
			)}
		</div>
	);
};

export default InfoButtons;

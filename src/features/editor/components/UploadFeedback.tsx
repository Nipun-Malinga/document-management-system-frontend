import type { Editor } from "@tiptap/react";
import { useCallback, useSyncExternalStore } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { subscribeUploads, uploadMessage } from "../handlers/uploadFeedback";

const UploadFeedback = ({ editor }: { editor: Editor }) => {
	const subscribe = useCallback(
		(listener: () => void) => subscribeUploads(editor, listener),
		[editor],
	);
	const message = useSyncExternalStore(subscribe, () => uploadMessage(editor));
	return message ? (
		<Alert
			variant="destructive"
			className="shrink-0 rounded-none border-x-0 border-t-0"
		>
			<AlertDescription>{message}</AlertDescription>
		</Alert>
	) : null;
};
export default UploadFeedback;

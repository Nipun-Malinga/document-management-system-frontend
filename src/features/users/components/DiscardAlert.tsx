import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const DiscardAlert = ({
	onKeepEditing,
	onDiscard,
}: {
	onKeepEditing: () => void;
	onDiscard: () => void;
}) => (
	<Alert>
		<AlertTitle>Discard unsaved changes?</AlertTitle>
		<AlertDescription>
			Your profile edits and password entries have not been saved.
			<div className="mt-2 flex flex-wrap gap-2">
				<Button variant="outline" autoFocus onClick={onKeepEditing}>
					Keep editing
				</Button>
				<Button variant="destructive" onClick={onDiscard}>
					Discard changes
				</Button>
			</div>
		</AlertDescription>
	</Alert>
);

export default DiscardAlert;

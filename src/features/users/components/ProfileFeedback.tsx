import { Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ProfileFeedback = ({
	message,
	error = false,
}: {
	message: string;
	error?: boolean;
}) =>
	message ? (
		<Alert
			variant={error ? "destructive" : "default"}
			role={error ? "alert" : "status"}
		>
			{!error && <Check aria-hidden="true" />}
			<AlertDescription>{message}</AlertDescription>
		</Alert>
	) : null;

export default ProfileFeedback;

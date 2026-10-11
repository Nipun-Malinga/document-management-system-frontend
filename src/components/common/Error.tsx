import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

interface Props {
	error: string;
}

const ErrorAlert = ({ error }: Props) => {
	return (
		<Alert variant="destructive" className="relative">
			<AlertCircleIcon />
			<AlertDescription>{error}</AlertDescription>
		</Alert>
	);
};

export default ErrorAlert;

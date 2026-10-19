import { FileWarning } from "lucide-react";
import type { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export const EditorLoading = ({ message }: { message: string }) => (
	<div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 py-8 sm:px-8 sm:py-12">
		<p
			role="status"
			className="mx-auto w-full max-w-3xl text-sm text-muted-foreground"
		>
			{message}
		</p>
		<div
			aria-hidden="true"
			className="mx-auto flex min-h-80 w-full max-w-3xl flex-col gap-5 rounded-lg border bg-card p-6 sm:p-12"
		>
			<Skeleton className="mb-3 h-8 w-2/3" />
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-4/5" />
		</div>
	</div>
);

export const EditorError = ({
	message,
	children,
}: {
	message: string;
	children?: ReactNode;
}) => (
	<div className="min-h-0 flex-1 overflow-y-auto px-4 py-8 sm:px-8 sm:py-12">
		<Alert variant="destructive" className="mx-auto max-w-2xl">
			<FileWarning aria-hidden="true" />
			<AlertTitle>Document unavailable</AlertTitle>
			<AlertDescription className="gap-4">
				<p>{message}</p>
				{children}
			</AlertDescription>
		</Alert>
	</div>
);

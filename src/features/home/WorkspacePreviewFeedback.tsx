import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function WorkspacePreviewLoading() {
	return (
		<div
			role="status"
			aria-label="Loading workspace preview"
			className="home-preview-placeholder overflow-hidden rounded-xl border bg-card"
		>
			<div aria-hidden="true" className="flex flex-col gap-6 p-5 sm:p-8">
				<Skeleton className="h-5 w-36" />
				<div className="flex items-center justify-between gap-6">
					<Skeleton className="h-8 w-48" />
					<Skeleton className="h-10 w-28" />
				</div>
				<Skeleton className="h-20 w-full" />
				<Skeleton className="h-10 w-full" />
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<Skeleton className="h-48" />
					<Skeleton className="hidden h-48 sm:block" />
					<Skeleton className="hidden h-48 sm:block" />
				</div>
			</div>
			<span className="sr-only">Loading workspace preview…</span>
		</div>
	);
}

export function WorkspacePreviewError() {
	return (
		<div className="home-preview-placeholder flex items-center justify-center rounded-xl border bg-card p-5 sm:p-8">
			<Alert className="max-w-lg">
				<AlertCircle aria-hidden="true" />
				<AlertTitle>The workspace preview couldn't load</AlertTitle>
				<AlertDescription>
					<p>Check your connection and reload the page to try again.</p>
					<Button asChild variant="outline" className="mt-3 w-fit">
						<a href="/">Reload page</a>
					</Button>
				</AlertDescription>
			</Alert>
		</div>
	);
}

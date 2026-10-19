import { FileText, GitBranch, Globe, LockKeyhole, Users } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Document } from "@/features/documents/types/Document";
import { cn } from "@/lib/utils";

interface Props {
	document: Document;
	actions?: ReactNode;
	openAction: ReactNode;
	error?: ReactNode;
	disabled?: boolean;
}

const dateFormat = new Intl.DateTimeFormat("en", {
	day: "numeric",
	month: "short",
	year: "numeric",
});

/** Presentation only: real documents and sample documents share this card. */
const DocumentTile = ({
	document,
	actions,
	openAction,
	error,
	disabled,
}: Props) => {
	const date = new Date(document.updatedAt);
	const validDate = !Number.isNaN(date.getTime());
	const VisibilityIcon = document.status === "PRIVATE" ? LockKeyhole : Globe;
	return (
		<Card
			className={cn(
				"min-w-0 gap-4 overflow-hidden py-0 shadow-none transition-colors hover:border-primary/50 focus-within:border-primary/50",
				disabled && "pointer-events-none",
			)}
		>
			<CardHeader className="gap-4 px-5 pt-5">
				<span
					aria-hidden="true"
					className="flex h-14 w-11 items-center justify-center rounded-md border bg-secondary/50 text-primary"
				>
					<FileText className="size-6" strokeWidth={1.5} />
				</span>
				{actions && (
					<CardAction className="flex items-center gap-0.5">
						{actions}
					</CardAction>
				)}
				<CardTitle className="col-span-full">
					<h3 className="line-clamp-2 min-h-12 wrap-break-word text-base leading-6">
						{document.title}
					</h3>
				</CardTitle>
				<CardDescription className="col-span-full">
					Updated{" "}
					{validDate ? (
						<time dateTime={date.toISOString()} title={document.updatedAt}>
							{dateFormat.format(date)}
						</time>
					) : (
						document.updatedAt
					)}
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-wrap gap-2 px-5">
				<Badge variant="secondary">
					<VisibilityIcon aria-hidden="true" />
					{document.status === "PRIVATE" ? "Private" : "Public"}
				</Badge>
				{document.shared && (
					<Badge variant="outline">
						<Users aria-hidden="true" />
						Shared
					</Badge>
				)}
			</CardContent>
			{error}
			<CardFooter className="mt-auto justify-between gap-2 border-t px-5 py-2 [.border-t]:pt-2">
				<span className="flex items-center gap-1.5 text-xs text-muted-foreground">
					<GitBranch aria-hidden="true" className="size-3.5" />
					{document.branchCount}{" "}
					{document.branchCount === 1 ? "branch" : "branches"}
				</span>
				{openAction}
			</CardFooter>
		</Card>
	);
};

export default DocumentTile;

import { FolderOpen } from "lucide-react";
import type { ReactNode } from "react";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

interface Props {
	emptyTitle: string;
	emptyDescription: string;
	children?: ReactNode;
}

const InfoDrawerContent = ({
	emptyTitle,
	emptyDescription,
	children,
}: Props) => {
	return (
		<div className="flex min-h-0 min-w-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain bg-background px-4 py-5 [scrollbar-gutter:stable] [scrollbar-color:var(--border)_var(--background)] sm:px-6">
			{children ?? (
				<InfoDrawerEmpty
					emptyTitle={emptyTitle}
					emptyDescription={emptyDescription}
				/>
			)}
		</div>
	);
};
export const InfoDrawerEmpty = ({ emptyTitle, emptyDescription }: Props) => (
	<Empty className="rounded-xl border bg-card px-4 py-10">
		<EmptyHeader>
			<EmptyMedia variant="icon">
				<FolderOpen aria-hidden="true" />
			</EmptyMedia>
			<EmptyTitle>{emptyTitle}</EmptyTitle>
			{emptyDescription && (
				<EmptyDescription>{emptyDescription}</EmptyDescription>
			)}
		</EmptyHeader>
	</Empty>
);

export default InfoDrawerContent;

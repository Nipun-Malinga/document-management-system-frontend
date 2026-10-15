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
		<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain [scrollbar-gutter:stable] px-5 py-5">
			{children ?? (
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<FolderOpen />
						</EmptyMedia>
						<EmptyTitle>{emptyTitle}</EmptyTitle>
						<EmptyDescription>{emptyDescription}</EmptyDescription>
					</EmptyHeader>
				</Empty>
			)}
		</div>
	);
};
export default InfoDrawerContent;

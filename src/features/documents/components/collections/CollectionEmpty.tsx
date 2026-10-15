import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

interface Props {
	icon: LucideIcon;
	title: string;
	description: string;
	action?: ReactNode;
}

const CollectionEmpty = ({ icon: Icon, title, description, action }: Props) => (
	<Empty className="min-h-0 rounded-xl border bg-card p-6 md:p-6">
		<EmptyHeader>
			<EmptyMedia variant="icon" className="bg-secondary text-primary">
				<Icon aria-hidden="true" strokeWidth={1.5} />
			</EmptyMedia>
			<EmptyTitle>
				<h2>{title}</h2>
			</EmptyTitle>
			<EmptyDescription>{description}</EmptyDescription>
		</EmptyHeader>
		{action && <EmptyContent>{action}</EmptyContent>}
	</Empty>
);

export default CollectionEmpty;

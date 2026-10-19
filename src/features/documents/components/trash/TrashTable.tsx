import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
	children: ReactNode;
	label: string;
	itemHeading: string;
}

const TrashTable = ({ children, label, itemHeading }: Props) => (
	<div className="@container/trash min-w-0">
		<section
			aria-label={`${label} table`}
			// biome-ignore lint/a11y/noNoninteractiveTabindex: The overflow region needs keyboard focus for native table scrolling.
			tabIndex={0}
			className="overflow-x-auto rounded-xl border bg-card outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
		>
			<table className="w-full min-w-[34rem] text-sm">
				<caption className="sr-only">
					{label}: reported dates and recovery actions
				</caption>
				<thead className="border-b bg-muted/50 text-muted-foreground">
					<tr>
						{[itemHeading, "Reported date", "Actions"].map((title, index) => (
							<th
								scope="col"
								key={title}
								className={cn(
									"px-5 py-4 text-left text-xs font-medium",
									index === 2 && "text-right",
								)}
							>
								{title}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="divide-y divide-border">{children}</tbody>
			</table>
		</section>
	</div>
);

export default TrashTable;

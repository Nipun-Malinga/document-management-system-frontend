import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { type ReactNode, useId, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
	children: ReactNode;
	toolbar?: ReactNode;
	activeCount?: number;
	label?: string;
	className?: string;
}

/** Stable disclosure for collection filters; list state stays with the caller. */
const CollectionFilterPanel = ({
	children,
	toolbar,
	activeCount = 0,
	label = "Filters and sorting",
	className,
}: Props) => {
	const [open, setOpen] = useState(false);
	const panelId = useId();
	return (
		<div
			className={cn("flex w-full min-w-0 shrink-0 flex-col gap-3", className)}
		>
			<div className="flex min-w-0 flex-wrap items-start gap-3">
				{toolbar && <div className="min-w-0 flex-1 basis-64">{toolbar}</div>}
				<Button
					type="button"
					variant="outline"
					className="group h-10 shrink-0"
					aria-expanded={open}
					aria-controls={panelId}
					onClick={() => setOpen((value) => !value)}
				>
					<SlidersHorizontal aria-hidden="true" data-icon="inline-start" />
					{label}
					{activeCount > 0 && (
						<Badge variant="secondary" className="tabular-nums">
							{activeCount}
							<span className="sr-only">
								{activeCount === 1 ? " active filter" : " active filters"}
							</span>
						</Badge>
					)}
					<ChevronDown
						aria-hidden="true"
						data-icon="inline-end"
						className="size-4 group-aria-expanded:rotate-180"
					/>
				</Button>
			</div>
			<div
				id={panelId}
				hidden={!open}
				className="min-w-0 rounded-xl border bg-card px-4 py-1"
			>
				{children}
			</div>
		</div>
	);
};

export default CollectionFilterPanel;

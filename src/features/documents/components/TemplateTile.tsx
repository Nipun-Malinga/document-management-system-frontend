import { ArrowUpRight, FilePlus2 } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

interface Props
	extends Omit<ComponentProps<typeof Button>, "children" | "asChild"> {
	title: string;
}

const TemplateTile = ({ title, ...props }: Props) => (
	<Button
		variant="outline"
		className="h-auto min-h-32 w-full flex-col items-stretch justify-start gap-3 whitespace-normal rounded-xl p-4 text-left shadow-none"
		{...props}
	>
		<span aria-hidden="true" className="flex items-start justify-between gap-4">
			<span className="flex h-12 w-10 items-center justify-center rounded-md border bg-background text-primary">
				<FilePlus2 strokeWidth={1.5} />
			</span>
			<ArrowUpRight className="text-muted-foreground" />
		</span>
		<span className="flex min-w-0 flex-1 flex-col gap-1">
			<span className="line-clamp-2 wrap-anywhere text-sm font-medium">
				{title}
			</span>
			<span className="text-xs font-normal text-muted-foreground">
				Use template
			</span>
		</span>
	</Button>
);

export default TemplateTile;

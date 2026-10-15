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
		className="h-auto min-h-20 w-full justify-start gap-3 whitespace-normal rounded-xl bg-card p-3 text-left shadow-none"
		{...props}
	>
		<span
			aria-hidden="true"
			className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary"
		>
			<FilePlus2 className="size-5" strokeWidth={1.5} />
		</span>
		<span className="flex min-w-0 flex-1 flex-col gap-1">
			<span className="line-clamp-2 text-sm font-medium">{title}</span>
			<span className="text-xs font-normal text-muted-foreground">
				Use template
			</span>
		</span>
		<ArrowUpRight
			aria-hidden="true"
			className="size-4 shrink-0 text-muted-foreground"
		/>
	</Button>
);

export default TemplateTile;

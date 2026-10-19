import { ArrowRight, FilePlus2, LoaderCircle } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props
	extends Omit<ComponentProps<typeof Button>, "children" | "asChild"> {
	title: string;
	creating?: boolean;
}

const TemplateTile = ({
	title,
	creating = false,
	className,
	disabled,
	...props
}: Props) => (
	<Button
		variant="outline"
		title={title}
		className={cn(
			"document-template h-full min-h-64 w-full flex-col items-stretch justify-start gap-0 overflow-hidden whitespace-normal rounded-xl p-0 text-left shadow-none",
			className,
		)}
		disabled={disabled || creating}
		data-creating={creating || undefined}
		aria-busy={creating}
		{...props}
	>
		<span
			aria-hidden="true"
			className="document-template-cover flex h-40 w-full shrink-0 items-end justify-center overflow-hidden bg-muted/60 px-5 pt-5"
		>
			<span className="document-template-paper flex h-full w-full max-w-40 flex-col gap-3 rounded-t-md border border-b-0 bg-card p-4 text-card-foreground">
				<FilePlus2 className="text-primary" strokeWidth={1.5} />
				<span className="line-clamp-2 wrap-anywhere text-xs font-semibold leading-snug">
					{title}
				</span>
				<span className="flex flex-col gap-1.5">
					<span className="h-1 w-full rounded-full bg-border" />
					<span className="h-1 w-4/5 rounded-full bg-border" />
					<span className="h-1 w-full rounded-full bg-border" />
					<span className="h-1 w-3/5 rounded-full bg-border" />
				</span>
			</span>
		</span>
		<span className="flex min-w-0 flex-1 flex-col gap-3 p-4">
			<span className="line-clamp-2 wrap-anywhere text-sm font-semibold leading-snug">
				{title}
			</span>
			<span className="mt-auto flex items-center justify-between gap-2 text-xs font-medium text-primary">
				<span>{creating ? "Creating document…" : "Create document"}</span>
				{creating ? (
					<LoaderCircle
						aria-hidden="true"
						data-icon="inline-end"
						className="animate-spin motion-reduce:animate-none"
					/>
				) : (
					<ArrowRight aria-hidden="true" data-icon="inline-end" />
				)}
			</span>
		</span>
	</Button>
);

export default TemplateTile;

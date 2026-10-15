import { cn } from "@/lib/utils";

export const workspaceNavigationClass = (active: boolean) =>
	cn(
		"flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring",
		active ? "bg-accent font-medium text-primary" : "text-muted-foreground",
	);

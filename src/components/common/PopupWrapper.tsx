import { type ReactNode, useRef } from "react";
import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Props {
	collapsed: boolean;
	onClose: () => void;
	title: string;
	description: string;
	children: ReactNode;
	returnFocusId?: string;
	footer?: ReactNode;
	compact?: boolean;
	pending?: boolean;
	className?: string;
	bodyClassName?: string;
}

const PopupWrapper = ({
	collapsed,
	onClose,
	title,
	description,
	children,
	returnFocusId,
	footer,
	compact = false,
	pending = false,
	className,
	bodyClassName,
}: Props) => {
	const opener = useRef<HTMLElement | null>(null);
	return (
		<Dialog
			open={!collapsed}
			onOpenChange={(open) => {
				if (!open && !pending) onClose();
			}}
		>
			<DialogContent
				className={cn("gap-6", compact && "info-popup-surface", className)}
				showCloseButton={!pending}
				onEscapeKeyDown={(event) => {
					if (pending) event.preventDefault();
				}}
				onOpenAutoFocus={() => {
					opener.current =
						document.activeElement instanceof HTMLElement
							? document.activeElement
							: null;
				}}
				onCloseAutoFocus={(event) => {
					event.preventDefault();
					const target = returnFocusId
						? document.getElementById(returnFocusId)
						: opener.current?.isConnected
							? opener.current
							: document.getElementById("workspace-content");
					target?.focus();
				}}
			>
				<DialogHeader className="pr-6">
					<DialogTitle
						className={compact ? "truncate" : "wrap-break-word"}
						title={title}
					>
						{title}
					</DialogTitle>
					<DialogDescription className={compact ? "sr-only" : undefined}>
						{description}
					</DialogDescription>
				</DialogHeader>
				<DialogBody className={cn("flex flex-col gap-6", bodyClassName)}>
					{children}
				</DialogBody>
				{footer && (
					<div className={cn("shrink-0", compact && "info-popup-footer")}>
						{footer}
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};
export default PopupWrapper;

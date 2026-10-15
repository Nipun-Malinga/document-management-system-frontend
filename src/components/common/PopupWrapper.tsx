import { type ReactNode, useRef } from "react";
import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface Props {
	collapsed: boolean;
	onClose: () => void;
	title: string;
	description: string;
	children: ReactNode;
	returnFocusId?: string;
	footer?: ReactNode;
}

const PopupWrapper = ({
	collapsed,
	onClose,
	title,
	description,
	children,
	returnFocusId,
	footer,
}: Props) => {
	const opener = useRef<HTMLElement | null>(null);
	return (
		<Dialog
			open={!collapsed}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DialogContent
				className="gap-6"
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
					<DialogTitle className="break-words">{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<DialogBody className="flex flex-col gap-6">{children}</DialogBody>
				{footer && <div className="shrink-0">{footer}</div>}
			</DialogContent>
		</Dialog>
	);
};
export default PopupWrapper;

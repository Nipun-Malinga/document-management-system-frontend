import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

interface Props {
	icon: LucideIcon;
	label: string;
	active?: boolean;
	disabled?: boolean;
	onClick: () => void;
}

const ToolButton = ({
	icon: Icon,
	label,
	active,
	disabled,
	onClick,
}: Props) => {
	const content = <Icon aria-hidden="true" />;
	if (active !== undefined) {
		return (
			<Toggle
				type="button"
				aria-label={label}
				title={label}
				pressed={active}
				disabled={disabled}
				onPressedChange={onClick}
			>
				{content}
			</Toggle>
		);
	}
	return (
		<Button
			type="button"
			variant="ghost"
			size="icon"
			aria-label={label}
			title={label}
			disabled={disabled}
			onClick={onClick}
		>
			{content}
		</Button>
	);
};

export default ToolButton;

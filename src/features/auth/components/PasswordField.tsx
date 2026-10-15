import { Eye, EyeOff } from "lucide-react";
import { type ComponentProps, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Props = Omit<ComponentProps<typeof Input>, "type"> & {
	id: string;
	label: string;
	error?: string;
	description?: string;
};

const PasswordField = ({
	id,
	label,
	error,
	description,
	...inputProps
}: Props) => {
	const [visible, setVisible] = useState(false);
	const describedBy =
		[description && `${id}-hint`, error && `${id}-error`]
			.filter(Boolean)
			.join(" ") || undefined;

	return (
		<Field data-invalid={Boolean(error)} className="min-w-0 gap-2">
			<div className="flex items-center justify-between gap-3">
				<FieldLabel htmlFor={id}>{label}</FieldLabel>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="-my-1"
					aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`}
					aria-pressed={visible}
					aria-controls={id}
					onClick={() => setVisible((current) => !current)}
				>
					{visible ? (
						<EyeOff aria-hidden="true" data-icon="inline-start" />
					) : (
						<Eye aria-hidden="true" data-icon="inline-start" />
					)}
					{visible ? "Hide" : "Show"}
				</Button>
			</div>
			<Input
				{...inputProps}
				id={id}
				type={visible ? "text" : "password"}
				className="h-11 sm:h-10"
				aria-invalid={Boolean(error)}
				aria-describedby={describedBy}
			/>
			{description && (
				<FieldDescription id={`${id}-hint`}>{description}</FieldDescription>
			)}
			{error && <FieldError id={`${id}-error`}>{error}</FieldError>}
		</Field>
	);
};

export default PasswordField;

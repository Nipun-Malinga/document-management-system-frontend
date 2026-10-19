import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import PasswordField from "@/features/auth/components/PasswordField";
import type { AccountSectionState } from "@/features/users/components/AccountSectionState";
import ProfileFeedback from "@/features/users/components/ProfileFeedback";
import { useChangePassword } from "@/features/users/hooks";
import {
	type PasswordFormValues,
	passwordSchema,
} from "@/features/users/schemas/UserProfile";
import { applyFormError } from "@/shared/utils/formErrors";

const FORM_ID = "profile-password-form";

const DEFAULT_VALUES: PasswordFormValues = {
	currentPassword: "",
	newPassword: "",
	confirmPassword: "",
};

const MESSAGES = {
	success: "Password changed. Use your new password the next time you sign in.",
	timeout: "The request took too long. Your entries are preserved. Try again.",
	wrongCurrentPassword: "Current password is incorrect. Try again.",
} as const;

const SERVER_FIELDS = ["currentPassword", "newPassword"] as const;

type FieldConfig = {
	name: keyof PasswordFormValues;
	id: string;
	label: string;
	autoComplete: "current-password" | "new-password";
	keyPrefix: string;
	description?: string;
};

const FIELDS: FieldConfig[] = [
	{
		name: "currentPassword",
		id: "profile-current-password",
		label: "Current password",
		autoComplete: "current-password",
		keyPrefix: "current",
	},
	{
		name: "newPassword",
		id: "profile-new-password",
		label: "New password",
		autoComplete: "new-password",
		keyPrefix: "new",
		description: "Use 8–20 characters.",
	},
	{
		name: "confirmPassword",
		id: "profile-confirm-password",
		label: "Confirm new password",
		autoComplete: "new-password",
		keyPrefix: "confirm",
	},
];

type PasswordSectionProps = {
	disabled: boolean;
	onStateChange: (state: AccountSectionState) => void;
};

const PasswordSection = ({ disabled, onStateChange }: PasswordSectionProps) => {
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const changePassword = useChangePassword();

	const form = useForm<PasswordFormValues>({
		resolver: zodResolver(passwordSchema),
		mode: "onChange",
		defaultValues: DEFAULT_VALUES,
	});

	const clearFeedback = () => {
		setMessage("");
		setError("");
	};

	const handleSubmitError = (err: unknown) => {
		if (axios.isAxiosError(err)) {
			if (err.code === "ECONNABORTED") {
				setError(MESSAGES.timeout);
				return;
			}
			if (
				err.response?.status === 401 &&
				err.response.data?.detail === "Invalid credentials."
			) {
				form.setError(
					"currentPassword",
					{ type: "server", message: MESSAGES.wrongCurrentPassword },
					{ shouldFocus: true },
				);
				return;
			}
		}
		setError(applyFormError(err, form.setError, [...SERVER_FIELDS]));
	};

	const savePassword = form.handleSubmit(
		async ({ currentPassword, newPassword }) => {
			if (disabled || changePassword.isPending) return;
			clearFeedback();
			form.clearErrors();
			try {
				await changePassword.mutateAsync({ currentPassword, newPassword });
				form.reset();
				setMessage(MESSAGES.success);
			} catch (err) {
				handleSubmitError(err);
			}
		},
	);

	const resetKeySuffix = changePassword.isSuccess ? "-reset" : "";

	const pending = disabled || changePassword.isPending;
	const dirty = form.formState.isDirty;
	const saving = changePassword.isPending;

	useEffect(() => {
		onStateChange({ pending: saving, dirty });
	}, [onStateChange, saving, dirty]);

	return (
		<div className="flex flex-col gap-6">
			<form
				id={FORM_ID}
				onSubmit={savePassword}
				aria-label="Change password"
				aria-busy={changePassword.isPending}
				className="flex flex-col gap-4"
				noValidate
				onChange={clearFeedback}
			>
				<ProfileFeedback message={message} />
				<ProfileFeedback message={error} error />
				<FieldSet disabled={pending} className="gap-3">
					<FieldLegend className="sr-only">Change password</FieldLegend>
					<FieldGroup className="gap-3">
						{FIELDS.map(({ name, keyPrefix, ...field }) => (
							<PasswordField
								key={`${keyPrefix}${resetKeySuffix}`}
								error={form.formState.errors[name]?.message}
								{...field}
								{...form.register(name)}
							/>
						))}
					</FieldGroup>
				</FieldSet>
			</form>
			<DialogFooter>
				<PasswordSectionActions
					form={form}
					pending={pending}
					saving={changePassword.isPending}
				/>
			</DialogFooter>
		</div>
	);
};

type PasswordSectionActionsProps = {
	form: UseFormReturn<PasswordFormValues>;
	pending: boolean;
	saving: boolean;
};

const PasswordSectionActions = ({
	form,
	pending,
	saving,
}: PasswordSectionActionsProps) => (
	<div className="flex justify-end">
		<Button
			type="submit"
			form={FORM_ID}
			disabled={pending || !form.formState.isValid}
		>
			{saving && (
				<LoaderCircle
					data-icon="inline-start"
					aria-hidden="true"
					className="animate-spin"
				/>
			)}
			{saving ? "Changing…" : "Change password"}
		</Button>
	</div>
);

export default PasswordSection;

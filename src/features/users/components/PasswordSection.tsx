import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { type ReactNode, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import PasswordField from "@/features/auth/components/PasswordField";
import type { AccountSectionState } from "@/features/users/components/AccountSectionState";
import ProfileFeedback from "@/features/users/components/ProfileFeedback";
import { useChangePassword } from "@/hooks/user";
import { type PasswordFormValues, passwordSchema } from "@/types/UserProfile";
import { applyFormError } from "@/utils/formErrors";

type PasswordSectionProps = {
	children: (section: AccountSectionState) => ReactNode;
};

const PasswordSection = ({ children }: PasswordSectionProps) => {
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const changePassword = useChangePassword();
	const form = useForm<PasswordFormValues>({
		resolver: zodResolver(passwordSchema),
		mode: "onChange",
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});
	const clearFeedback = () => {
		setMessage("");
		setError("");
	};
	const savePassword = (pending: boolean) =>
		form.handleSubmit(async ({ currentPassword, newPassword }) => {
			if (pending) return;
			setError("");
			setMessage("");
			form.clearErrors();
			try {
				await changePassword.mutateAsync({ currentPassword, newPassword });
				form.reset();
				setMessage(
					"Password changed. Use your new password the next time you sign in.",
				);
			} catch (error) {
				if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
					setError(
						"The request took too long. Your entries are preserved. Try again.",
					);
				} else if (
					axios.isAxiosError(error) &&
					error.response?.status === 401 &&
					error.response.data?.detail === "Invalid credentials."
				) {
					form.setError(
						"currentPassword",
						{
							type: "server",
							message: "Current password is incorrect. Try again.",
						},
						{ shouldFocus: true },
					);
				} else
					setError(
						applyFormError(error, form.setError, [
							"currentPassword",
							"newPassword",
						]),
					);
			}
		});

	return children({
		pending: changePassword.isPending,
		dirty: form.formState.isDirty,
		renderContent: (pending) => (
			<form
				id="profile-password-form"
				onSubmit={savePassword(pending)}
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
						<PasswordField
							key={changePassword.isSuccess ? "current-reset" : "current"}
							id="profile-current-password"
							label="Current password"
							autoComplete="current-password"
							error={form.formState.errors.currentPassword?.message}
							{...form.register("currentPassword")}
						/>
						<PasswordField
							key={changePassword.isSuccess ? "new-reset" : "new"}
							id="profile-new-password"
							label="New password"
							autoComplete="new-password"
							description="Use 8–20 characters."
							error={form.formState.errors.newPassword?.message}
							{...form.register("newPassword")}
						/>
						<PasswordField
							key={changePassword.isSuccess ? "confirm-reset" : "confirm"}
							id="profile-confirm-password"
							label="Confirm new password"
							autoComplete="new-password"
							error={form.formState.errors.confirmPassword?.message}
							{...form.register("confirmPassword")}
						/>
					</FieldGroup>
				</FieldSet>
			</form>
		),
		renderActions: (pending) => (
			<PasswordSectionActions
				form={form}
				pending={pending}
				saving={changePassword.isPending}
			/>
		),
	});
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
			form="profile-password-form"
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

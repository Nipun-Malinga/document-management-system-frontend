import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { actionError } from "@/features/editor/persistence/actionError";
import type { ProfileSectionState } from "@/features/users/components/AccountSectionState";
import ProfileFeedback from "@/features/users/components/ProfileFeedback";
import ProfileSectionActions from "@/features/users/components/ProfileSectionActions";
import { useUpdateProfile, useUserProfile } from "@/hooks/user";
import { profileSchema, type UpdateProfileRequest } from "@/types/UserProfile";
import { applyFormError } from "@/utils/formErrors";

type ProfileSectionProps = {
	disabled: boolean;
	onStateChange: (state: ProfileSectionState) => void;
};

const ProfileSection = ({ disabled, onStateChange }: ProfileSectionProps) => {
	const query = useUserProfile();
	const profile = query.data;
	const [initialized, setInitialized] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const update = useUpdateProfile();
	const form = useForm<UpdateProfileRequest>({
		resolver: zodResolver(profileSchema),
		mode: "onChange",
		defaultValues: {
			firstname: "",
			lastname: "",
			email: "",
		},
	});
	const clearFeedback = () => {
		setMessage("");
		setError("");
	};
	const reset = () => {
		form.reset();
		clearFeedback();
	};
	const saveProfile = form.handleSubmit(async (data) => {
		if (disabled || update.isPending || !profile) return;

		setError("");
		setMessage("");

		form.clearErrors();

		const emailChanged = data.email !== profile.email;

		try {
			const saved = await update.mutateAsync(data);
			form.reset({
				firstname: saved.firstname,
				lastname: saved.lastname,
				email: saved.email,
			});
			setMessage(
				emailChanged
					? "Profile saved. Use your updated email the next time you sign in."
					: "Profile saved.",
			);
		} catch (error) {
			setError(
				axios.isAxiosError(error) && error.code === "ECONNABORTED"
					? "The request took too long. Your entries are preserved. Try again."
					: applyFormError(error, form.setError, [
							"firstname",
							"lastname",
							"email",
						]),
			);
		}
	});

	const { reset: resetForm } = form;
	useEffect(() => {
		if (!profile || initialized) return;
		resetForm({
			firstname: profile.firstname,
			lastname: profile.lastname,
			email: profile.email,
		});
		setInitialized(true);
	}, [profile, initialized, resetForm]);

	const ready = Boolean(profile) && initialized;
	const saving = update.isPending;
	const pending = disabled || saving;
	const dirty = form.formState.isDirty;

	useEffect(() => {
		onStateChange({ ready, pending: saving, dirty });
	}, [onStateChange, ready, saving, dirty]);

	if (!ready || !profile) {
		return query.isPending || profile ? (
			<div className="flex flex-col gap-4">
				<Skeleton className="h-9 w-44" />
				<Skeleton className="h-16 w-full" />
				<Skeleton className="h-16 w-full" />
				<Skeleton className="h-10 w-32 self-end" />
				<span className="sr-only">Loading your profile…</span>
			</div>
		) : (
			<>
				<Alert variant="destructive">
					<AlertTitle>Could not load your profile</AlertTitle>
					<AlertDescription>
						{actionError(query.error, "Please try again.")}
					</AlertDescription>
				</Alert>
				<Button variant="outline" onClick={() => void query.refetch()}>
					Retry profile
				</Button>
			</>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<form
				id="profile-details-form"
				onSubmit={saveProfile}
				aria-label="Edit profile"
				aria-busy={saving}
				className="flex flex-col gap-4"
				noValidate
				onChange={clearFeedback}
			>
				<ProfileFeedback message={message} />
				<ProfileFeedback message={error} error />
				<FieldSet disabled={pending} className="gap-3">
					<FieldLegend className="sr-only">Personal details</FieldLegend>
					<FieldGroup className="gap-3">
						<Field className="gap-2">
							<FieldLabel htmlFor="profile-username">Username</FieldLabel>
							<Input
								id="profile-username"
								autoComplete="username"
								value={profile.username}
								readOnly
								aria-describedby="profile-username-hint"
							/>
							<FieldDescription id="profile-username-hint">
								Your username cannot be changed.
							</FieldDescription>
						</Field>
						<FieldGroup className="grid gap-3 sm:grid-cols-2">
							{(["firstname", "lastname"] as const).map((name) => {
								const label = name === "firstname" ? "First name" : "Last name";
								const error = form.formState.errors[name];
								return (
									<Field
										key={name}
										data-invalid={Boolean(error)}
										className="min-w-0 gap-2"
									>
										<FieldLabel htmlFor={`profile-${name}`}>{label}</FieldLabel>
										<Input
											id={`profile-${name}`}
											autoComplete={
												name === "firstname" ? "given-name" : "family-name"
											}
											{...form.register(name)}
										/>
										<FieldDescription id={`profile-${name}-hint`}>
											3–10 characters.
										</FieldDescription>
										{error && (
											<FieldError id={`profile-${name}-error`}>
												{error.message}
											</FieldError>
										)}
									</Field>
								);
							})}
						</FieldGroup>
						<Field
							data-invalid={Boolean(form.formState.errors.email)}
							className="gap-2"
						>
							<FieldLabel htmlFor="profile-email">Email address</FieldLabel>
							<Input
								id="profile-email"
								type="email"
								autoComplete="email"
								maxLength={255}
								aria-invalid={Boolean(form.formState.errors.email)}
								aria-describedby={`profile-email-hint${form.formState.errors.email ? " profile-email-error" : ""}`}
								{...form.register("email")}
							/>
							<FieldDescription id="profile-email-hint">
								This is the email you use to sign in. Use the updated address
								after saving.
							</FieldDescription>
							{form.formState.errors.email && (
								<FieldError id="profile-email-error">
									{form.formState.errors.email.message}
								</FieldError>
							)}
						</Field>
					</FieldGroup>
				</FieldSet>
			</form>
			<DialogFooter>
				<ProfileSectionActions
					form={form}
					pending={pending}
					saving={saving}
					onReset={reset}
				/>
			</DialogFooter>
		</div>
	);
};

export default ProfileSection;

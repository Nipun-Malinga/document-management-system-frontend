import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Check, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PasswordField from "@/features/auth/components/PasswordField";
import { actionError } from "@/features/editor/persistence/actionError";
import {
	useChangePassword,
	useUpdateProfile,
	useUserProfile,
} from "@/hooks/user";
import { useSessionStore } from "@/states/sessionStore";
import useUserProfilePopup from "@/states/useUserProfilePopup";
import {
	type PasswordFormValues,
	passwordSchema,
	profileSchema,
	type UpdateProfileRequest,
	type UserProfile,
} from "@/types/UserProfile";
import { applyFormError } from "@/utils/formErrors";

const Feedback = ({
	message,
	error = false,
}: {
	message: string;
	error?: boolean;
}) =>
	message ? (
		<Alert
			variant={error ? "destructive" : "default"}
			role={error ? "alert" : "status"}
		>
			{!error && <Check aria-hidden="true" />}
			<AlertDescription>{message}</AlertDescription>
		</Alert>
	) : null;

const AccountForms = ({
	profile,
	close,
}: {
	profile: UserProfile;
	close: () => void;
}) => {
	const [tab, setTab] = useState("profile");
	const [discard, setDiscard] = useState(false);
	const [profileMessage, setProfileMessage] = useState("");
	const [profileError, setProfileError] = useState("");
	const [passwordMessage, setPasswordMessage] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const update = useUpdateProfile();
	const changePassword = useChangePassword();

	const profileForm = useForm<UpdateProfileRequest>({
		resolver: zodResolver(profileSchema),
		mode: "onChange",
		defaultValues: {
			firstname: profile.firstname,
			lastname: profile.lastname,
			email: profile.email,
		},
	});

	const passwordForm = useForm<PasswordFormValues>({
		resolver: zodResolver(passwordSchema),
		mode: "onChange",
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	const pending = update.isPending || changePassword.isPending;
	const dirty = profileForm.formState.isDirty || passwordForm.formState.isDirty;

	const requestClose = () => {
		if (pending) return;
		if (dirty) setDiscard(true);
		else close();
	};

	const saveProfile = profileForm.handleSubmit(async (data) => {
		if (pending) return;

		setProfileError("");
		setProfileMessage("");

		profileForm.clearErrors();

		const emailChanged = data.email !== profile.email;

		try {
			const saved = await update.mutateAsync(data);
			profileForm.reset({
				firstname: saved.firstname,
				lastname: saved.lastname,
				email: saved.email,
			});
			setProfileMessage(
				emailChanged
					? "Profile saved. Use your updated email the next time you sign in."
					: "Profile saved.",
			);
		} catch (error) {
			setProfileError(
				axios.isAxiosError(error) && error.code === "ECONNABORTED"
					? "The request took too long. Your entries are preserved. Try again."
					: applyFormError(error, profileForm.setError, [
							"firstname",
							"lastname",
							"email",
						]),
			);
		}
	});

	const savePassword = passwordForm.handleSubmit(
		async ({ currentPassword, newPassword }) => {
			if (pending) return;
			setPasswordError("");
			setPasswordMessage("");
			passwordForm.clearErrors();
			try {
				await changePassword.mutateAsync({ currentPassword, newPassword });
				passwordForm.reset();
				setPasswordMessage(
					"Password changed. Use your new password the next time you sign in.",
				);
			} catch (error) {
				if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
					setPasswordError(
						"The request took too long. Your entries are preserved. Try again.",
					);
				} else if (
					axios.isAxiosError(error) &&
					error.response?.status === 401 &&
					error.response.data?.detail === "Invalid credentials."
				) {
					passwordForm.setError(
						"currentPassword",
						{
							type: "server",
							message: "Current password is incorrect. Try again.",
						},
						{ shouldFocus: true },
					);
				} else
					setPasswordError(
						applyFormError(error, passwordForm.setError, [
							"currentPassword",
							"newPassword",
						]),
					);
			}
		},
	);

	return (
		<AccountFrame
			close={requestClose}
			pending={pending}
			footer={
				tab === "profile" ? (
					<div className="flex flex-wrap items-center justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							disabled={pending || !profileForm.formState.isDirty}
							onClick={() => {
								profileForm.reset();
								setProfileMessage("");
								setProfileError("");
							}}
						>
							Reset changes
						</Button>
						<Button
							type="submit"
							form="profile-details-form"
							disabled={
								pending ||
								!profileForm.formState.isDirty ||
								!profileForm.formState.isValid
							}
						>
							{update.isPending && (
								<LoaderCircle
									data-icon="inline-start"
									aria-hidden="true"
									className="animate-spin"
								/>
							)}
							{update.isPending ? "Saving…" : "Save profile"}
						</Button>
					</div>
				) : (
					<div className="flex justify-end">
						<Button
							type="submit"
							form="profile-password-form"
							disabled={pending || !passwordForm.formState.isValid}
						>
							{changePassword.isPending && (
								<LoaderCircle
									data-icon="inline-start"
									aria-hidden="true"
									className="animate-spin"
								/>
							)}
							{changePassword.isPending ? "Changing…" : "Change password"}
						</Button>
					</div>
				)
			}
		>
			{discard && (
				<Alert>
					<AlertTitle>Discard unsaved changes?</AlertTitle>
					<AlertDescription>
						Your profile edits and password entries have not been saved.
						<div className="mt-2 flex flex-wrap gap-2">
							<Button
								variant="outline"
								autoFocus
								onClick={() => setDiscard(false)}
							>
								Keep editing
							</Button>
							<Button variant="destructive" onClick={close}>
								Discard changes
							</Button>
						</div>
					</AlertDescription>
				</Alert>
			)}
			<Tabs
				value={tab}
				onValueChange={(value) => {
					setTab(value);
					setDiscard(false);
				}}
				className="gap-3"
			>
				<TabsList aria-label="Account settings" className="w-full sm:w-fit">
					<TabsTrigger value="profile" disabled={pending}>
						Profile
					</TabsTrigger>
					<TabsTrigger value="password" disabled={pending}>
						Password
					</TabsTrigger>
				</TabsList>
				<TabsContent value="profile" forceMount hidden={tab !== "profile"}>
					<form
						id="profile-details-form"
						onSubmit={saveProfile}
						aria-label="Edit profile"
						aria-busy={update.isPending}
						className="flex flex-col gap-4"
						noValidate
						onChange={() => {
							setProfileMessage("");
							setProfileError("");
						}}
					>
						<Feedback message={profileMessage} />
						<Feedback message={profileError} error />
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
										const label =
											name === "firstname" ? "First name" : "Last name";
										const error = profileForm.formState.errors[name];
										return (
											<Field
												key={name}
												data-invalid={Boolean(error)}
												className="min-w-0 gap-2"
											>
												<FieldLabel htmlFor={`profile-${name}`}>
													{label}
												</FieldLabel>
												<Input
													id={`profile-${name}`}
													autoComplete={
														name === "firstname" ? "given-name" : "family-name"
													}
													aria-invalid={Boolean(error)}
													aria-describedby={`profile-${name}-hint${error ? ` profile-${name}-error` : ""}`}
													{...profileForm.register(name)}
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
									data-invalid={Boolean(profileForm.formState.errors.email)}
									className="gap-2"
								>
									<FieldLabel htmlFor="profile-email">Email address</FieldLabel>
									<Input
										id="profile-email"
										type="email"
										autoComplete="email"
										maxLength={255}
										aria-invalid={Boolean(profileForm.formState.errors.email)}
										aria-describedby={`profile-email-hint${profileForm.formState.errors.email ? " profile-email-error" : ""}`}
										{...profileForm.register("email")}
									/>
									<FieldDescription id="profile-email-hint">
										This is the email you use to sign in. Use the updated
										address after saving.
									</FieldDescription>
									{profileForm.formState.errors.email && (
										<FieldError id="profile-email-error">
											{profileForm.formState.errors.email.message}
										</FieldError>
									)}
								</Field>
							</FieldGroup>
						</FieldSet>
					</form>
				</TabsContent>
				<TabsContent value="password" forceMount hidden={tab !== "password"}>
					<form
						id="profile-password-form"
						onSubmit={savePassword}
						aria-label="Change password"
						aria-busy={changePassword.isPending}
						className="flex flex-col gap-4"
						noValidate
						onChange={() => {
							setPasswordMessage("");
							setPasswordError("");
						}}
					>
						<Feedback message={passwordMessage} />
						<Feedback message={passwordError} error />
						<FieldSet disabled={pending} className="gap-3">
							<FieldLegend className="sr-only">Change password</FieldLegend>
							<FieldGroup className="gap-3">
								<PasswordField
									key={changePassword.isSuccess ? "current-reset" : "current"}
									id="profile-current-password"
									label="Current password"
									autoComplete="current-password"
									error={passwordForm.formState.errors.currentPassword?.message}
									{...passwordForm.register("currentPassword")}
								/>
								<PasswordField
									key={changePassword.isSuccess ? "new-reset" : "new"}
									id="profile-new-password"
									label="New password"
									autoComplete="new-password"
									description="Use 8–20 characters."
									error={passwordForm.formState.errors.newPassword?.message}
									{...passwordForm.register("newPassword")}
								/>
								<PasswordField
									key={changePassword.isSuccess ? "confirm-reset" : "confirm"}
									id="profile-confirm-password"
									label="Confirm new password"
									autoComplete="new-password"
									error={passwordForm.formState.errors.confirmPassword?.message}
									{...passwordForm.register("confirmPassword")}
								/>
							</FieldGroup>
						</FieldSet>
					</form>
				</TabsContent>
			</Tabs>
		</AccountFrame>
	);
};

const AccountFrame = ({
	children,
	close,
	pending = false,
	footer,
}: {
	children: React.ReactNode;
	close: () => void;
	pending?: boolean;
	footer?: React.ReactNode;
}) => {
	return (
		<Dialog
			open
			onOpenChange={(open) => {
				if (!open) close();
			}}
		>
			<DialogContent
				className="account-popup-surface p-4 sm:p-6"
				showCloseButton={!pending}
				onEscapeKeyDown={(event) => {
					if (pending) event.preventDefault();
				}}
				onCloseAutoFocus={(event) => {
					event.preventDefault();
					document.getElementById("workspace-account")?.focus();
				}}
			>
				<DialogHeader className="pr-6">
					<DialogTitle>Your profile</DialogTitle>
					<DialogDescription>
						Manage your personal details and password.
					</DialogDescription>
				</DialogHeader>
				<DialogBody className="flex flex-col gap-4">{children}</DialogBody>
				{footer && <DialogFooter>{footer}</DialogFooter>}
			</DialogContent>
		</Dialog>
	);
};

const LoadedProfile = ({ close }: { close: () => void }) => {
	const profile = useUserProfile(true);
	if (!profile.data && profile.isPending)
		return (
			<AccountFrame close={close}>
				<div
					className="flex flex-col gap-4"
				>
					<Skeleton className="h-9 w-44" />
					<Skeleton className="h-16 w-full" />
					<Skeleton className="h-16 w-full" />
					<Skeleton className="h-10 w-32 self-end" />
					<span className="sr-only">Loading your profile…</span>
				</div>
			</AccountFrame>
		);
	if (!profile.data)
		return (
			<AccountFrame close={close}>
				<Alert variant="destructive">
					<AlertTitle>Could not load your profile</AlertTitle>
					<AlertDescription>
						{actionError(profile.error, "Please try again.")}
					</AlertDescription>
				</Alert>
				<Button variant="outline" onClick={() => void profile.refetch()}>
					Retry profile
				</Button>
			</AccountFrame>
		);
	return <AccountForms profile={profile.data} close={close} />;
};

const ProfilePopup = () => {
	const { collapsed, toggleProfilePopup } = useUserProfilePopup();
	const epoch = useSessionStore((state) => state.epoch);
	const user = useSessionStore((state) => state.user);
	return collapsed ? null : user ? (
		<LoadedProfile key={epoch} close={toggleProfilePopup} />
	) : (
		<AccountFrame close={toggleProfilePopup}>
			<p className="text-sm text-muted-foreground">
				Sign in to view your profile.
			</p>
		</AccountFrame>
	);
};
export default ProfilePopup;

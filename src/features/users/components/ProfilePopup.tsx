import { type ReactNode, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
	AccountSectionState,
	ProfileSectionState,
} from "@/features/users/components/AccountSectionState";
import PasswordSection from "@/features/users/components/PasswordSection";
import ProfileSection from "@/features/users/components/ProfileSection";
import { useSessionStore } from "@/states/sessionStore";
import useUserProfilePopup from "@/states/useUserProfilePopup";

type AccountTab = "profile" | "password";

const TABS: { value: AccountTab; label: string }[] = [
	{ value: "profile", label: "Profile" },
	{ value: "password", label: "Password" },
];

type AccountFrameProps = {
	children: ReactNode;
	close: () => void;
	pending?: boolean;
	footer?: ReactNode;
};

const AccountFrame = ({
	children,
	close,
	pending = false,
	footer,
}: AccountFrameProps) => (
	<Dialog open onOpenChange={(open) => !open && close()}>
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

const DiscardAlert = ({
	onKeepEditing,
	onDiscard,
}: {
	onKeepEditing: () => void;
	onDiscard: () => void;
}) => (
	<Alert>
		<AlertTitle>Discard unsaved changes?</AlertTitle>
		<AlertDescription>
			Your profile edits and password entries have not been saved.
			<div className="mt-2 flex flex-wrap gap-2">
				<Button variant="outline" autoFocus onClick={onKeepEditing}>
					Keep editing
				</Button>
				<Button variant="destructive" onClick={onDiscard}>
					Discard changes
				</Button>
			</div>
		</AlertDescription>
	</Alert>
);

type AccountFormsProps = {
	profile: ProfileSectionState;
	password: AccountSectionState;
	close: () => void;
};

const AccountForms = ({ profile, password, close }: AccountFormsProps) => {
	const [tab, setTab] = useState<AccountTab>("profile");
	const [confirmingDiscard, setConfirmingDiscard] = useState(false);

	const sections: Record<AccountTab, AccountSectionState> = {
		profile,
		password,
	};
	const pending = profile.pending || password.pending;
	const dirty = profile.dirty || password.dirty;

	const requestClose = () => {
		if (pending) return;
		if (dirty) setConfirmingDiscard(true);
		else close();
	};

	const changeTab = (value: string) => {
		setTab(value as AccountTab);
		setConfirmingDiscard(false);
	};

	return (
		<AccountFrame
			close={requestClose}
			pending={pending}
			footer={profile.ready ? sections[tab].renderActions(pending) : undefined}
		>
			{confirmingDiscard && (
				<DiscardAlert
					onKeepEditing={() => setConfirmingDiscard(false)}
					onDiscard={close}
				/>
			)}

			{profile.ready ? (
				<Tabs value={tab} onValueChange={changeTab} className="gap-3">
					<TabsList aria-label="Account settings" className="w-full sm:w-fit">
						{TABS.map(({ value, label }) => (
							<TabsTrigger key={value} value={value} disabled={pending}>
								{label}
							</TabsTrigger>
						))}
					</TabsList>
					{TABS.map(({ value }) => (
						<TabsContent
							key={value}
							value={value}
							forceMount
							hidden={tab !== value}
						>
							{sections[value].renderContent(pending)}
						</TabsContent>
					))}
				</Tabs>
			) : (
				profile.renderContent(pending)
			)}
		</AccountFrame>
	);
};

const ProfilePopup = () => {
	const { collapsed, toggleProfilePopup } = useUserProfilePopup();
	const epoch = useSessionStore((state) => state.epoch);

	if (collapsed) return null;

	return (
		<ProfileSection key={epoch}>
			{(profile) => (
				<PasswordSection>
					{(password) => (
						<AccountForms
							profile={profile}
							password={password}
							close={toggleProfilePopup}
						/>
					)}
				</PasswordSection>
			)}
		</ProfileSection>
	);
};

export default ProfilePopup;

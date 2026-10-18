import { useEffect, useState } from "react";
import PopupWrapper from "@/components/common/PopupWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
	AccountSectionState,
	ProfileSectionState,
} from "@/features/users/components/AccountSectionState";
import DiscardAlert from "@/features/users/components/DiscardAlert";
import PasswordSection from "@/features/users/components/PasswordSection";
import ProfileSection from "@/features/users/components/ProfileSection";
import { useSessionStore } from "@/states/sessionStore";
import useUserProfilePopup from "@/states/useUserProfilePopup";

type AccountTab = "profile" | "password";

const ProfilePopup = ({ onClose }: { onClose: () => void }) => {
	const [tab, setTab] = useState<AccountTab>("profile");
	const [confirmingDiscard, setConfirmingDiscard] = useState(false);
	const [profile, setProfile] = useState<ProfileSectionState>({
		ready: false,
		pending: false,
		dirty: false,
	});
	const [password, setPassword] = useState<AccountSectionState>({
		pending: false,
		dirty: false,
	});
	const pending = profile.pending || password.pending;

	const { collapsed, toggleProfilePopup } = useUserProfilePopup();

	useEffect(() => {
		if (!collapsed) {
			setTab("profile");
			setConfirmingDiscard(false);
		}
	}, [collapsed]);

	const changeTab = (value: string) => {
		if (pending || (value !== "profile" && value !== "password")) return;
		setTab(value);
		setConfirmingDiscard(false);
	};

	return (
		<PopupWrapper
			collapsed={collapsed}
			onClose={toggleProfilePopup}
			title="Your profile"
			description="Manage your personal details and password."
			returnFocusId="workspace-account"
			pending={pending}
		>
			{confirmingDiscard && (
				<DiscardAlert
					onKeepEditing={() => setConfirmingDiscard(false)}
					onDiscard={onClose}
				/>
			)}
			<Tabs value={tab} onValueChange={changeTab} className="gap-3">
				{profile.ready && (
					<TabsList aria-label="Account settings" className="w-full sm:w-fit">
						<TabsTrigger value="profile" disabled={pending}>
							Profile
						</TabsTrigger>
						<TabsTrigger value="password" disabled={pending}>
							Password
						</TabsTrigger>
					</TabsList>
				)}
				<TabsContent value="profile" forceMount hidden={tab !== "profile"}>
					<ProfileSection disabled={pending} onStateChange={setProfile} />
				</TabsContent>
				<TabsContent value="password" forceMount hidden={tab !== "password"}>
					<PasswordSection disabled={pending} onStateChange={setPassword} />
				</TabsContent>
			</Tabs>
		</PopupWrapper>
	);
};

const UserProfilePopup = () => {
	const { toggleProfilePopup } = useUserProfilePopup();
	const epoch = useSessionStore((state) => state.epoch);
	return <ProfilePopup key={epoch} onClose={toggleProfilePopup} />;
};

export default UserProfilePopup;

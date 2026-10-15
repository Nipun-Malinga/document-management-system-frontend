import { UserRound } from "lucide-react";
import PopupWrapper from "@/components/common/PopupWrapper";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/user";
import useUserProfilePopup from "@/states/useUserProfilePopup";

const ProfilePopup = () => {
	const { collapsed, toggleProfilePopup } = useUserProfilePopup();
	const user = useUser();
	return (
		<PopupWrapper
			collapsed={collapsed}
			onClose={toggleProfilePopup}
			returnFocusId="workspace-account"
			title="Your profile"
			description="Your signed-in account details."
		>
			{user ? (
				<>
					<div className="flex items-center gap-4">
						<span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
							<UserRound aria-hidden="true" className="size-6" />
						</span>
						<div className="flex min-w-0 flex-col gap-1">
							<h2 className="wrap-break-word font-semibold">{user.username}</h2>
							<Badge variant="secondary">
								{user.role === "ADMIN" ? "Administrator" : "Member"}
							</Badge>
						</div>
					</div>
					<dl className="flex flex-col gap-5 text-sm">
						<div className="flex flex-col gap-1.5">
							<dt className="text-muted-foreground">Username</dt>
							<dd className="wrap-break-word">{user.username}</dd>
						</div>
						<div className="flex flex-col gap-1.5">
							<dt className="text-muted-foreground">Email</dt>
							<dd className="wrap-break-word">{user.email}</dd>
						</div>
					</dl>
				</>
			) : (
				<p className="text-sm text-muted-foreground">
					Sign in to view your profile.
				</p>
			)}
		</PopupWrapper>
	);
};
export default ProfilePopup;

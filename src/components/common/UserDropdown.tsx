import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { actionError } from "@/features/editor/persistence/actionError";
import { flushActiveEditor } from "@/features/editor/persistence/persistenceRegistry";
import { useUser } from "@/hooks/user";
import useUserProfilePopup from "@/states/useUserProfilePopup";
import { endSession } from "@/utils/authUtils";
import { Button } from "../ui/button";

const UserDropdown = () => {
	const user = useUser();
	const navigate = useNavigate();
	const { toggleProfilePopup } = useUserProfilePopup();
	const [error, setError] = useState("");
	const [pending, setPending] = useState(false);
	const finishLogout = async () => {
		endSession();
		await navigate("/auth/signin");
	};
	const logout = async () => {
		if (pending) return;
		setPending(true);
		setError("");
		try {
			await flushActiveEditor();
			await finishLogout();
		} catch (error) {
			setError(actionError(error));
		} finally {
			setPending(false);
		}
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant={"outline"}>{user?.username}</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuGroup>
						<DropdownMenuItem onClick={toggleProfilePopup}>
							Profile
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						disabled={pending}
						onClick={() => {
							void logout();
						}}
					>
						Log out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			{pending && <p>Saving before logout…</p>}
			{error && (
				<div role="alert" className="space-y-2 text-sm text-foreground">
					<p>{error}</p>
					<Button
						variant="outline"
						disabled={pending}
						onClick={() => {
							void logout();
						}}
					>
						Retry save and logout
					</Button>
					<Button
						variant="outline"
						disabled={pending}
						onClick={() => setError("")}
					>
						Stay signed in
					</Button>
					<Button
						variant="destructive"
						disabled={pending}
						onClick={finishLogout}
					>
						Discard local changes and logout
					</Button>
				</div>
			)}
		</>
	);
};

export default UserDropdown;

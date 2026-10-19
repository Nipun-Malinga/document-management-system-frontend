import { LogOut, UserRound } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/features/auth/hooks";
import { endSession } from "@/features/auth/utils/authUtils";
import { actionError } from "@/features/editor/persistence/actionError";
import { flushActiveEditor } from "@/features/editor/persistence/persistenceRegistry";
import useUserProfilePopup from "@/features/users/stores/useUserProfilePopup";
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
					<Button
						id="workspace-account"
						variant="outline"
						className="max-sm:size-9 max-sm:px-0"
					>
						<UserRound aria-hidden="true" className="sm:hidden" />
						<span className="sr-only sm:not-sr-only sm:max-w-40 sm:truncate">
							{user?.username ?? "Account"}
						</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="end"
					className="w-64 max-w-[calc(100vw-2rem)]"
				>
					<DropdownMenuLabel>
						<span className="flex flex-col gap-1 py-1">
							<span>My Account</span>
							<span className="wrap-break-word text-xs font-normal text-muted-foreground">
								{user?.email}
							</span>
						</span>
					</DropdownMenuLabel>
					<DropdownMenuGroup>
						<DropdownMenuItem onClick={toggleProfilePopup}>
							<UserRound aria-hidden="true" />
							Profile
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem
							disabled={pending}
							onClick={() => {
								void logout();
							}}
						>
							<LogOut aria-hidden="true" />
							Log out
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
			{pending && <p className="sr-only">Saving before logout…</p>}
			<Dialog
				open={!!error}
				onOpenChange={(open) => {
					if (!open && !pending) setError("");
				}}
			>
				<DialogContent
					onCloseAutoFocus={(event) => {
						event.preventDefault();
						document.getElementById("workspace-account")?.focus();
					}}
				>
					<DialogHeader>
						<DialogTitle>Save before signing out</DialogTitle>
						<DialogDescription>
							Your changes could not be saved. Retry saving or choose how to
							continue.
						</DialogDescription>
					</DialogHeader>
					<DialogBody>
						<p role="alert" className="text-sm text-destructive">
							{error}
						</p>
					</DialogBody>
					<DialogFooter className="flex-wrap">
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
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default UserDropdown;

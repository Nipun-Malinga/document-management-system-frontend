import { Menu, UserStar } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/user";
import useAside from "@/states/useAside";
import DarkThemeButton from "../common/DarkThemeButton";
import Notification from "../common/Notification";
import UserDropdown from "../common/UserDropdown";

const titles: Record<string, string> = {
	home: "Home",
	quick: "Quick Access",
	resents: "Recents",
	shared: "Shared With Me",
	trash: "Trash",
};
const TopBar = () => {
	const { toggle, collapsed } = useAside();
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const user = useUser();
	return (
		<div className="flex min-h-10 min-w-0 items-center justify-between gap-3">
			<div className="flex min-w-0 items-center gap-3">
				<Button
					id="workspace-menu"
					type="button"
					variant="ghost"
					size="icon"
					className="shrink-0 md:hidden"
					aria-label="Open workspace navigation"
					aria-expanded={!collapsed}
					onClick={toggle}
				>
					<Menu aria-hidden="true" />
				</Button>
				<span className="hidden text-sm text-muted-foreground sm:inline">
					Workspace
				</span>
				<span aria-hidden="true" className="hidden text-border sm:inline">
					/
				</span>
				<span className="hidden truncate text-sm font-medium sm:inline">
					{titles[pathname.split("/").at(-1) ?? ""] ?? "Workspace"}
				</span>
			</div>
			<div className="flex shrink-0 items-center gap-1 sm:gap-2">
				<Notification />
				<DarkThemeButton />
				<UserDropdown />
				{user?.role === "ADMIN" && (
					<Button
						type="button"
						variant="ghost"
						size="icon"
						aria-label="Open admin dashboard"
						onClick={() => navigate("/admin/dashboard")}
					>
						<UserStar aria-hidden="true" />
					</Button>
				)}
			</div>
		</div>
	);
};
export default TopBar;

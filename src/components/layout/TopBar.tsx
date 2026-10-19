import { Menu, UserStar } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/features/auth/hooks";
import useAside from "@/features/workspace/stores/useAside";
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
				<Breadcrumb className="min-w-0">
					<BreadcrumbList className="flex-nowrap">
						<BreadcrumbItem className="hidden sm:inline-flex">
							Workspace
						</BreadcrumbItem>
						<BreadcrumbSeparator className="hidden sm:block" />
						<BreadcrumbItem className="min-w-0">
							<BreadcrumbPage className="truncate">
								{titles[pathname.split("/").at(-1) ?? ""] ?? "Workspace"}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			<div className="flex shrink-0 items-center gap-1 sm:gap-2">
				<Notification />
				<DarkThemeButton />
				<Separator
					orientation="vertical"
					className="mx-1 hidden h-5 sm:block"
				/>
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

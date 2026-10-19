import { Outlet } from "react-router-dom";
import { SideBar, TopBar } from "@/components";
import { sidebarData } from "@/data/Sidebar";
import ProfilePopup from "@/features/users/components/ProfilePopup";
import { useSidebarData } from "@/features/workspace/hooks";

const Dashboard = () => {
	const sidebarInfo = useSidebarData();

	return (
		<main className="workspace-page grid h-svh grid-cols-[minmax(0,1fr)] overflow-hidden bg-background text-foreground md:grid-cols-[15rem_minmax(0,1fr)]">
			<a
				href="#workspace-content"
				className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:p-4"
			>
				Skip to documents
			</a>
			<SideBar sidebarLink={sidebarData(sidebarInfo)} />

			<div className="relative flex min-w-0 flex-col overflow-hidden">
				<header className="shrink-0 border-b bg-card px-4 py-3 sm:px-6 lg:px-8">
					<TopBar />
				</header>

				<div
					id="workspace-content"
					tabIndex={-1}
					className="flex min-h-0 flex-1 flex-col overflow-y-auto [scrollbar-gutter:stable] px-4 py-6 outline-none sm:px-6 lg:px-8 lg:py-8"
				>
					<ProfilePopup />
					<div className="mx-auto flex w-full min-h-0 min-w-0 max-w-7xl flex-1 flex-col">
						<Outlet />
					</div>
				</div>
			</div>
		</main>
	);
};

export default Dashboard;

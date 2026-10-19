import { Outlet } from "react-router-dom";

const Main = () => {
	return (
		<div className="workspace-page min-h-svh min-w-0 bg-background text-foreground antialiased">
			<Outlet />
		</div>
	);
};

export default Main;

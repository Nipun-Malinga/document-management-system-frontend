import { Outlet } from "react-router-dom";

const Editor = () => {
	return (
		<div className="editor-page flex h-svh min-w-0 flex-col overflow-hidden bg-background text-foreground antialiased">
			<Outlet />
		</div>
	);
};

export default Editor;

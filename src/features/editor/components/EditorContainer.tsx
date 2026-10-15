import type { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

const EditorContainer = ({ children }: Props) => {
	return <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>;
};

export default EditorContainer;

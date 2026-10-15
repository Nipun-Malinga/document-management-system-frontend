import { ArrowUpRight } from "lucide-react";
import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import FlowDocsBrand from "@/components/common/FlowDocsBrand";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { SidebarLink } from "@/models/Link";
import useAside from "@/states/useAside";
import { workspaceNavigationClass } from "./workspaceNavigation";

interface Props {
	sidebarLink: SidebarLink[];
}

const SideBar = ({ sidebarLink }: Props) => {
	const { collapsed, toggle } = useAside();
	const close = () => {
		if (!useAside.getState().collapsed) toggle();
	};
	useEffect(() => {
		const media = window.matchMedia("(min-width: 768px)");
		const onResize = () => {
			if (media.matches && !useAside.getState().collapsed)
				useAside.getState().toggle();
		};
		onResize();
		media.addEventListener("change", onResize);
		return () => {
			media.removeEventListener("change", onResize);
			if (!useAside.getState().collapsed) useAside.getState().toggle();
		};
	}, []);
	const content = (
		<>
			<div className="px-3 pb-8 pt-2">
				<FlowDocsBrand />
			</div>
			<p className="px-3 pb-3 text-xs font-medium text-muted-foreground">
				Workspace
			</p>
			<nav aria-label="Workspace navigation" className="flex flex-col gap-1">
				{sidebarLink.map((item) => (
					<NavLink
						key={item.endpoint}
						to={`/dashboard/${item.endpoint}`}
						onClick={close}
						className={({ isActive }) => workspaceNavigationClass(isActive)}
					>
						<item.icon aria-hidden="true" className="size-4 shrink-0" />
						<span className="flex-1">{item.title}</span>
						<span className="text-xs tabular-nums">
							{item.count ?? (
								<>
									<span aria-hidden="true">—</span>
									<span className="sr-only">
										{item.title} count unavailable
									</span>
								</>
							)}
						</span>
					</NavLink>
				))}
			</nav>
			<div className="mt-auto flex flex-col gap-4 px-3 pt-12">
				<Separator />
				<p className="text-sm leading-relaxed text-muted-foreground">
					A little structure.
					<br />
					More room for your ideas.
				</p>
				<Link
					to="/"
					className="flex items-center gap-2 rounded-sm text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-ring"
				>
					Explore FlowDocs
					<ArrowUpRight aria-hidden="true" className="size-3.5" />
				</Link>
			</div>
		</>
	);
	return (
		<>
			<aside className="hidden min-h-0 flex-col overflow-y-auto border-r bg-card p-4 md:flex">
				{content}
			</aside>
			<Dialog
				open={!collapsed}
				onOpenChange={(open) => {
					if (open === collapsed) toggle();
				}}
			>
				<DialogContent
					layout="custom"
					className="workspace-page left-0 top-0 flex h-svh max-h-svh w-72 overflow-y-auto max-w-[calc(100%-3rem)] translate-x-0 translate-y-0 flex-col rounded-none p-4 sm:max-w-72"
					onCloseAutoFocus={(event) => {
						event.preventDefault();
						document
							.getElementById(
								window.matchMedia("(min-width: 768px)").matches
									? "workspace-content"
									: "workspace-menu",
							)
							?.focus();
					}}
				>
					<DialogTitle className="sr-only">Workspace navigation</DialogTitle>
					<DialogDescription className="sr-only">
						Choose a document collection.
					</DialogDescription>
					{content}
				</DialogContent>
			</Dialog>
		</>
	);
};
export default SideBar;

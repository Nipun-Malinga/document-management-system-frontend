import { History, X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
	DrawerClose,
	DrawerContent,
	DrawerTrigger,
	Drawer as Drw,
} from "../ui/drawer";

interface Props {
	title: string;
	children: ReactNode;
}
const Drawer = ({ title, children }: Props) => (
	<Drw direction="right">
		<DrawerTrigger asChild>
			<Button variant="outline" size="sm">
				<History aria-hidden="true" data-icon="inline-start" />
				{title}
			</Button>
		</DrawerTrigger>
		<DrawerContent className="h-svh data-[vaul-drawer-direction=right]:w-full data-[vaul-drawer-direction=right]:sm:max-w-xl">
			<DrawerClose asChild>
				<Button
					variant="ghost"
					size="icon"
					aria-label="Close advanced document settings"
					className="absolute right-3 top-3"
				>
					<X aria-hidden="true" />
				</Button>
			</DrawerClose>
			<div className="flex min-h-0 flex-1 flex-col">{children}</div>
		</DrawerContent>
	</Drw>
);
export default Drawer;

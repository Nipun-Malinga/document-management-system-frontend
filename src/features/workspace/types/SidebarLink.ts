import type { IconType } from "react-icons";
import type { Link } from "@/shared/types/Link";

export interface SidebarLink extends Link {
	icon: IconType;
	count: number | null;
}

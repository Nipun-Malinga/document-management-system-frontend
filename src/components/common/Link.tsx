import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavItemProps {
	title?: string;
	endpoint: string;
	children?: ReactNode;
	className?: string;
	onClick?: () => void;
}

const NavItem = ({
	title,
	endpoint,
	children,
	className,
	onClick,
}: NavItemProps) => {
	const location = useLocation();

	const isActive =
		location.pathname === endpoint || location.pathname.startsWith(endpoint);

	return (
		<Link
			to={endpoint}
			className={`mb-1.5 px-3 py-1 rounded-lg cursor-pointer flex items-center transition duration-100 ease-in-out ${
				isActive
					? "bg-gray-300 dark:bg-gray-700 font-bold"
					: "hover:bg-gray-300 hover:dark:bg-gray-600"
			} ${className}`}
			onClick={onClick}
		>
			{title && <span>{title}</span>}
			{children}
		</Link>
	);
};

export default NavItem;

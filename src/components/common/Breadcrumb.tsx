import { Fragment } from "react/jsx-runtime";
import { Link as RouterLink } from "react-router-dom";
import type { Link } from "@/shared/types/Link";
import {
	Breadcrumb as Bc,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "../ui/breadcrumb";

interface Props {
	links: Link[];
}

const Breadcrumb = ({ links }: Props) => {
	return (
		<Bc className="mb-6">
			<BreadcrumbList className="flex items-center gap-2">
				{links.map((link, key) => (
					<Fragment key={link.endpoint}>
						<BreadcrumbItem>
							{key === links.length - 1 ? (
								<BreadcrumbPage className="font-semibold text-gray-900 dark:text-gray-100">
									{link.title}
								</BreadcrumbPage>
							) : (
								<BreadcrumbLink
									asChild
									className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-150 font-medium"
								>
									<RouterLink to={link.endpoint}>{link.title}</RouterLink>
								</BreadcrumbLink>
							)}
						</BreadcrumbItem>
						{key !== links.length - 1 && (
							<BreadcrumbSeparator className="text-gray-400 dark:text-gray-600" />
						)}
					</Fragment>
				))}
			</BreadcrumbList>
		</Bc>
	);
};

export default Breadcrumb;

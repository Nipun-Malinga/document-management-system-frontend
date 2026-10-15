import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import DarkThemeButton from "@/components/common/DarkThemeButton";
import FlowDocsBrand from "@/components/common/FlowDocsBrand";
import { Button } from "@/components/ui/button";

interface Props {
	showSectionLinks?: boolean;
}

const Navbar = ({ showSectionLinks = true }: Props) => (
	<header className="shrink-0 border-b border-border">
		<div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
			<FlowDocsBrand />
			{showSectionLinks && (
				<nav
					aria-label="Main navigation"
					className="hidden items-center gap-8 md:flex"
				>
					<Link className="home-text-link" to="/#features">
						Features
					</Link>
					<Link className="home-text-link" to="/#workspace">
						How it works
					</Link>
				</nav>
			)}
			<div className="flex items-center gap-1 sm:gap-3">
				<DarkThemeButton />
				<Button asChild variant="ghost">
					<Link to="/auth/signin">Sign in</Link>
				</Button>
				<Button asChild className="hidden sm:inline-flex">
					<Link to="/auth/registration">
						Get started
						<ArrowRight aria-hidden="true" data-icon="inline-end" />
					</Link>
				</Button>
			</div>
		</div>
	</header>
);

export default Navbar;

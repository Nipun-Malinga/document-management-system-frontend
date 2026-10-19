import { FileText, GitBranch, Users } from "lucide-react";
import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface Props {
	children: ReactNode;
	title: string;
	description: string;
	mode: "register" | "signin";
}

const AuthLayout = ({ children, title, description, mode }: Props) => (
	<div className="auth-page flex min-h-svh flex-col bg-background text-foreground">
		<Navbar showSectionLinks={false} />
		<main className="mx-auto flex w-full max-w-7xl flex-1 items-start px-5 py-8 sm:px-8 sm:py-12 lg:items-center lg:px-12">
			<div
				className={cn(
					"grid w-full overflow-hidden rounded-2xl border bg-card lg:grid-cols-[0.95fr_1.05fr]",
					mode === "register" && "lg:grid-cols-[0.85fr_1.15fr]",
				)}
			>
				<aside
					className="hidden flex-col justify-between gap-10 border-r bg-secondary/50 p-10 lg:flex xl:p-12"
					aria-labelledby="auth-intro-title"
				>
					<div className="flex flex-col gap-6">
						<h2
							id="auth-intro-title"
							className="max-w-lg text-4xl font-semibold leading-[1.12] tracking-[-0.03em] text-balance xl:text-[2.5rem]"
						>
							{mode === "register" ? (
								<>
									Documents in order.
									<br />
									Ideas in motion.
								</>
							) : (
								<>
									Your next chapter.
									<br />
									Right where you left it.
								</>
							)}
						</h2>
						<p className="max-w-md leading-relaxed text-muted-foreground">
							{mode === "register"
								? "One home for your team's documents. Make room for your ideas and the people who help them grow."
								: "Come back to your documents, reconnect with your team, and keep your best ideas moving forward."}
						</p>
					</div>
					<div className="flex flex-col gap-7">
						<Separator />
						<ul className="flex max-w-md flex-col gap-6">
							{[
								{
									icon: FileText,
									title: "A place for every document",
									text: "Create from a blank page or start with a template.",
								},
								{
									icon: Users,
									title: "Better work, together",
									text: "Collaborate in real time with the right permissions.",
								},
								{
									icon: GitBranch,
									title: "Room for every draft",
									text: "Explore branches and revisit saved versions.",
								},
							].map(({ icon: Icon, title: itemTitle, text }) => (
								<li key={itemTitle} className="flex items-start gap-4">
									<Icon
										aria-hidden="true"
										className="mt-0.5 size-5 shrink-0 text-primary"
										strokeWidth={1.5}
									/>
									<div className="flex flex-col gap-1">
										<p className="text-sm font-semibold">{itemTitle}</p>
										<p className="text-sm leading-relaxed text-muted-foreground">
											{text}
										</p>
									</div>
								</li>
							))}
						</ul>
					</div>
				</aside>
				<section
					aria-labelledby="auth-title"
					className={cn(
						"mx-auto flex w-full min-w-0 max-w-xl flex-col justify-center gap-6 p-6 sm:p-10 xl:p-12",
						mode === "register" && "max-w-2xl",
					)}
				>
					<div className="flex flex-col gap-3">
						<h1
							id="auth-title"
							className="text-3xl font-semibold leading-tight tracking-tight text-balance"
						>
							{title}
						</h1>
						<p className="text-sm leading-relaxed text-muted-foreground">
							{description}
						</p>
					</div>
					{children}
				</section>
			</div>
		</main>
	</div>
);

export default AuthLayout;

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
		<main
			className={cn(
				"mx-auto grid w-full max-w-7xl flex-1 items-center gap-8 px-5 py-4 sm:px-8 lg:grid-cols-2 lg:gap-12 lg:px-12",
				mode === "register" && "lg:grid-cols-[0.85fr_1.15fr]",
			)}
		>
			<aside
				className="hidden flex-col gap-5 lg:flex"
				aria-labelledby="auth-intro-title"
			>
				<h2
					id="auth-intro-title"
					className="max-w-lg text-4xl leading-[1.08] font-semibold tracking-[-0.035em] text-balance xl:text-5xl"
				>
					{mode === "register" ? (
						<>
							Documents in order.
							<br />
							<span className="text-primary">Ideas in motion.</span>
						</>
					) : (
						<>
							Your next chapter.
							<br />
							<span className="text-primary">Right where you left it.</span>
						</>
					)}
				</h2>
				<p className="max-w-md leading-relaxed text-muted-foreground">
					{mode === "register"
						? "One home for your team's documents. Make room for your ideas and the people who help them grow."
						: "Come back to your documents, reconnect with your team, and keep your best ideas moving forward."}
				</p>
				<Separator className="my-2 max-w-md" />
				<ul className="flex max-w-md flex-col gap-5">
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
			</aside>
			<section
				aria-labelledby="auth-title"
				className={cn(
					"mx-auto flex w-full min-w-0 max-w-lg flex-col gap-5 rounded-xl border border-border bg-card p-5 sm:p-6",
					mode === "register" && "max-w-xl",
				)}
			>
				<div className="flex flex-col gap-2">
					<h1
						id="auth-title"
						className="text-2xl font-semibold tracking-tight text-balance"
					>
						{title}
					</h1>
					<p className="text-sm leading-relaxed text-muted-foreground">
						{description}
					</p>
				</div>
				{children}
			</section>
		</main>
	</div>
);

export default AuthLayout;

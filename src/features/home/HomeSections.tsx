import {
	ArrowRight,
	FileText,
	GitBranch,
	History,
	LockKeyhole,
	Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const capabilities = [
	{
		icon: FileText,
		title: "A place for every document",
		description:
			"Start with a template, make it your own, and keep your team's work together in one workspace.",
	},
	{
		icon: Users,
		title: "Make progress together",
		description:
			"Write and edit in real time. Share with collaborators and choose who can view or make changes.",
	},
	{
		icon: History,
		title: "Keep the story of your work",
		description:
			"Explore ideas in separate branches and revisit saved versions without losing sight of the original.",
	},
];

const workflow = [
	{
		icon: FileText,
		title: "Start with a document",
		text: "Open a blank page or choose a template to get your ideas down.",
	},
	{
		icon: LockKeyhole,
		title: "Bring the right people in",
		text: "Invite collaborators with read-only or editing access.",
	},
	{
		icon: GitBranch,
		title: "Give your ideas room to grow",
		text: "Try a new direction on a branch and revisit saved versions along the way.",
	},
];

export function HomeFeatures() {
	return (
		<section
			id="features"
			aria-labelledby="features-title"
			className="scroll-mt-8 border-y bg-card"
		>
			<div className="home-container py-16 lg:py-24">
				<div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
					<h2
						id="features-title"
						className="max-w-lg text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl"
					>
						Less looking for files.
						<br />
						More getting things done.
					</h2>
					<p className="max-w-sm leading-relaxed text-muted-foreground">
						From the first draft to the next big idea, keep your documents and
						the people behind them connected.
					</p>
				</div>
				<div className="grid gap-8 md:grid-cols-3 md:gap-10">
					{capabilities.map(({ icon: Icon, title, description }) => (
						<article
							key={title}
							className="flex flex-col items-start gap-4 border-t pt-6"
						>
							<Icon
								aria-hidden="true"
								className="size-6 text-primary"
								strokeWidth={1.5}
							/>
							<h3 className="text-lg font-semibold tracking-tight">{title}</h3>
							<p className="max-w-sm leading-relaxed text-muted-foreground">
								{description}
							</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}

export function HomeWorkflow() {
	return (
		<section
			id="workspace"
			aria-labelledby="workspace-title"
			className="home-container grid scroll-mt-8 gap-12 py-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24 lg:py-24"
		>
			<div className="flex flex-col items-start gap-6">
				<h2
					id="workspace-title"
					className="max-w-md text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl"
				>
					Room to explore.
					<br />A history to come back to.
				</h2>
				<p className="max-w-md leading-relaxed text-muted-foreground">
					Good work takes a few drafts. FlowDocs brings editing, sharing,
					branches, and saved versions into the same place, so your team can
					focus on what comes next.
				</p>
				<Button asChild variant="outline">
					<Link to="/auth/registration">
						Make room for your next idea
						<ArrowRight aria-hidden="true" data-icon="inline-end" />
					</Link>
				</Button>
			</div>
			<ol className="flex flex-col gap-7">
				{workflow.map(({ icon: Icon, title, text }, index) => (
					<li key={title}>
						{index > 0 && <Separator className="mb-7" />}
						<div className="flex items-start gap-5">
							<span
								aria-hidden="true"
								className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary"
							>
								<Icon className="size-5" strokeWidth={1.5} />
							</span>
							<div className="flex flex-col gap-2">
								<h3 className="font-semibold">{title}</h3>
								<p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
									{text}
								</p>
							</div>
						</div>
					</li>
				))}
			</ol>
		</section>
	);
}

export function HomeClosing() {
	return (
		<section
			aria-labelledby="get-started-title"
			className="home-container pb-8"
		>
			<div className="flex flex-col items-start justify-between gap-8 rounded-2xl bg-secondary p-8 sm:p-12 md:flex-row md:items-center lg:p-16">
				<div className="flex flex-col gap-3">
					<h2
						id="get-started-title"
						className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
					>
						Your best work starts here.
					</h2>
					<p className="max-w-md leading-relaxed text-muted-foreground">
						Bring your documents together. Take the next step.
					</p>
				</div>
				<Button asChild size="lg" className="w-full shrink-0 sm:w-auto">
					<Link to="/auth/registration">
						Get started with FlowDocs
						<ArrowRight aria-hidden="true" data-icon="inline-end" />
					</Link>
				</Button>
			</div>
		</section>
	);
}

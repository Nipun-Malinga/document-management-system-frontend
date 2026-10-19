import {
	ArrowDown,
	ArrowRight,
	Check,
	FileText,
	GitBranch,
	History,
	LockKeyhole,
	Users,
} from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import WorkspacePreview from "@/features/home/WorkspacePreview";

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

const Home = () => {
	const location = useLocation();

	useEffect(() => {
		if (location.hash)
			document.getElementById(location.hash.slice(1))?.scrollIntoView();
	}, [location]);

	return (
		<div className="home-page min-h-screen bg-background text-foreground">
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:p-4 focus:text-foreground"
			>
				Skip to content
			</a>
			<Navbar />
			<main id="main-content">
				<section
					aria-labelledby="hero-title"
					className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-16 sm:px-8 sm:pt-20 lg:grid-cols-[0.7fr_1.3fr] lg:gap-8 lg:px-8 lg:pb-24 lg:pt-24"
				>
					<div className="flex flex-col items-start gap-7">
						<h1
							id="hero-title"
							className="max-w-xl text-5xl leading-[1.08] font-semibold tracking-[-0.035em] text-balance sm:text-6xl xl:text-7xl"
						>
							Documents in order.
							<br />
							<span className="text-primary">Ideas in motion.</span>
						</h1>
						<p className="max-w-md text-lg leading-relaxed text-muted-foreground">
							One home for your team's documents. Create, collaborate, and keep
							every version moving in the right direction.
						</p>
						<div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
							<Button asChild size="lg">
								<Link to="/auth/registration">
									Create your workspace
									<ArrowRight aria-hidden="true" data-icon="inline-end" />
								</Link>
							</Button>
							<Button asChild variant="outline" size="lg">
								<a href="#workspace">
									Explore FlowDocs
									<ArrowDown aria-hidden="true" data-icon="inline-end" />
								</a>
							</Button>
						</div>
						<ul
							className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground"
							aria-label="Workspace capabilities"
						>
							{[
								"Live collaboration",
								"Version history",
								"Your permissions",
							].map((label) => (
								<li key={label} className="flex items-center gap-1.5">
									<Check aria-hidden="true" className="size-3.5 text-primary" />
									{label}
								</li>
							))}
						</ul>
					</div>
					<WorkspacePreview />
				</section>
				<section
					id="features"
					aria-labelledby="features-title"
					className="scroll-mt-8 border-y border-border bg-card"
				>
					<div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
						<div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
							<h2
								id="features-title"
								className="max-w-lg text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl"
							>
								Less looking for files.
								<br />
								More getting things done.
							</h2>
							<p className="max-w-sm leading-relaxed text-muted-foreground">
								From the first draft to the next big idea, keep your documents
								and the people behind them connected.
							</p>
						</div>
						<div className="grid gap-10 md:grid-cols-3 md:gap-12">
							{capabilities.map(({ icon: Icon, title, description }) => (
								<div key={title} className="flex flex-col items-start gap-4">
									<Icon
										aria-hidden="true"
										className="size-6 text-primary"
										strokeWidth={1.5}
									/>
									<h3 className="text-lg font-semibold tracking-tight">
										{title}
									</h3>
									<p className="leading-relaxed text-muted-foreground">
										{description}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>
				<section
					id="workspace"
					aria-labelledby="workspace-title"
					className="mx-auto grid max-w-7xl scroll-mt-8 items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-24 lg:px-12 lg:py-24"
				>
					<div className="flex flex-col gap-6">
						<h2
							id="workspace-title"
							className="max-w-md text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl"
						>
							Room to explore.
							<br />A history to come back to.
						</h2>
						<p className="max-w-md leading-relaxed text-muted-foreground">
							Good work takes a few drafts. FlowDocs brings editing, sharing,
							branches, and saved versions into the same place, so your team can
							focus on what comes next.
						</p>
						<Button asChild variant="link" className="w-fit px-0">
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
									<div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-card">
										<Icon
											aria-hidden="true"
											className="size-5 text-primary"
											strokeWidth={1.5}
										/>
									</div>
									<div className="flex flex-col gap-2">
										<h3 className="font-semibold">{title}</h3>
										<p className="text-sm leading-relaxed text-muted-foreground">
											{text}
										</p>
									</div>
								</div>
							</li>
						))}
					</ol>
				</section>
				<section
					aria-labelledby="get-started-title"
					className="border-y border-border bg-secondary"
				>
					<div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 px-5 py-14 sm:px-8 md:flex-row md:items-center lg:px-12">
						<div className="flex flex-col gap-3">
							<h2
								id="get-started-title"
								className="text-3xl font-semibold tracking-tight text-balance"
							>
								Your best work starts here.
							</h2>
							<p className="text-muted-foreground">
								Bring your documents together. Take the next step.
							</p>
						</div>
						<Button asChild size="lg" className="w-full sm:w-auto">
							<Link to="/auth/registration">
								Get started with FlowDocs
								<ArrowRight aria-hidden="true" data-icon="inline-end" />
							</Link>
						</Button>
					</div>
				</section>
			</main>
			<footer className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-5 py-7 text-sm sm:flex-row sm:px-8 lg:px-12">
				<p className="font-semibold">
					FlowDocs
					{""}
					<span className="ml-3 font-normal text-muted-foreground">
						A little more flow. A lot less friction.
					</span>
				</p>
				<a href="#main-content" className="home-text-link w-fit">
					Back to top
				</a>
			</footer>
		</div>
	);
};

export default Home;

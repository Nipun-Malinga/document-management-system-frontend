import { ArrowDown, ArrowRight, Check } from "lucide-react";
import { lazy, Suspense, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import {
	HomeClosing,
	HomeFeatures,
	HomeWorkflow,
} from "@/features/home/HomeSections";
import {
	WorkspacePreviewError,
	WorkspacePreviewLoading,
} from "@/features/home/WorkspacePreviewFeedback";

const WorkspacePreview = lazy(() =>
	import("@/features/home/WorkspacePreview").catch(() => ({
		default: WorkspacePreviewError,
	})),
);

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
					className="home-container pb-16 pt-12 sm:pt-16 lg:pb-20 lg:pt-20"
				>
					<div className="grid items-end gap-8 pb-10 lg:grid-cols-[1.4fr_1fr] lg:gap-10 lg:pb-12">
						<h1
							id="hero-title"
							className="max-w-2xl text-5xl font-semibold leading-[1.06] tracking-[-0.035em] text-balance sm:text-6xl lg:text-5xl xl:text-[4rem]"
						>
							Documents in order.
							<br />
							Ideas in motion.
						</h1>
						<div className="flex flex-col items-start gap-6 lg:pb-1">
							<p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
								One home for your team's documents. Create, collaborate, and
								keep every version moving in the right direction.
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
						</div>
					</div>
					<Suspense fallback={<WorkspacePreviewLoading />}>
						<WorkspacePreview />
					</Suspense>
					<ul
						className="mt-7 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
						aria-label="Workspace capabilities"
					>
						{["Live collaboration", "Version history", "Your permissions"].map(
							(label) => (
								<li key={label} className="flex items-center gap-2">
									<Check aria-hidden="true" className="size-4 text-primary" />
									{label}
								</li>
							),
						)}
					</ul>
				</section>
				<HomeFeatures />
				<HomeWorkflow />
				<HomeClosing />
			</main>
			<footer className="home-container flex flex-col justify-between gap-4 py-8 text-sm sm:flex-row sm:items-center">
				<p className="font-semibold">
					FlowDocs
					<span className="mt-2 block font-normal text-muted-foreground sm:ml-3 sm:mt-0 sm:inline">
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

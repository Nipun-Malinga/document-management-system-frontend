import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home from "@/pages/Home";

const renderHome = () =>
	render(
		<MemoryRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/auth/registration" element={<h1>Registration</h1>} />
				<Route path="/auth/signin" element={<h1>Sign in to FlowDocs</h1>} />
			</Routes>
		</MemoryRouter>,
	);

beforeEach(() => {
	vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false }));
});

afterEach(() => {
	document.documentElement.classList.remove("dark");
	vi.unstubAllGlobals();
});

describe("home page", () => {
	it("switches themes and remembers the choice after remounting", async () => {
		const user = userEvent.setup();
		const { unmount } = renderHome();
		await user.click(
			screen.getByRole("button", { name: "Switch to dark theme" }),
		);
		expect(document.documentElement).toHaveClass("dark");
		expect(localStorage.getItem("theme")).toBe("dark");
		unmount();
		renderHome();
		await user.click(
			screen.getByRole("button", { name: "Switch to light theme" }),
		);
		expect(document.documentElement).not.toHaveClass("dark");
		expect(localStorage.getItem("theme")).toBe("light");
	});

	it("uses the system theme when no preference has been saved", () => {
		vi.mocked(window.matchMedia).mockReturnValue({
			matches: true,
		} as MediaQueryList);
		renderHome();
		expect(document.documentElement).toHaveClass("dark");
		expect(
			screen.getByRole("button", { name: "Switch to light theme" }),
		).toBeVisible();
	});

	it("honors a saved light preference over the system theme", () => {
		localStorage.setItem("theme", "light");
		vi.mocked(window.matchMedia).mockReturnValue({
			matches: true,
		} as MediaQueryList);
		renderHome();
		expect(document.documentElement).not.toHaveClass("dark");
		expect(
			screen.getByRole("button", { name: "Switch to dark theme" }),
		).toBeVisible();
	});

	it("uses the dashboard composition and keeps sample bookmarks when navigating collections", async () => {
		const user = userEvent.setup();
		renderHome();
		const preview = screen.getByRole("figure", {
			name: "Interactive FlowDocs workspace preview",
		});
		expect(
			within(preview).getByRole("heading", { name: "Your documents" }),
		).toBeVisible();
		expect(
			within(preview).getByRole("heading", { name: "Start something new" }),
		).toBeVisible();
		expect(
			within(preview).getByRole("heading", { name: "All documents" }),
		).toBeVisible();
		await user.click(
			within(preview).getByRole("button", { name: "Bookmark Team playbook" }),
		);
		await user.click(
			within(preview).getByRole("button", { name: "Quick Access 2" }),
		);
		expect(
			within(preview).getByRole("button", { name: "Open Team playbook" }),
		).toBeVisible();
		expect(
			within(preview).queryByRole("button", {
				name: "Open Ideas worth exploring",
			}),
		).not.toBeInTheDocument();
		await user.click(
			within(preview).getByRole("button", { name: "Open Team playbook" }),
		);
		expect(
			within(preview).getByRole("heading", { name: "Team playbook" }),
		).toHaveFocus();
		expect(
			within(preview).getByText("Sample document · Read only"),
		).toBeVisible();
		await user.click(
			within(preview).getByRole("button", { name: "Back to documents" }),
		);
		expect(
			within(preview).getByRole("button", { name: "Open Team playbook" }),
		).toHaveFocus();
		expect(
			within(preview).getByRole("button", { name: "Bookmark Team playbook" }),
		).toHaveAttribute("aria-pressed", "true");
	});

	it("supports keyboard navigation through the sample collections", async () => {
		const user = userEvent.setup();
		renderHome();
		const navigation = screen.getByRole("navigation", {
			name: "Preview workspace navigation",
		});
		await user.click(
			within(navigation).getByRole("button", { name: "Home 3" }),
		);
		await user.tab();
		expect(
			within(navigation).getByRole("button", { name: "Quick Access 1" }),
		).toHaveFocus();
		await user.keyboard("{Enter}");
		expect(
			within(navigation).getByRole("button", { name: "Quick Access 1" }),
		).toHaveAttribute("aria-current", "page");
		expect(screen.getByRole("heading", { name: "Quick Access" })).toBeVisible();
	});

	it("matches full titles, recovers from an empty search, and shows only documents shared with the sample user", async () => {
		const user = userEvent.setup();
		renderHome();
		const preview = screen.getByRole("figure");
		const search = within(preview).getByRole("textbox", {
			name: "Search documents by exact title",
		});
		await user.type(search, "Team");
		expect(
			within(preview).getByText("No documents match this exact title."),
		).toBeVisible();
		await user.click(
			within(preview).getByRole("button", { name: "Clear search" }),
		);
		await user.type(search, "Team playbook");
		expect(
			within(preview).getByRole("button", { name: "Open Team playbook" }),
		).toBeVisible();
		expect(
			within(preview).queryByRole("button", { name: "Open The next chapter" }),
		).not.toBeInTheDocument();
		await user.click(
			within(preview).getByRole("button", { name: "Shared With Me 1" }),
		);
		expect(within(preview).getByRole("textbox")).toHaveValue("");
		expect(
			within(preview).getByRole("button", { name: "Open Launch notes" }),
		).toBeVisible();
		expect(
			within(preview).queryByRole("button", { name: "Bookmark Launch notes" }),
		).not.toBeInTheDocument();
		await user.click(within(preview).getByRole("button", { name: "Trash 0" }));
		expect(
			within(preview).getByText("Your sample trash is empty."),
		).toBeVisible();
	});

	it.each(["New document", "Create document from Blank document"])(
		"routes sample creation via %s to registration",
		async (name) => {
			const user = userEvent.setup();
			renderHome();
			const preview = screen.getByRole("figure");
			await user.click(
				within(preview).getByRole(name === "New document" ? "link" : "button", {
					name,
				}),
			);
			expect(
				screen.getByRole("heading", { name: "Registration" }),
			).toBeVisible();
		},
	);

	it.each([
		["Create your workspace", "Registration"],
		["Sign in", "Sign in to FlowDocs"],
	])("navigates from %s to its existing auth route", async (link, heading) => {
		const user = userEvent.setup();
		renderHome();
		await user.click(screen.getByRole("link", { name: link }));
		expect(screen.getByRole("heading", { name: heading })).toBeVisible();
	});

	it("uses valid targets for every in-page navigation link", () => {
		renderHome();
		for (const link of screen.getAllByRole("link")) {
			const href = link.getAttribute("href");
			if (href?.startsWith("#")) {
				expect(document.getElementById(href.slice(1))).not.toBeNull();
			}
		}
		expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
		expect(
			screen.getByText(/interactive preview with sample content/i),
		).toBeVisible();
	});
});

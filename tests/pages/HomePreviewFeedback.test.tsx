import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, it, vi } from "vitest";
import Home from "@/pages/Home";

const preview = vi.hoisted(() => ({
	started: false,
	fail: (error: Error): void => {
		throw error;
	},
}));

vi.mock(
	"@/features/home/WorkspacePreview",
	() =>
		new Promise((_resolve, reject) => {
			preview.fail = reject;
			preview.started = true;
		}),
);

it("keeps the landing page usable while the preview loads and if its download fails", async () => {
	vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false }));
	render(
		<MemoryRouter>
			<Home />
		</MemoryRouter>,
	);
	expect(
		screen.getByRole("status", { name: "Loading workspace preview" }),
	).toBeVisible();
	expect(
		screen.getByRole("link", { name: "Create your workspace" }),
	).toHaveAttribute("href", "/auth/registration");
	await waitFor(() => expect(preview.started).toBe(true));
	await act(async () => {
		preview.fail(new Error("Preview download failed"));
	});
	expect(await screen.findByRole("alert")).toHaveTextContent(
		"The workspace preview couldn't load",
	);
	expect(screen.getByRole("link", { name: "Reload page" })).toHaveAttribute(
		"href",
		"/",
	);
	expect(
		screen.queryByRole("status", { name: "Loading workspace preview" }),
	).not.toBeInTheDocument();
	vi.unstubAllGlobals();
});

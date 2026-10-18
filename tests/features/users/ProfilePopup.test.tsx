import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import ProfilePopup from "@/features/users/components/ProfilePopup";
import { getSession, replaceAccessToken } from "@/states/sessionStore";
import useUserProfilePopup from "@/states/useUserProfilePopup";
import { tokenFor } from "../../fixtures";

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
	useUserProfilePopup.setState({ collapsed: true });
});

it("finishes its exit animation before unmounting and reopens with clean forms", async () => {
	// JSDOM has no CSS animation engine. Give Radix the live animation names
	// a browser supplies, then explicitly signal when each exit finishes.
	const getStyles = getComputedStyle;
	vi.spyOn(globalThis, "getComputedStyle").mockImplementation((element) => {
		const styles = getStyles(element);
		if (
			element.matches(
				'[data-slot="dialog-content"], [data-slot="dialog-overlay"]',
			)
		) {
			Object.defineProperty(styles, "animationName", {
				get: () =>
					element.getAttribute("data-state") === "closed"
						? "profile-exit"
						: "profile-enter",
			});
		}
		return styles;
	});
	vi.stubGlobal("CSS", { escape: (value: string) => value });

	replaceAccessToken(tokenFor());
	const client = new QueryClient({
		defaultOptions: { queries: { staleTime: Infinity, gcTime: Infinity } },
	});
	client.setQueryData(["profile", getSession().epoch], {
		id: 1,
		firstname: "Alex",
		lastname: "Morgan",
		username: "owner",
		email: "owner@example.com",
		role: "USER",
		locked: false,
	});
	useUserProfilePopup.setState({ collapsed: false });
	const { unmount } = render(
		<QueryClientProvider client={client}>
			<ProfilePopup />
		</QueryClientProvider>,
	);
	const user = userEvent.setup();
	await screen.findByLabelText("First name");
	await user.click(screen.getByRole("tab", { name: "Password" }));
	await user.type(
		screen.getByLabelText("Current password", { exact: true }),
		"draft-password",
	);
	const dialog = screen.getByRole("dialog", { name: "Your profile" });
	const overlay = document.querySelector('[data-slot="dialog-overlay"]');
	if (!overlay) throw new Error("Dialog overlay was not mounted.");

	await user.click(screen.getByRole("button", { name: "Close" }));
	expect(dialog).toBeInTheDocument();
	expect(dialog).toHaveAttribute("data-state", "closed");
	expect(
		screen.getByLabelText("Current password", { exact: true }),
	).toHaveValue("draft-password");
	expect(overlay).toHaveAttribute("data-state", "closed");

	for (const element of [dialog, overlay]) {
		const event = new Event("animationend", { bubbles: true });
		Object.defineProperty(event, "animationName", { value: "profile-exit" });
		fireEvent(element, event);
	}
	await waitFor(() => expect(dialog).not.toBeInTheDocument());
	expect(overlay).not.toBeInTheDocument();

	act(() => useUserProfilePopup.setState({ collapsed: false }));
	expect(await screen.findByLabelText("First name")).toHaveValue("Alex");
	expect(screen.getByRole("tab", { name: "Profile" })).toHaveAttribute(
		"aria-selected",
		"true",
	);
	await user.click(screen.getByRole("tab", { name: "Password" }));
	expect(
		screen.getByLabelText("Current password", { exact: true }),
	).toHaveValue("");
	unmount();
	client.clear();
});

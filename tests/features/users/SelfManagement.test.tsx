import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import UserDropdown from "@/components/common/UserDropdown";
import ProfilePopup from "@/features/users/components/ProfilePopup";
import { axiosInstance } from "@/services/apiService";
import { getSession, replaceAccessToken } from "@/states/sessionStore";
import useUserProfilePopup from "@/states/useUserProfilePopup";
import { tokenFor } from "../../fixtures";

const baseURL = process.env.DMS_SELF_SERVICE_URL;
const originalBaseURL = axiosInstance.defaults.baseURL;
let client: QueryClient;

describe.skipIf(!baseURL)(
	"self-management over real HTTP against the Postman simulation",
	() => {
		beforeEach(async () => {
			client = new QueryClient({
				defaultOptions: {
					queries: { retry: false, gcTime: 0 },
					mutations: { retry: false },
				},
			});
			await fetch(`${baseURL}/__reset`, { method: "POST" });
			axiosInstance.defaults.baseURL = `${baseURL}/api`;
			replaceAccessToken(tokenFor());
			useUserProfilePopup.setState({ collapsed: false });
		});
		afterEach(() => {
			axiosInstance.defaults.baseURL = originalBaseURL;
			client.clear();
			useUserProfilePopup.setState({ collapsed: true });
		});
		const open = async () => {
			render(
				<QueryClientProvider client={client}>
					<MemoryRouter>
						<UserDropdown />
						<ProfilePopup />
					</MemoryRouter>
				</QueryClientProvider>,
			);
			await screen.findByLabelText("First name");
			return userEvent.setup();
		};
		const fillPasswords = async (
			user: ReturnType<typeof userEvent.setup>,
			current = "old-password",
			confirmation = "new-password",
		) => {
			await user.click(screen.getByRole("tab", { name: "Password" }));
			await user.type(
				screen.getByLabelText("Current password", { exact: true }),
				current,
			);
			await user.type(
				screen.getByLabelText("New password", { exact: true }),
				"new-password",
			);
			await user.type(
				screen.getByLabelText("Confirm new password", { exact: true }),
				confirmation,
			);
		};
		it("recovers from a failed profile load when retried", async () => {
			await fetch(`${baseURL}/__scenario`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ profileFailure: true }),
			});
			render(
				<QueryClientProvider client={client}>
					<ProfilePopup />
				</QueryClientProvider>,
			);
			expect(await screen.findByRole("alert")).toHaveTextContent(
				"Could not load your profile",
			);
			await fetch(`${baseURL}/__scenario`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({}),
			});
			await userEvent
				.setup()
				.click(screen.getByRole("button", { name: "Retry profile" }));
			expect(await screen.findByLabelText("First name")).toHaveValue("Alex");
		});
		it("loads authoritative details, saves only editable fields, and updates account display/cache", async () => {
			const user = await open();
			expect(screen.getByLabelText("First name")).toHaveValue("Alex");
			expect(screen.getByRole("textbox", { name: "Username" })).toHaveValue(
				"owner",
			);
			expect(screen.getByRole("textbox", { name: "Username" })).toHaveAttribute(
				"readonly",
			);
			expect(
				screen.getByRole("button", { name: "Save profile" }),
			).toBeDisabled();
			await user.clear(screen.getByLabelText("Email address"));
			await user.type(
				screen.getByLabelText("Email address"),
				"updated@example.com",
			);
			await user.click(screen.getByRole("button", { name: "Save profile" }));
			expect(await screen.findByRole("status")).toHaveTextContent(
				"Use your updated email",
			);
			expect(getSession().user?.email).toBe("updated@example.com");
			expect(
				client.getQueryData(["my-profile", getSession().epoch]),
			).toMatchObject({
				email: "updated@example.com",
				username: "owner",
				role: "USER",
				locked: false,
			});
			await user.keyboard("{Escape}");
			await waitFor(() =>
				expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
			);
			expect(screen.getByRole("button", { name: "owner" })).toHaveFocus();
		});
		it("keeps conflicting email input and associates the server error with that field", async () => {
			const user = await open();
			await user.clear(screen.getByLabelText("Email address"));
			await user.type(
				screen.getByLabelText("Email address"),
				"taken@example.com",
			);
			await user.click(screen.getByRole("button", { name: "Save profile" }));
			await waitFor(() =>
				expect(screen.getByLabelText("Email address")).toHaveAttribute(
					"aria-invalid",
					"true",
				),
			);
			expect(screen.getByLabelText("Email address")).toHaveValue(
				"taken@example.com",
			);
			expect(getSession().user?.email).toBe("owner@example.com");
			await user.click(screen.getByRole("button", { name: "Reset changes" }));
			expect(screen.getByLabelText("Email address")).toHaveValue(
				"owner@example.com",
			);
		});
		it("handles wrong current password without a refresh/logout and allows correction", async () => {
			const user = await open();
			await fillPasswords(user, "wrong-password");
			await user.click(screen.getByRole("button", { name: "Change password" }));
			expect(
				await screen.findByText("Current password is incorrect. Try again."),
			).toBeVisible();
			expect(getSession().status).toBe("authenticated");
			expect(
				screen.getByLabelText("New password", { exact: true }),
			).toHaveValue("new-password");
			await user.clear(
				screen.getByLabelText("Current password", { exact: true }),
			);
			await user.type(
				screen.getByLabelText("Current password", { exact: true }),
				"old-password",
			);
			await user.click(screen.getByRole("button", { name: "Change password" }));
			expect(await screen.findByRole("status")).toHaveTextContent(
				"Password changed.",
			);
			for (const name of [
				"Current password",
				"New password",
				"Confirm new password",
			])
				expect(screen.getByLabelText(name, { exact: true })).toHaveValue("");
			expect(getSession().status).toBe("authenticated");
		});
		it("validates confirmation locally and protects dirty drafts when closing", async () => {
			const user = await open();
			await fillPasswords(user, "old-password", "different-password");
			expect(await screen.findByText("Passwords must match.")).toBeVisible();
			expect(
				screen.getByRole("button", { name: "Change password" }),
			).toBeDisabled();
			await user.keyboard("{Escape}");
			expect(await screen.findByText("Discard unsaved changes?")).toBeVisible();
			await user.click(screen.getByRole("button", { name: "Keep editing" }));
			expect(
				screen.getByLabelText("Current password", { exact: true }),
			).toHaveValue("old-password");
			await user.keyboard("{Escape}");
			await user.click(screen.getByRole("button", { name: "Discard changes" }));
			await waitFor(() =>
				expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
			);
		});
		it("preserves both dirty drafts through successful and failed background refetches", async () => {
			const user = await open();
			await user.clear(screen.getByLabelText("First name"));
			await user.type(screen.getByLabelText("First name"), "Jamie");
			await user.click(screen.getByRole("tab", { name: "Password" }));
			await user.type(
				screen.getByLabelText("Current password", { exact: true }),
				"draft-password",
			);
			await act(async () => {
				await client.invalidateQueries({ queryKey: ["my-profile"] });
			});
			expect(
				screen.getByLabelText("Current password", { exact: true }),
			).toHaveValue("draft-password");
			await fetch(`${baseURL}/__scenario`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ profileFailure: true }),
			});
			await act(async () => {
				await client.invalidateQueries({ queryKey: ["my-profile"] });
			});
			expect(
				screen.getByLabelText("Current password", { exact: true }),
			).toHaveValue("draft-password");
			await user.click(screen.getByRole("tab", { name: "Profile" }));
			expect(screen.getByLabelText("First name")).toHaveValue("Jamie");
		});
		it("times out a stalled password request, preserves inputs, and restores interaction", async () => {
			const user = await open();
			await fillPasswords(user);
			await fetch(`${baseURL}/__scenario`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ passwordDelay: true }),
			});
			await user.click(screen.getByRole("button", { name: "Change password" }));
			expect(screen.getByRole("tab", { name: "Profile" })).toBeDisabled();
			expect(
				await screen.findByRole("alert", {}, { timeout: 17000 }),
			).toHaveTextContent("The request took too long.");
			expect(
				screen.getByLabelText("Current password", { exact: true }),
			).toHaveValue("old-password");
			expect(
				screen.getByLabelText("New password", { exact: true }),
			).toHaveValue("new-password");
			expect(screen.getByRole("tab", { name: "Profile" })).toBeEnabled();
			expect(screen.getByRole("button", { name: "Close" })).toBeEnabled();
		}, 20000);
	},
);

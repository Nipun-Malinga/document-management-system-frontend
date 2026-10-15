import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AxiosError } from "axios";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import SignIn from "@/pages/SignIn";

const originalScrollIntoView = HTMLElement.prototype.scrollIntoView;

const auth = vi.hoisted(() => ({
	signIn: vi.fn(),
	register: vi.fn(),
	pending: false,
}));

vi.mock("@/hooks/user", () => ({
	useUser: () => null,
	useSignIn: () => ({ mutate: auth.signIn, isPending: auth.pending }),
	useRegistration: () => ({
		mutateAsync: auth.register,
		isPending: auth.pending,
	}),
}));

const renderAuth = (path = "/auth/signin") =>
	render(
		<MemoryRouter initialEntries={[path]}>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/auth/signin" element={<SignIn />} />
				<Route path="/auth/registration" element={<Register />} />
				<Route path="/dashboard/home" element={<h1>Your documents</h1>} />
			</Routes>
		</MemoryRouter>,
	);

const fillRegistration = async (user: ReturnType<typeof userEvent.setup>) => {
	await user.type(screen.getByLabelText("First name"), "Alex");
	await user.type(screen.getByLabelText("Last name"), "Morgan");
	await user.type(screen.getByLabelText("Username"), "alexmorgan");
	await user.type(screen.getByLabelText("Email address"), "alex@example.com");
	await user.type(
		screen.getByLabelText("Password", { exact: true }),
		"password123",
	);
	await user.type(screen.getByLabelText("Confirm password"), "password123");
};

beforeEach(() => {
	vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false }));
	HTMLElement.prototype.scrollIntoView = vi.fn();
	// Radix Checkbox measures its native input; jsdom has no layout observer.
	vi.stubGlobal(
		"ResizeObserver",
		class {
			observe = vi.fn();
			unobserve = vi.fn();
			disconnect = vi.fn();
		},
	);
	auth.pending = false;
	auth.signIn.mockReset();
	auth.register.mockReset().mockResolvedValue(undefined);
});

afterEach(() => {
	document.documentElement.classList.remove("dark");
	HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
	vi.unstubAllGlobals();
});

describe("public authentication pages", () => {
	it("reveals and hides a password without submitting or changing its value", async () => {
		const user = userEvent.setup();
		renderAuth();
		const password = screen.getByLabelText("Password");
		await user.type(password, "password123");
		expect(password).toHaveAttribute("autocomplete", "current-password");
		await user.click(screen.getByRole("button", { name: "Show password" }));
		expect(password).toHaveAttribute("type", "text");
		expect(password).toHaveValue("password123");
		await user.click(screen.getByRole("button", { name: "Hide password" }));
		expect(password).toHaveAttribute("type", "password");
		expect(auth.signIn).not.toHaveBeenCalled();
	});

	it("submits sign-in credentials and preserves the dashboard redirect", async () => {
		const user = userEvent.setup();
		auth.signIn.mockImplementation((_data, callbacks) => callbacks.onSuccess());
		renderAuth();
		expect(screen.getByRole("button", { name: "Sign in" })).toBeDisabled();
		await user.type(screen.getByLabelText("Email address"), "alex@example.com");
		await user.type(screen.getByLabelText("Password"), "password123");
		await user.click(screen.getByRole("button", { name: "Sign in" }));
		expect(auth.signIn).toHaveBeenCalledWith(
			{ email: "alex@example.com", password: "password123" },
			expect.any(Object),
		);
		expect(
			await screen.findByRole("heading", { name: "Your documents" }),
		).toBeVisible();
	});

	it("announces server errors and associates them with the affected input", async () => {
		const user = userEvent.setup();
		const error = new AxiosError("Rejected", undefined, undefined, undefined, {
			status: 400,
			data: {
				detail: "Check your details.",
				errors: { email: "This email cannot be used." },
			},
		} as never);
		auth.signIn.mockImplementation((_data, callbacks) =>
			callbacks.onError(error),
		);
		renderAuth();
		await user.type(screen.getByLabelText("Email address"), "alex@example.com");
		await user.type(screen.getByLabelText("Password"), "password123");
		await user.click(screen.getByRole("button", { name: "Sign in" }));
		expect(await screen.findByText("This email cannot be used.")).toBeVisible();
		expect(screen.getByLabelText("Email address")).toHaveAttribute(
			"aria-invalid",
			"true",
		);
		expect(screen.getByLabelText("Email address")).toHaveAccessibleDescription(
			"This email cannot be used.",
		);
	});

	it("requires terms consent and submits only the existing registration payload", async () => {
		const user = userEvent.setup();
		renderAuth("/auth/registration");
		await fillRegistration(user);
		const submit = screen.getByRole("button", { name: "Create account" });
		expect(submit).toBeDisabled();
		expect(screen.getByRole("checkbox")).not.toBeChecked();
		await user.click(
			screen.getByRole("checkbox", { name: /I agree to the Terms/ }),
		);
		await waitFor(() => expect(submit).toBeEnabled());
		await user.click(submit);
		expect(auth.register).toHaveBeenCalledWith({
			firstname: "Alex",
			lastname: "Morgan",
			username: "alexmorgan",
			email: "alex@example.com",
			password: "password123",
		});
		expect(
			await screen.findByRole("heading", { name: "Welcome back." }),
		).toBeVisible();
	});

	it("keeps password confirmation validation and visibility controls independent", async () => {
		const user = userEvent.setup();
		renderAuth("/auth/registration");
		await fillRegistration(user);
		await user.click(
			screen.getByRole("checkbox", { name: /I agree to the Terms/ }),
		);
		await user.clear(screen.getByLabelText("Confirm password"));
		await user.type(screen.getByLabelText("Confirm password"), "different123");
		expect(await screen.findByText("Password must match")).toBeVisible();
		await user.click(
			screen.getByRole("button", { name: "Show confirm password" }),
		);
		expect(screen.getByLabelText("Confirm password")).toHaveAttribute(
			"type",
			"text",
		);
		expect(screen.getByLabelText("Password", { exact: true })).toHaveAttribute(
			"type",
			"password",
		);
		expect(
			screen.getByRole("button", { name: "Create account" }),
		).toBeDisabled();
		expect(auth.register).not.toHaveBeenCalled();
	});

	it.each([
		["/auth/signin", "Signing in..."],
		["/auth/registration", "Creating account..."],
	])("disables the %s form while its request is pending", (path, label) => {
		auth.pending = true;
		renderAuth(path);
		expect(screen.getByRole("button", { name: label })).toBeDisabled();
		expect(screen.getByLabelText("Email address")).toBeDisabled();
		expect(
			screen.getByRole("button", { name: "Show password" }),
		).toBeDisabled();
	});

	it("connects the auth pages and returns visitors home", async () => {
		const user = userEvent.setup();
		renderAuth();
		await user.click(screen.getByRole("link", { name: "Create an account" }));
		expect(
			screen.getByRole("heading", { name: "Make room for your ideas." }),
		).toBeVisible();
		await user.click(
			within(
				screen.getByRole("region", { name: "Make room for your ideas." }),
			).getByRole("link", { name: "Sign in" }),
		);
		expect(
			screen.getByRole("heading", { name: "Welcome back." }),
		).toBeVisible();
		await user.click(screen.getByRole("link", { name: "FlowDocs home" }));
		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
			"Documents in order.",
		);
	});

	it.each(["/auth/signin", "/auth/registration"])(
		"supports theme switching in the shared navbar on %s",
		async (path) => {
			const user = userEvent.setup();
			renderAuth(path);
			const header = within(screen.getByRole("banner"));
			expect(
				header.queryByRole("link", { name: "Features" }),
			).not.toBeInTheDocument();
			expect(
				header.queryByRole("link", { name: "How it works" }),
			).not.toBeInTheDocument();
			await user.click(
				header.getByRole("button", { name: "Switch to dark theme" }),
			);
			expect(document.documentElement).toHaveClass("dark");
			await user.click(header.getByRole("link", { name: "FlowDocs home" }));
			expect(
				screen.getByRole("button", { name: "Switch to light theme" }),
			).toBeVisible();
			expect(localStorage.getItem("theme")).toBe("dark");
		},
	);

	it("returns home before navigating to a home section", async () => {
		const user = userEvent.setup();
		renderAuth();
		await user.click(screen.getByRole("link", { name: "FlowDocs home" }));
		await user.click(screen.getByRole("link", { name: "Features" }));
		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
			"Documents in order.",
		);
		expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalledOnce();
		expect(
			vi.mocked(HTMLElement.prototype.scrollIntoView).mock.contexts[0],
		).toBe(document.getElementById("features"));
		await user.click(screen.getByRole("link", { name: "Features" }));
		expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalledTimes(2);
	});
});

import { act, render, screen, waitFor } from "@testing-library/react";
import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useEffect } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import SecureRoute from "@/components/layout/SecureRoute";
import {
	initializeSession,
	replaceAccessToken,
} from "@/features/auth/stores/sessionStore";
import { axiosInstance, refreshSession } from "@/services/apiService";
import { claims, tokenFor } from "../../fixtures";

const originalAdapter = axiosInstance.defaults.adapter;
afterEach(() => {
	axiosInstance.defaults.adapter = originalAdapter;
});
const response = (config: InternalAxiosRequestConfig) => ({
	data: { token: tokenFor({ ...claims, exp: claims.exp + 3600 }) },
	status: 200,
	statusText: "OK",
	headers: {},
	config,
});
const renderProtected = (Child: () => React.ReactNode) =>
	render(
		<MemoryRouter initialEntries={["/protected"]}>
			<Routes>
				<Route
					path="/protected"
					element={
						<SecureRoute>
							<Child />
						</SecureRoute>
					}
				/>
				<Route path="/auth/signin" element={<p>Sign in again</p>} />
			</Routes>
		</MemoryRouter>,
	);

it("waits for expired stored-token recovery before mounting protected content", async () => {
	localStorage.setItem("jwt-access-token", tokenFor({ ...claims, exp: 1 }));
	initializeSession();
	let complete!: () => void;
	const pending = new Promise<void>((resolve) => {
		complete = resolve;
	});
	axiosInstance.defaults.adapter = async (config) => {
		await pending;
		return response(config);
	};
	const child = vi.fn(() => <p>Protected content</p>);
	renderProtected(child);
	expect(screen.getByRole("status")).toHaveTextContent(
		"Restoring your session",
	);
	expect(child).not.toHaveBeenCalled();
	act(() => complete());
	await waitFor(() =>
		expect(screen.getByText("Protected content")).toBeVisible(),
	);
});

it("hides an existing editor during refresh and restores the same mounted instance", async () => {
	replaceAccessToken(tokenFor());
	let complete!: () => void;
	const pending = new Promise<void>((resolve) => {
		complete = resolve;
	});
	axiosInstance.defaults.adapter = async (config) => {
		await pending;
		return response(config);
	};
	const mounted = vi.fn();
	const destroyed = vi.fn();
	const Child = () => {
		useEffect(() => {
			mounted();
			return destroyed;
		}, []);
		return (
			<input aria-label="Local editor state" defaultValue="Unsaved text" />
		);
	};
	renderProtected(Child);
	const editor = screen.getByRole("textbox");
	let recovery!: Promise<string>;
	act(() => {
		recovery = refreshSession();
	});
	expect(editor).not.toBeVisible();
	expect(editor.parentElement).toHaveAttribute("inert");
	expect(destroyed).not.toHaveBeenCalled();
	act(() => complete());
	await act(async () => {
		await recovery;
	});
	expect(screen.getByRole("textbox")).toBe(editor);
	expect(editor).toBeVisible();
	expect(editor).toHaveValue("Unsaved text");
	expect(mounted).toHaveBeenCalledOnce();
});

it("redirects consistently after failed recovery without mounting expired-session children", async () => {
	localStorage.setItem("jwt-access-token", tokenFor({ ...claims, exp: 1 }));
	initializeSession();
	axiosInstance.defaults.adapter = async (config) => {
		throw new AxiosError(
			"No refresh cookie",
			"ERR_BAD_REQUEST",
			config,
			undefined,
			{ ...response(config), status: 401 },
		);
	};
	const child = vi.fn(() => <p>Protected content</p>);
	renderProtected(child);
	await waitFor(() => expect(screen.getByText("Sign in again")).toBeVisible());
	expect(child).not.toHaveBeenCalled();
});

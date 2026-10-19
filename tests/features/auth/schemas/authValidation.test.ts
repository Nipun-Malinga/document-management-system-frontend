import { AxiosError } from "axios";
import { describe, expect, it, vi } from "vitest";
import { registerSchema } from "@/features/auth/schemas/Register";
import { signInSchema } from "@/features/auth/schemas/SignIn";
import { applyFormError } from "@/shared/utils/formErrors";

const valid = {
	firstname: "Tom",
	lastname: "Cruise",
	username: "user",
	email: "owner@example.com",
	password: "password",
	confirmPassword: "password",
	acceptTerms: true,
};
const problem = (status: number, data: unknown) =>
	new AxiosError("Rejected", undefined, undefined, undefined, {
		data,
		status,
		statusText: "",
		headers: {},
		config: { headers: {} },
	} as never);
describe("backend-aligned auth validation", () => {
	it.each(["firstname", "lastname"] as const)(
		"%s accepts 3–10 nonblank characters",
		(field) => {
			for (const value of ["", "ab", "           ", "abcdefghijk"])
				expect(
					registerSchema.safeParse({ ...valid, [field]: value }).success,
				).toBe(false);
			for (const value of ["abc", "abcdefghij"])
				expect(
					registerSchema.safeParse({ ...valid, [field]: value }).success,
				).toBe(true);
		},
	);
	it("accepts usernames 4–20 and rejects blank or out-of-range usernames", () => {
		for (const username of ["abc", " ", "a".repeat(21)])
			expect(registerSchema.safeParse({ ...valid, username }).success).toBe(
				false,
			);
		for (const username of ["abcd", "a".repeat(20)])
			expect(registerSchema.safeParse({ ...valid, username }).success).toBe(
				true,
			);
	});
	it("accepts 8–20 character passwords and matching confirmation", () => {
		for (const password of ["a".repeat(7), "a".repeat(21), " ".repeat(8)])
			expect(
				registerSchema.safeParse({
					...valid,
					password,
					confirmPassword: password,
				}).success,
			).toBe(false);
		for (const password of ["a".repeat(8), "a".repeat(20)])
			expect(
				registerSchema.safeParse({
					...valid,
					password,
					confirmPassword: password,
				}).success,
			).toBe(true);
		expect(
			registerSchema.safeParse({ ...valid, confirmPassword: "different" })
				.success,
		).toBe(false);
	});
	it("accepts valid emails longer than 30 characters in registration and both sign-in forms", () => {
		const email = "a-very-long-valid-address+tag@example.com";
		expect(registerSchema.safeParse({ ...valid, email }).success).toBe(true);
		expect(
			signInSchema.safeParse({ email, password: valid.password }).success,
		).toBe(true);
	});
	it("accepts valid punctuation in the same email across registration and sign-in", () => {
		const email = "tag+one#two%three/name@example.com";
		expect(registerSchema.safeParse({ ...valid, email }).success).toBe(true);
		expect(
			signInSchema.safeParse({ email, password: valid.password }).success,
		).toBe(true);
		expect(
			signInSchema.safeParse({ email, password: " ".repeat(8) }).success,
		).toBe(false);
	});
	it.each(["username", "email"] as const)(
		"maps a %s conflict to that field, retaining the backend detail",
		(field) => {
			const setError = vi.fn();
			const detail = `${field}: value is already registered in system.`;
			expect(
				applyFormError(problem(409, { detail }), setError, [
					"email",
					"username",
				]),
			).toBe(detail);
			expect(setError).toHaveBeenCalledWith(field, {
				type: "server",
				message: detail,
			});
		},
	);
	it("maps only known field errors and does not label an unspecified conflict as email", () => {
		const setError = vi.fn();
		applyFormError(
			problem(400, {
				detail: "Request validation failed.",
				errors: { firstname: "Too short", injected: "unknown", email: 123 },
			}),
			setError,
			["firstname", "email"],
		);
		expect(setError.mock.calls).toEqual([
			["firstname", { type: "server", message: "Too short" }],
		]);
		expect(
			applyFormError(problem(409, {}), setError, ["email", "username"]),
		).toContain("email and username");
	});
});

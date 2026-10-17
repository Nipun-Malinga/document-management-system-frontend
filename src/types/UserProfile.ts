import { z } from "zod";
import type { User } from "@/models/User";

export type UserProfile = User & { locked: boolean };

const name = (label: string) =>
	z
		.string()
		.trim()
		.min(3, `${label} must be 3–10 characters.`)
		.max(10, `${label} must be 3–10 characters.`);

export const profileSchema = z.object({
	firstname: name("First name"),
	lastname: name("Last name"),
	email: z
		.string()
		.trim()
		.max(255, "Email must be at most 255 characters.")
		.pipe(
			z.email({
				pattern: z.regexes.html5Email,
				error: "Enter a valid email address.",
			}),
		),
});
export type UpdateProfileRequest = z.infer<typeof profileSchema>;

export const passwordSchema = z
	.object({
		currentPassword: z
			.string()
			.refine(
				(value) => value.trim().length > 0,
				"Enter your current password.",
			),
		newPassword: z
			.string()
			.min(8, "Use 8–20 characters for your new password.")
			.max(20, "Use 8–20 characters for your new password.")
			.refine((value) => value.trim().length > 0, "Enter a new password."),
		confirmPassword: z.string().min(1, "Confirm your new password."),
	})
	.refine((value) => value.newPassword === value.confirmPassword, {
		message: "Passwords must match.",
		path: ["confirmPassword"],
	});
export type PasswordFormValues = z.infer<typeof passwordSchema>;
export type ChangePasswordRequest = Pick<
	PasswordFormValues,
	"currentPassword" | "newPassword"
>;

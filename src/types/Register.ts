import * as z from "zod";

export type RegisterRequest = {
	firstname: string;
	lastname: string;
	username: string;
	email: string;
	password: string;
};

export type RegisterResponse = undefined;

export const registerSchema = z
	.object({
		firstname: z
			.string()
			.min(3, "First name must have at least 3 characters")
			.max(10, "First name cannot have more than 10 characters")
			.refine((value) => value.trim().length > 0, "First name cannot be blank"),
		lastname: z
			.string()
			.min(3, "Last name must have at least 3 characters")
			.max(10, "Last name cannot have more than 10 characters")
			.refine((value) => value.trim().length > 0, "Last name cannot be blank"),
		username: z
			.string()
			.min(4, "Username must have at least 4 characters")
			.max(20, "Username cannot have more than 20 characters")
			.refine((value) => value.trim().length > 0, "Username cannot be blank"),
		email: z
			.email({ pattern: z.regexes.html5Email })
			.nonempty("Email cannot be empty"),
		password: z
			.string()
			.nonempty("Password cannot be empty")
			.min(8, "Password must have at least 8 characters")
			.max(20, "Password cannot have more than 20 characters")
			.refine((value) => value.trim().length > 0, "Password cannot be blank"),
		confirmPassword: z
			.string()
			.min(8, "Password must have at least 8 characters")
			.max(20, "Password cannot have more than 20 characters"),
		acceptTerms: z.literal(true, {
			error: "Must accept terms and conditions",
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: "Password must match",
		path: ["confirmPassword"],
	});

export type TRegisterSchema = z.infer<typeof registerSchema>;

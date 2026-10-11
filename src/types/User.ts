import * as z from "zod";

export const userSchema = z.object({
	email: z
		.string()
		.trim()
		.nonempty("Email cannot be empty")
		.pipe(z.email({ pattern: z.regexes.html5Email })),
});

export type TUserSchema = z.infer<typeof userSchema>;

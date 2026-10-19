import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import ErrorAlert from "@/components/common/Error";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import AuthLayout from "@/features/auth/components/AuthLayout";
import PasswordField from "@/features/auth/components/PasswordField";
import { useRegistration, useUser } from "@/features/auth/hooks";
import {
	registerSchema,
	type TRegisterSchema,
} from "@/features/auth/schemas/Register";
import { applyFormError } from "@/shared/utils/formErrors";

const Register = () => {
	const navigate = useNavigate();
	const [apiError, setApiError] = useState<string | null>(null);
	const { mutateAsync, isPending } = useRegistration();
	const user = useUser();
	const {
		handleSubmit,
		register,
		control,
		setError,
		clearErrors,
		formState: { errors, isValid },
	} = useForm<TRegisterSchema>({
		resolver: zodResolver(registerSchema),
		mode: "onChange",
	});

	const onSubmit: SubmitHandler<TRegisterSchema> = async (data) => {
		setApiError(null);
		clearErrors();
		try {
			const { firstname, lastname, username, email, password } = data;
			await mutateAsync({ firstname, lastname, username, email, password });
		} catch (error) {
			setApiError(
				applyFormError(error, setError, [
					"firstname",
					"lastname",
					"username",
					"email",
					"password",
				]),
			);
			return;
		}
		await navigate("/auth/signin", { replace: true });
	};

	if (user) return <Navigate to="/dashboard/home" replace />;

	return (
		<AuthLayout
			mode="register"
			title="Make room for your ideas."
			description="Create your FlowDocs account and bring your documents together."
		>
			{apiError && <ErrorAlert error={apiError} />}
			<form
				className="auth-form"
				onSubmit={handleSubmit(onSubmit)}
				aria-busy={isPending}
			>
				<FieldGroup className="gap-6">
					<FieldSet disabled={isPending}>
						<FieldLegend className="sr-only">Account details</FieldLegend>
						<FieldGroup className="gap-4">
							<FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<Field
									data-invalid={Boolean(errors.firstname)}
									className="min-w-0 gap-2"
								>
									<FieldLabel htmlFor="register-firstname">
										First name
									</FieldLabel>
									<Input
										id="register-firstname"
										placeholder="Alex"
										autoComplete="given-name"
										className="h-11"
										aria-invalid={Boolean(errors.firstname)}
										aria-describedby={
											errors.firstname ? "register-firstname-error" : undefined
										}
										{...register("firstname")}
									/>
									{errors.firstname && (
										<FieldError id="register-firstname-error">
											{errors.firstname.message}
										</FieldError>
									)}
								</Field>
								<Field
									data-invalid={Boolean(errors.lastname)}
									className="min-w-0 gap-2"
								>
									<FieldLabel htmlFor="register-lastname">Last name</FieldLabel>
									<Input
										id="register-lastname"
										placeholder="Morgan"
										autoComplete="family-name"
										className="h-11"
										aria-invalid={Boolean(errors.lastname)}
										aria-describedby={
											errors.lastname ? "register-lastname-error" : undefined
										}
										{...register("lastname")}
									/>
									{errors.lastname && (
										<FieldError id="register-lastname-error">
											{errors.lastname.message}
										</FieldError>
									)}
								</Field>
							</FieldGroup>
							<FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<Field
									data-invalid={Boolean(errors.username)}
									className="min-w-0 gap-2"
								>
									<FieldLabel htmlFor="register-username">Username</FieldLabel>
									<Input
										id="register-username"
										placeholder="alexmorgan"
										autoComplete="username"
										className="h-11"
										aria-invalid={Boolean(errors.username)}
										aria-describedby={
											errors.username ? "register-username-error" : undefined
										}
										{...register("username")}
									/>
									{errors.username && (
										<FieldError id="register-username-error">
											{errors.username.message}
										</FieldError>
									)}
								</Field>
								<Field
									data-invalid={Boolean(errors.email)}
									className="min-w-0 gap-2"
								>
									<FieldLabel htmlFor="register-email">
										Email address
									</FieldLabel>
									<Input
										id="register-email"
										type="email"
										placeholder="you@example.com"
										autoComplete="email"
										className="h-11"
										aria-invalid={Boolean(errors.email)}
										aria-describedby={
											errors.email ? "register-email-error" : undefined
										}
										{...register("email")}
									/>
									{errors.email && (
										<FieldError id="register-email-error">
											{errors.email.message}
										</FieldError>
									)}
								</Field>
							</FieldGroup>
							<FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<PasswordField
									id="register-password"
									label="Password"
									placeholder="Create a password"
									autoComplete="new-password"
									description="Use 8–20 characters."
									error={errors.password?.message}
									{...register("password")}
								/>
								<PasswordField
									id="register-confirmPassword"
									label="Confirm password"
									placeholder="Enter your password again"
									autoComplete="new-password"
									error={errors.confirmPassword?.message}
									{...register("confirmPassword")}
								/>
							</FieldGroup>
							<Field data-invalid={Boolean(errors.acceptTerms)}>
								<Field
									orientation="horizontal"
									className="items-start gap-3 rounded-lg bg-muted/60 p-3"
								>
									<Controller
										name="acceptTerms"
										control={control}
										render={({ field }) => (
											<Checkbox
												id="register-terms"
												className="mt-0.5 shrink-0"
												name={field.name}
												ref={field.ref}
												checked={field.value === true}
												onCheckedChange={(checked) =>
													field.onChange(checked === true)
												}
												onBlur={field.onBlur}
												aria-invalid={Boolean(errors.acceptTerms)}
												aria-describedby={
													errors.acceptTerms
														? "register-terms-error"
														: undefined
												}
											/>
										)}
									/>
									<FieldLabel
										htmlFor="register-terms"
										className="font-normal leading-relaxed"
									>
										I agree to the Terms of Service and Privacy Policy.
									</FieldLabel>
								</Field>
								{errors.acceptTerms && (
									<FieldError id="register-terms-error">
										{errors.acceptTerms.message}
									</FieldError>
								)}
							</Field>
						</FieldGroup>
					</FieldSet>
					<Button
						type="submit"
						size="lg"
						disabled={!isValid || isPending}
						className="h-11 w-full"
					>
						{isPending ? (
							<>
								<LoaderCircle
									aria-hidden="true"
									data-icon="inline-start"
									className="animate-spin"
								/>
								Creating account...
							</>
						) : (
							<>
								Create account
								<ArrowRight aria-hidden="true" data-icon="inline-end" />
							</>
						)}
					</Button>
				</FieldGroup>
			</form>
			<Separator />
			<p className="text-center text-sm leading-relaxed text-muted-foreground">
				Already have an account?{" "}
				<Link
					to="/auth/signin"
					className="font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
				>
					Sign in
				</Link>
			</p>
		</AuthLayout>
	);
};

export default Register;

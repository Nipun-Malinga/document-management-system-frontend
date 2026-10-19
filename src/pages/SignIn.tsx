import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import ErrorAlert from "@/components/common/Error";
import { Button } from "@/components/ui/button";
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
import { useSignIn, useUser } from "@/features/auth/hooks";
import {
	type SignInSchema,
	signInSchema,
} from "@/features/auth/schemas/SignIn";
import { useSessionStore } from "@/features/auth/stores/sessionStore";
import { applyFormError } from "@/shared/utils/formErrors";

const Signin = () => {
	const navigate = useNavigate();
	const [apiError, setApiError] = useState<string | null>(null);
	const { mutate, isPending } = useSignIn();
	const user = useUser();
	const status = useSessionStore((state) => state.status);
	const {
		register,
		setError,
		clearErrors,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<SignInSchema>({
		resolver: zodResolver(signInSchema),
		mode: "onChange",
	});

	const onSubmit: SubmitHandler<SignInSchema> = (data) => {
		setApiError(null);
		clearErrors();
		mutate(data, {
			onSuccess: async () => {
				await navigate("/dashboard/home");
			},
			onError: (error) => {
				setApiError(applyFormError(error, setError, ["email", "password"]));
			},
		});
	};

	if (user && status === "authenticated")
		return <Navigate to="/dashboard/home" replace />;

	return (
		<AuthLayout
			mode="signin"
			title="Welcome back."
			description="Sign in to access your documents and pick up where you left off."
		>
			{apiError && <ErrorAlert error={apiError} />}
			<form
				className="auth-form"
				onSubmit={handleSubmit(onSubmit)}
				aria-busy={isPending}
			>
				<FieldGroup className="gap-6">
					<FieldSet disabled={isPending}>
						<FieldLegend className="sr-only">Sign in details</FieldLegend>
						<FieldGroup className="gap-4">
							<Field data-invalid={Boolean(errors.email)} className="gap-2">
								<FieldLabel htmlFor="signin-email">Email address</FieldLabel>
								<Input
									id="signin-email"
									type="email"
									placeholder="you@example.com"
									autoComplete="email"
									className="h-11"
									aria-invalid={Boolean(errors.email)}
									aria-describedby={
										errors.email ? "signin-email-error" : undefined
									}
									{...register("email")}
								/>
								{errors.email && (
									<FieldError id="signin-email-error">
										{errors.email.message}
									</FieldError>
								)}
							</Field>
							<PasswordField
								id="signin-password"
								label="Password"
								autoComplete="current-password"
								placeholder="Enter your password"
								error={errors.password?.message}
								{...register("password")}
							/>
						</FieldGroup>
					</FieldSet>
					<Button
						type="submit"
						size="lg"
						disabled={isPending || !isValid}
						className="h-11 w-full"
					>
						{isPending ? (
							<>
								<LoaderCircle
									aria-hidden="true"
									data-icon="inline-start"
									className="animate-spin"
								/>
								Signing in...
							</>
						) : (
							<>
								Sign in
								<ArrowRight aria-hidden="true" data-icon="inline-end" />
							</>
						)}
					</Button>
				</FieldGroup>
			</form>
			<Separator />
			<p className="text-center text-sm leading-relaxed text-muted-foreground">
				New to FlowDocs?{" "}
				<Link
					to="/auth/registration"
					className="font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
				>
					Create an account
				</Link>
			</p>
		</AuthLayout>
	);
};

export default Signin;

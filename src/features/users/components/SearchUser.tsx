import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Search } from "lucide-react";
import { type ReactNode, useId, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFindUser, useUser } from "@/hooks/user";
import { type TUserSchema, userSchema } from "@/types/User";
import { collectionErrorMessage } from "@/utils/collectionUtils";
import UserAvatar from "./User";

interface Props {
	title: string;
	subTitle: string;
	onClick: (userId: number) => void;
	userPending: boolean;
	children?: ReactNode;
	onCancel?: () => void;
	actionLabel?: string;
}

const SearchUser = ({
	title,
	subTitle,
	onClick,
	userPending,
	children,
	onCancel,
	actionLabel = "Add",
}: Props) => {
	const emailId = useId();
	const [email, setEmail] = useState<string>("");
	const query = useFindUser(email);
	const { data: fetchedUser, isError, isFetching } = query;
	const user = useUser();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm<TUserSchema>({
		resolver: zodResolver(userSchema),
		mode: "onChange",
	});

	const onSubmit: SubmitHandler<TUserSchema> = (data) => {
		if (data.email === email) void query.refetch();
		else setEmail(data.email);
	};

	return (
		<div className="flex min-w-0 flex-col gap-4">
			<form onSubmit={handleSubmit(onSubmit)}>
				<FieldGroup className="gap-4">
					<FieldSet className="gap-4">
						<FieldLegend className="mb-0">{title}</FieldLegend>
						<FieldDescription>{subTitle}</FieldDescription>
						<FieldGroup className="gap-4">
							<Field data-invalid={!!errors.email}>
								<FieldLabel htmlFor={emailId}>User email</FieldLabel>
								<Input
									id={emailId}
									type="email"
									aria-invalid={!!errors.email}
									aria-describedby={
										errors.email ? `${emailId}-error` : undefined
									}
									disabled={userPending}
									className="h-10 bg-background shadow-none"
									placeholder="person@example.com"
									{...register("email", { onChange: () => setEmail("") })}
								/>
								{errors.email && (
									<FieldError id={`${emailId}-error`}>
										{errors.email.message}
									</FieldError>
								)}
							</Field>
							{children}
						</FieldGroup>
					</FieldSet>
					<Field orientation="horizontal">
						<Button
							type="submit"
							className="h-10"
							disabled={!isValid || isFetching || userPending}
						>
							{isFetching ? (
								<LoaderCircle
									aria-hidden="true"
									data-icon="inline-start"
									className="animate-spin motion-reduce:animate-none"
								/>
							) : (
								<Search aria-hidden="true" data-icon="inline-start" />
							)}
							{isFetching ? "Searching…" : "Find person"}
						</Button>
						<Button
							type="button"
							variant="outline"
							disabled={userPending}
							className="h-10"
							onClick={() => {
								reset();
								setEmail("");
								onCancel?.();
							}}
						>
							Cancel
						</Button>
					</Field>
				</FieldGroup>
			</form>

			{email && fetchedUser && !isError && !isFetching && (
				<div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
					<div className="flex min-w-0 flex-1 items-center gap-3">
						<UserAvatar username={fetchedUser.username || fetchedUser.email} />
						<div className="flex min-w-0 flex-col gap-1">
							<p className="wrap-anywhere text-sm font-medium">
								{fetchedUser.email}
							</p>
							<p className="text-xs text-muted-foreground">
								{user?.id === fetchedUser.id
									? "This is your account"
									: "Ready to add"}
							</p>
						</div>
					</div>
					<Button
						type="button"
						className="h-10"
						disabled={userPending || user?.id === fetchedUser.id}
						onClick={() => onClick(fetchedUser.id)}
					>
						{userPending && (
							<LoaderCircle
								aria-hidden="true"
								data-icon="inline-start"
								className="animate-spin motion-reduce:animate-none"
							/>
						)}
						{userPending ? "Adding…" : actionLabel}
					</Button>
				</div>
			)}

			{email && isFetching && (
				<p role="status" className="text-sm text-muted-foreground">
					Looking up user…
				</p>
			)}
			{email && isError && (
				<Alert variant="destructive">
					<AlertDescription>
						<p>{collectionErrorMessage(query.error, "this user")}</p>
						<Button
							type="button"
							onClick={() => {
								void query.refetch();
							}}
						>
							Retry lookup
						</Button>
					</AlertDescription>
				</Alert>
			)}
		</div>
	);
};

export default SearchUser;

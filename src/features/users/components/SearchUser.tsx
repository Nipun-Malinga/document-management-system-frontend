import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, UserPlus } from "lucide-react";
import { useId, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSeparator,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFindUser, useUser } from "@/hooks/user";
import { type TUserSchema, userSchema } from "@/types/User";
import { collectionErrorMessage } from "@/utils/collectionUtils";

interface Props {
	title: string;
	subTitle: string;
	onClick: (userId: number) => void;
	userPending: boolean;
}

const SearchUser = ({ title, subTitle, onClick, userPending }: Props) => {
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
		<div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
			<div className="flex items-center gap-3 mb-4">
				<div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
					<UserPlus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
				</div>
				<div>
					<h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
						{title}
					</h3>
					<p className="text-xs text-gray-500 dark:text-gray-400">{subTitle}</p>
				</div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<FieldGroup>
					<FieldSet>
						<FieldLegend>{title}</FieldLegend>
						<FieldDescription>{subTitle}</FieldDescription>
						<FieldGroup>
							<div className="grid md:grid-cols-2 gap-2">
								<Field>
									<FieldLabel htmlFor={emailId}>User email</FieldLabel>
									<Input
										id={emailId}
										type="email"
										placeholder="person@example.com"
										{...register("email", { onChange: () => setEmail("") })}
									/>
									{errors.email && (
										<FieldError>{errors.email.message}</FieldError>
									)}
								</Field>
							</div>
						</FieldGroup>
					</FieldSet>
					<FieldSeparator />
					<Field orientation="horizontal">
						<Button type="submit" disabled={!isValid || isFetching}>
							Submit
						</Button>
						<Button
							type="button"
							onClick={() => {
								reset();
								setEmail("");
							}}
						>
							Cancel
						</Button>
					</Field>
				</FieldGroup>
			</form>

			{/* Search Result */}
			{email && fetchedUser && !isError && !isFetching && (
				<div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
								<span className="text-sm font-bold text-blue-600 dark:text-blue-400">
									{fetchedUser.email.charAt(0).toUpperCase()}
								</span>
							</div>
							<div>
								<p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
									{fetchedUser.email}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									User found
								</p>
							</div>
						</div>
						<Button
							disabled={userPending || user?.id === fetchedUser.id}
							onClick={() => onClick(fetchedUser.id)}
							className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-all duration-150 shadow-sm hover:shadow-md active:scale-95"
						>
							{userPending ? (
								<LoaderCircle className="w-5 h-5 animate-spin" />
							) : (
								"Add"
							)}
						</Button>
					</div>
				</div>
			)}

			{email && isFetching && <p>Looking up user…</p>}
			{email && isError && (
				<div role="alert" className="mt-4 space-y-2 text-sm text-foreground">
					<p>{collectionErrorMessage(query.error, "this user")}</p>
					<Button
						type="button"
						onClick={() => {
							void query.refetch();
						}}
					>
						Retry lookup
					</Button>
				</div>
			)}
		</div>
	);
};

export default SearchUser;

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, GitBranch, LoaderCircle, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogBody,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import useCreateBranch from "@/features/documents/hooks/useCreateBranch";
import useDocumentAccess from "@/features/documents/hooks/useDocumentAccess";
import {
	createBranchSchema,
	type TCreateBranchSchema,
} from "@/features/documents/schemas/Branch";
import { applyFormError } from "@/shared/utils/formErrors";
import useSoloActionState from "../../../persistence/useSoloActionState";

const CreateBranchForm = () => {
	const { documentId, branchId } = useParams();
	const [error, setError] = useState("");
	const safety = useSoloActionState(documentId ?? "", branchId ?? "");
	const { canWrite } = useDocumentAccess(documentId ?? "", branchId ?? "");
	const { mutateAsync, isPending, isSuccess } = useCreateBranch(
		documentId ?? "",
		branchId ?? "",
	);

	const {
		register,
		handleSubmit,
		reset,
		setError: setFieldError,
		clearErrors,
		formState: { errors, isValid },
	} = useForm<TCreateBranchSchema>({
		resolver: zodResolver(createBranchSchema),
		mode: "onChange",
	});

	const onSubmit = async (data: TCreateBranchSchema) => {
		if (!canWrite || isPending || safety.disabled) return;
		setError("");
		clearErrors();
		try {
			await mutateAsync(data);
			reset();
		} catch (error) {
			setError(applyFormError(error, setFieldError, ["branchName"]));
		}
	};

	if (!canWrite) return null;

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button disabled={safety.disabled} className="h-10 w-full">
					<Plus aria-hidden="true" data-icon="inline-start" />
					Create Branch
				</Button>
			</DialogTrigger>
			{safety.reason && (
				<p className="text-sm text-muted-foreground">{safety.reason}</p>
			)}
			<DialogContent className="editor-history-create" layout="custom">
				<DialogHeader className="gap-3 pr-6 text-left">
					<span aria-hidden="true" className="editor-history-symbol">
						<GitBranch />
					</span>
					<DialogTitle>Create a new branch</DialogTitle>
					<DialogDescription>
						Start a separate direction from the branch you’re working on.
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex min-h-0 flex-col gap-6"
				>
					<DialogBody className="flex flex-col gap-5">
						{isSuccess && !isPending && !error && (
							<Alert role="status">
								<CheckCircle2 aria-hidden="true" />
								<AlertTitle>Branch created</AlertTitle>
								<AlertDescription>
									You can find it in branches.
								</AlertDescription>
							</Alert>
						)}
						<FieldGroup>
							<Field data-invalid={!!errors.branchName}>
								<FieldLabel htmlFor="snapshot-branchName">
									Branch name
								</FieldLabel>
								<Input
									id="snapshot-branchName"
									type="text"
									aria-invalid={!!errors.branchName}
									aria-describedby="snapshot-branchName-help"
									autoComplete="off"
									placeholder="Review edits"
									{...register("branchName")}
								/>
								<FieldDescription id="snapshot-branchName-help">
									Use a short name that describes this direction, such as
									“Review edits”.
								</FieldDescription>
								{errors.branchName && (
									<FieldError>{errors.branchName.message}</FieldError>
								)}
							</Field>
						</FieldGroup>
						{error && (
							<Alert variant="destructive">
								<AlertTitle>Could not create branch</AlertTitle>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
					</DialogBody>
					<DialogFooter className="border-t pt-4">
						<DialogClose asChild>
							<Button type="button" variant="outline" disabled={isPending}>
								Cancel
							</Button>
						</DialogClose>
						<Button
							type="submit"
							disabled={!isValid || isPending || safety.disabled}
						>
							{isPending && (
								<LoaderCircle
									aria-hidden="true"
									data-icon="inline-start"
									className="animate-spin motion-reduce:animate-none"
								/>
							)}
							{isPending ? "Creating…" : "Create branch"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
export default CreateBranchForm;

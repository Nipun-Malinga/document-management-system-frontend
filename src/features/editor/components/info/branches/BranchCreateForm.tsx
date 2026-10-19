import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
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
	const { mutateAsync, isPending } = useCreateBranch(
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
			<DialogContent>
				<DialogHeader className="gap-3 border-b pb-5 text-left">
					<DialogTitle>Create a new branch</DialogTitle>
					<DialogDescription>
						Enter a name for the new branch.
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex min-h-0 flex-1 flex-col gap-5"
				>
					<DialogBody className="flex flex-col gap-5">
						<FieldGroup>
							<Field data-invalid={!!errors.branchName}>
								<FieldLabel htmlFor="snapshot-branchName">
									Branch name
								</FieldLabel>
								<Input
									id="snapshot-branchName"
									type="text"
									aria-invalid={!!errors.branchName}
									{...register("branchName")}
								/>
								{errors.branchName && (
									<FieldError>{errors.branchName.message}</FieldError>
								)}
							</Field>
						</FieldGroup>
						{error && (
							<p role="alert" className="text-sm text-destructive">
								{error}
							</p>
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
							{isPending ? "Creating..." : "Create"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
export default CreateBranchForm;

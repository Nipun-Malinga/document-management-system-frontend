import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, History, LoaderCircle, Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useCreateVersion } from "@/features/documents/hooks";
import useDocumentAccess from "@/features/documents/hooks/useDocumentAccess";
import {
	createVersionSchema,
	type TCreateVersionSchema,
} from "@/features/documents/schemas/Version";
import { applyFormError } from "@/shared/utils/formErrors";
import useSoloActionState from "../../../persistence/useSoloActionState";

const VersionCreateForm = () => {
	const { documentId, branchId } = useParams();
	const [error, setError] = useState("");
	const safety = useSoloActionState(documentId ?? "", branchId ?? "");

	const { canWrite } = useDocumentAccess(documentId ?? "", branchId ?? "");

	const {
		register,
		handleSubmit,
		control,
		reset,
		setError: setFieldError,
		clearErrors,
		formState: { isValid, errors },
	} = useForm<TCreateVersionSchema>({
		resolver: zodResolver(createVersionSchema),
		mode: "onChange",
	});

	const { mutateAsync, isPending, isSuccess } = useCreateVersion(
		documentId ?? "",
		branchId ?? "",
	);

	const onSubmit = async (data: TCreateVersionSchema) => {
		if (!canWrite || isPending || safety.disabled) return;
		setError("");
		clearErrors();
		try {
			await mutateAsync(data);
			reset();
		} catch (error) {
			setError(applyFormError(error, setFieldError, ["title", "status"]));
		}
	};

	if (!canWrite) return null;

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button disabled={safety.disabled} className="h-10 w-full">
					<Plus aria-hidden="true" data-icon="inline-start" />
					Create Version
				</Button>
			</DialogTrigger>
			{safety.reason && (
				<p className="text-sm text-muted-foreground">{safety.reason}</p>
			)}
			<DialogContent className="editor-history-create" layout="custom">
				<DialogHeader className="gap-3 pr-6 text-left">
					<span aria-hidden="true" className="editor-history-symbol">
						<History />
					</span>
					<DialogTitle>Create a new version</DialogTitle>
					<DialogDescription>
						Save a named snapshot of your current branch and choose its
						visibility.
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
								<AlertTitle>Version created</AlertTitle>
								<AlertDescription>
									You can find it in versions.
								</AlertDescription>
							</Alert>
						)}
						<FieldGroup>
							<Field data-invalid={!!errors.title}>
								<FieldLabel htmlFor="snapshot-title">Version name</FieldLabel>
								<Input
									id="snapshot-title"
									type="text"
									aria-invalid={!!errors.title}
									aria-describedby="snapshot-title-help"
									autoComplete="off"
									placeholder="Ready for review"
									{...register("title")}
								/>
								<FieldDescription id="snapshot-title-help">
									Use a name you can recognize later, such as “Ready for
									review”.
								</FieldDescription>
								{errors.title && (
									<FieldError>{errors.title.message}</FieldError>
								)}
							</Field>
							<Field data-invalid={!!errors.status}>
								<FieldLabel htmlFor="snapshot-status">Visibility</FieldLabel>
								<Controller
									name="status"
									control={control}
									render={({ field }) => (
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger
												id="snapshot-status"
												aria-invalid={!!errors.status}
												className="w-full"
											>
												<SelectValue placeholder="Select visibility" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectLabel>Visibility</SelectLabel>
													<SelectItem value="PRIVATE">Private</SelectItem>
													<SelectItem value="PUBLIC">Public</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
									)}
								/>
								{errors.status && (
									<FieldError>{errors.status.message}</FieldError>
								)}
							</Field>
						</FieldGroup>
						{error && (
							<Alert variant="destructive">
								<AlertTitle>Could not create version</AlertTitle>
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
							{isPending ? "Creating…" : "Create version"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
export default VersionCreateForm;

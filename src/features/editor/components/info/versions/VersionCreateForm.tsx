import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useCreateVersion } from "@/hooks/document";
import useDocumentAccess from "@/hooks/document/useDocumentAccess";
import {
	createVersionSchema,
	type TCreateVersionSchema,
} from "@/types/Version";
import { applyFormError } from "@/utils/formErrors";
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

	const { mutateAsync, isPending } = useCreateVersion(
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
			<DialogContent>
				<DialogHeader className="gap-3 border-b pb-5 text-left">
					<DialogTitle>Create a new version</DialogTitle>
					<DialogDescription>
						Give your version a meaningful name and set its visibility.
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex min-h-0 flex-1 flex-col gap-5"
				>
					<DialogBody className="flex flex-col gap-5">
						<FieldGroup>
							<Field data-invalid={!!errors.title}>
								<FieldLabel htmlFor="snapshot-title">Version name</FieldLabel>
								<Input
									id="snapshot-title"
									type="text"
									aria-invalid={!!errors.title}
									{...register("title")}
								/>
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
export default VersionCreateForm;

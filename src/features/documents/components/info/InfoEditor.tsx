import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/features/auth/hooks";
import { useUpdateDocumentInfo } from "@/features/documents/hooks";
import {
	documentInfoEditorSchema,
	type TDocumentInfoEditorSchema,
} from "@/features/documents/schemas/Document";
import type { Document } from "@/features/documents/types/Document";
import { applyFormError } from "@/shared/utils/formErrors";

interface Props {
	document: Document;
}

const InfoEditor = ({ document }: Props) => {
	const [error, setApiError] = useState("");
	const {
		handleSubmit,
		register,
		control,
		setError,
		clearErrors,
		reset,
		formState: { isValid, errors },
	} = useForm<TDocumentInfoEditorSchema>({
		resolver: zodResolver(documentInfoEditorSchema),
		mode: "onChange",
		defaultValues: { title: document.title, status: document.status },
	});
	const { mutateAsync, isPending } = useUpdateDocumentInfo(document.id);
	const user = useUser();
	const isOwner = document.ownerId === user?.id;

	const onSubmit: SubmitHandler<TDocumentInfoEditorSchema> = async (data) => {
		if (!isOwner || isPending) return;
		setApiError("");
		clearErrors();
		try {
			await mutateAsync(data);
			reset(data);
		} catch (error) {
			setApiError(applyFormError(error, setError, ["title", "status"]));
		}
	};

	if (!isOwner) return null;

	return (
		<div className="min-w-0">
			<form onSubmit={handleSubmit(onSubmit)} className="document-info-editor">
				<FieldGroup className="gap-3">
					<FieldSet className="gap-3">
						<FieldLegend className="sr-only">Edit Information</FieldLegend>
						<FieldDescription className="sr-only">
							Change the document title and visibility.
						</FieldDescription>
						<FieldGroup className="gap-3">
							<Field data-invalid={!!errors.title}>
								<FieldLabel htmlFor={`document-title-${document.id}`}>
									Document Title
								</FieldLabel>
								<Input
									id={`document-title-${document.id}`}
									placeholder={document.title}
									aria-invalid={!!errors.title}
									disabled={isPending}
									{...register("title")}
								/>
								{errors.title && (
									<FieldError>{errors.title.message}</FieldError>
								)}
							</Field>
							<Field data-invalid={!!errors.status}>
								<FieldLabel htmlFor={`document-status-${document.id}`}>
									Visibility
								</FieldLabel>
								<Controller
									name="status"
									control={control}
									render={({ field }) => (
										<Select
											name={field.name}
											value={field.value}
											onValueChange={field.onChange}
											disabled={isPending}
										>
											<SelectTrigger
												id={`document-status-${document.id}`}
												ref={field.ref}
												onBlur={field.onBlur}
												aria-invalid={!!errors.status}
												aria-describedby={
													errors.status
														? `document-status-error-${document.id}`
														: undefined
												}
												className="w-full"
											>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectItem value="PRIVATE">Private</SelectItem>
													<SelectItem value="PUBLIC">Public</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
									)}
								/>
								{errors.status && (
									<FieldError id={`document-status-error-${document.id}`}>
										{errors.status.message}
									</FieldError>
								)}
							</Field>
						</FieldGroup>
					</FieldSet>
					{error && (
						<p role="alert" className="text-sm text-destructive">
							{error}
						</p>
					)}
					<FieldSeparator />
					<Field orientation="horizontal" className="gap-2">
						<Button type="submit" disabled={!isValid || isPending}>
							{isPending ? (
								<>
									<LoaderCircle
										aria-hidden="true"
										data-icon="inline-start"
										className="animate-spin motion-reduce:animate-none"
									/>
									Updating...
								</>
							) : (
								"Update"
							)}
						</Button>
						<Button
							type="button"
							disabled={isPending}
							variant="outline"
							onClick={() => {
								reset();
								setApiError("");
							}}
						>
							Cancel
						</Button>
					</Field>
				</FieldGroup>
			</form>
		</div>
	);
};

export default InfoEditor;

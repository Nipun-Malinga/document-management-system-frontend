import { LoaderCircle } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import type { UpdateProfileRequest } from "@/features/users/schemas/UserProfile";

type ProfileSectionActionsProps = {
	form: UseFormReturn<UpdateProfileRequest>;
	pending: boolean;
	saving: boolean;
	onReset: () => void;
};

const ProfileSectionActions = ({
	form,
	pending,
	saving,
	onReset,
}: ProfileSectionActionsProps) => (
	<div className="flex flex-wrap items-center justify-end gap-2">
		<Button
			type="button"
			variant="outline"
			disabled={pending || !form.formState.isDirty}
			onClick={onReset}
		>
			Reset changes
		</Button>
		<Button
			type="submit"
			form="profile-details-form"
			disabled={pending || !form.formState.isDirty || !form.formState.isValid}
		>
			{saving && (
				<LoaderCircle
					data-icon="inline-start"
					aria-hidden="true"
					className="animate-spin"
				/>
			)}
			{saving ? "Saving…" : "Save profile"}
		</Button>
	</div>
);

export default ProfileSectionActions;

import { Field, FieldLabel } from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Folder } from "@/features/documents/types/Folder";
import { folderPath } from "@/features/documents/utils/folderTree";

interface Props {
	folders: Folder[];
	value: string;
	onChange: (id: string) => void;
	excluded?: Set<string>;
	allowRoot?: boolean;
	disabled?: boolean;
}

export const ROOT_DESTINATION = "root";

const FolderDestination = ({
	folders,
	value,
	onChange,
	excluded,
	allowRoot = false,
	disabled,
}: Props) => (
	<Field>
		<FieldLabel htmlFor="folder-destination">Destination</FieldLabel>
		<Select value={value} onValueChange={onChange} disabled={disabled}>
			<SelectTrigger id="folder-destination" className="w-full min-w-0">
				<SelectValue placeholder="Choose a folder" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{allowRoot && (
						<SelectItem value={ROOT_DESTINATION}>Root / No folder</SelectItem>
					)}
					{folders
						.filter((folder) => !excluded?.has(folder.id))
						.map((folder) => ({
							id: folder.id,
							label: folderPath(folders, folder.id)
								.map((item) => item.name)
								.join(" / "),
						}))
						.sort((a, b) => a.label.localeCompare(b.label))
						.map((folder) => (
							<SelectItem key={folder.id} value={folder.id}>
								{folder.label}
							</SelectItem>
						))}
				</SelectGroup>
			</SelectContent>
		</Select>
	</Field>
);

export default FolderDestination;

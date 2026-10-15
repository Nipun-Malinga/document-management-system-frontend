import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "../ui/empty";

const Notification = () => (
	<DropdownMenu>
		<DropdownMenuTrigger asChild>
			<Button variant="ghost" size="icon" aria-label="Notifications">
				<Bell aria-hidden="true" />
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent align="end" className="w-72 max-w-[calc(100vw-2rem)]">
			<Empty className="p-5">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Bell aria-hidden="true" />
					</EmptyMedia>
					<EmptyTitle>Notifications</EmptyTitle>
					<EmptyDescription>
						Notifications are not available yet.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		</DropdownMenuContent>
	</DropdownMenu>
);
export default Notification;

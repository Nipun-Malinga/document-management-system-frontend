import { Info, Pencil, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/features/auth/hooks";
import type { Document } from "@/features/documents/types/Document";
import { CollaboratorTabs } from "../collaborators";
import InfoBase from "./InfoBase";
import InfoEditor from "./InfoEditor";

const InfoTabs = ({ document }: { document: Document }) => {
	const user = useUser();
	const isOwner = document.ownerId === user?.id;
	return (
		<Tabs
			key={isOwner ? "owner" : "viewer"}
			defaultValue="information"
			className="flex min-h-0 min-w-0 flex-1 flex-col gap-3"
		>
			<TabsList className="h-9 w-full shrink-0" aria-label="Document details">
				<TabsTrigger value="information" className="min-w-0 gap-1 px-2">
					<Info aria-hidden="true" className="hidden sm:block" />
					Information
				</TabsTrigger>
				{isOwner && (
					<TabsTrigger value="edit" className="min-w-0 gap-1 px-2">
						<Pencil aria-hidden="true" className="hidden sm:block" />
						Edit
					</TabsTrigger>
				)}
				<TabsTrigger value="collaborators" className="min-w-0 gap-1 px-2">
					<Users aria-hidden="true" className="hidden sm:block" />
					Collaborators
				</TabsTrigger>
			</TabsList>
			<TabsContent className="flex min-h-0 flex-1 flex-col" value="information">
				<InfoBase document={document} />
			</TabsContent>
			{isOwner && (
				<TabsContent className="flex min-h-0 flex-1 flex-col" value="edit">
					<InfoEditor document={document} />
				</TabsContent>
			)}
			<TabsContent
				className="flex min-h-0 flex-1 flex-col"
				value="collaborators"
			>
				<CollaboratorTabs document={document} />
			</TabsContent>
		</Tabs>
	);
};
export default InfoTabs;

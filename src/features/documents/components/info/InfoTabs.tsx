import { Info, Pencil, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/hooks/user";
import type { Document } from "@/models/Document";
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
			className="min-w-0 gap-5"
		>
			<TabsList
				className="h-auto min-h-11 w-full flex-wrap gap-1 p-1"
				aria-label="Document details"
			>
				<TabsTrigger value="information" className="min-h-9">
					<Info aria-hidden="true" />
					Information
				</TabsTrigger>
				{isOwner && (
					<TabsTrigger value="edit" className="min-h-9">
						<Pencil aria-hidden="true" />
						Edit
					</TabsTrigger>
				)}
				<TabsTrigger value="collaborators" className="min-h-9">
					<Users aria-hidden="true" />
					Collaborators
				</TabsTrigger>
			</TabsList>
			<TabsContent value="information">
				<InfoBase document={document} />
			</TabsContent>
			{isOwner && (
				<TabsContent value="edit">
					<InfoEditor document={document} />
				</TabsContent>
			)}
			<TabsContent value="collaborators">
				<CollaboratorTabs document={document} />
			</TabsContent>
		</Tabs>
	);
};
export default InfoTabs;

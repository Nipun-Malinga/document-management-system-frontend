import "./history.css";
import { GitBranch, History } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Branches } from "./branches";
import { Versions } from "./versions";

const InfoTabs = () => (
	<Tabs
		defaultValue="branches"
		className="editor-history min-h-0 min-w-0 flex-1 gap-0"
	>
		<div className="shrink-0 border-b bg-card px-4 pb-4 pt-4 pr-14 sm:pl-6">
			<TabsList aria-label="Advanced document settings" className="h-10 w-full">
				<TabsTrigger value="branches">
					<GitBranch aria-hidden="true" />
					Branches
				</TabsTrigger>
				<TabsTrigger value="versions">
					<History aria-hidden="true" />
					Versions
				</TabsTrigger>
			</TabsList>
		</div>
		<TabsContent value="branches" className="flex min-h-0 min-w-0 flex-col">
			<Branches />
		</TabsContent>
		<TabsContent value="versions" className="flex min-h-0 min-w-0 flex-col">
			<Versions />
		</TabsContent>
	</Tabs>
);
export default InfoTabs;

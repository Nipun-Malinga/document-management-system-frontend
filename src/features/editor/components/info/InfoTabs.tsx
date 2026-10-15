import { GitBranch, History } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Branches } from "./branches";
import { Versions } from "./versions";

const InfoTabs = () => (
	<Tabs defaultValue="branches" className="min-h-0 min-w-0 flex-1 gap-0">
		<div className="shrink-0 bg-card px-4 pb-4 pt-5 pr-14 sm:pl-6">
			<TabsList aria-label="Advanced document settings" className="w-full">
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

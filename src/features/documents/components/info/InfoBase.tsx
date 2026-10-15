import type { Document } from "@/models/Document";

interface Props {
	document: Document;
}
const InfoBase = ({ document }: Props) => (
	<dl className="grid gap-x-8 gap-y-5 py-2 text-sm sm:grid-cols-2">
		{[
			["Created", document.createdAt],
			["Updated", document.updatedAt],
			[
				"Visibility",
				document.status === "PRIVATE"
					? "Private"
					: document.status === "PUBLIC"
						? "Public"
						: "Unknown",
			],
			["Branches", String(document.branchCount)],
		].map(([label, value]) => (
			<div key={label} className="flex min-w-0 flex-col gap-1.5">
				<dt className="text-muted-foreground">{label}</dt>
				<dd className="wrap-break-word font-medium">{value}</dd>
			</div>
		))}
	</dl>
);
export default InfoBase;

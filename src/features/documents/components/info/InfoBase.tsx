import type { Document } from "@/models/Document";

interface Props {
	document: Document;
}
const InfoBase = ({ document }: Props) => (
	<dl className="grid grid-cols-1 content-start gap-x-6 rounded-xl border bg-card px-4 text-sm sm:grid-cols-2 sm:px-5">
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
			<div
				key={label}
				className="flex min-w-0 flex-col gap-1.5 border-b py-4 last:border-b-0 sm:py-5 sm:nth-last-2:border-b-0"
			>
				<dt className="text-muted-foreground">{label}</dt>
				<dd className="wrap-anywhere font-medium text-foreground">{value}</dd>
			</div>
		))}
	</dl>
);
export default InfoBase;

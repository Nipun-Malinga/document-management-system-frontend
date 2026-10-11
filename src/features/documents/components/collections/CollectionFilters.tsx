import { useId } from "react";
import { Button } from "@/components/ui/button";
import type { PageParams } from "@/models/PageResponse";

import type { FilterField } from "./collectionFilterOptions";

interface Props<P extends PageParams> {
	params: P;
	update: (patch: Partial<P>) => void;
	fields: readonly FilterField[];
	sorts: readonly (readonly [string, string])[];
	label: string;
}

const inputClass =
	"h-9 min-w-0 max-w-full rounded-md border border-input bg-background px-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring";

const CollectionFilters = <P extends PageParams>({
	params,
	update,
	fields,
	sorts,
	label,
}: Props<P>) => {
	const filterId = useId();
	const values = params as Record<string, unknown>;
	const filterKey = JSON.stringify(fields.map(({ name }) => values[name]));
	return (
		<div className="my-3 flex flex-wrap items-end gap-3">
			<form
				key={filterKey}
				aria-label={`${label} filters`}
				className="flex min-w-0 flex-wrap items-end gap-2"
				onSubmit={(event) => {
					event.preventDefault();
					const data = new FormData(event.currentTarget);
					const patch: Record<string, string | boolean | undefined> = {};
					for (const field of fields) {
						const value = String(data.get(field.name) ?? "").trim();
						patch[field.name] = value
							? field.name === "favorite"
								? value === "true"
								: value
							: undefined;
					}
					update(patch as Partial<P>);
				}}
			>
				{fields.map((field) => (
					<label
						key={field.name}
						htmlFor={`${filterId}-${field.name}`}
						className="flex min-w-0 flex-col gap-1 text-sm text-foreground"
					>
						{field.label}
						{field.options ? (
							<select
								id={`${filterId}-${field.name}`}
								name={field.name}
								defaultValue={String(values[field.name] ?? "")}
								className={inputClass}
							>
								<option value="">All</option>
								{field.options.map(([value, text]) => (
									<option key={value} value={value}>
										{text}
									</option>
								))}
							</select>
						) : (
							<input
								id={`${filterId}-${field.name}`}
								name={field.name}
								type={field.type ?? "text"}
								defaultValue={String(values[field.name] ?? "")}
								maxLength={field.maxLength ?? 255}
								placeholder="Title"
								className={`${inputClass} w-44`}
							/>
						)}
					</label>
				))}
				<Button type="submit" variant="outline">
					Apply filters
				</Button>
				<Button
					type="button"
					variant="ghost"
					onClick={(event) => {
						event.currentTarget.form?.reset();
						update(
							Object.fromEntries(
								fields.map(({ name }) => [name, undefined]),
							) as Partial<P>,
						);
					}}
				>
					Clear filters
				</Button>
			</form>
			<label className="flex flex-col gap-1 text-sm text-foreground">
				Sort
				<select
					aria-label={`${label} sort`}
					value={params.sort ?? "id,asc"}
					className={inputClass}
					onChange={(event) =>
						update({ sort: event.target.value } as Partial<P>)
					}
				>
					{sorts.map(([value, text]) => (
						<option key={value} value={value}>
							{text}
						</option>
					))}
				</select>
			</label>
			<label className="flex flex-col gap-1 text-sm text-foreground">
				Per page
				<select
					aria-label={`${label} page size`}
					value={params.size ?? 20}
					className={inputClass}
					onChange={(event) =>
						update({ size: Number(event.target.value) } as Partial<P>)
					}
				>
					{[10, 20, 50].map((size) => (
						<option key={size} value={size}>
							{size}
						</option>
					))}
				</select>
			</label>
		</div>
	);
};

export default CollectionFilters;

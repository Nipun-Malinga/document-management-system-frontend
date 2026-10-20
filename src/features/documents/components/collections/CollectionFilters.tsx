import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { PageParams } from "@/shared/types/PageResponse";
import type { FilterField } from "./collectionFilterOptions";

export interface CollectionFiltersProps<P extends PageParams> {
	params: P;
	update: (patch: Partial<P>) => void;
	fields: readonly FilterField[];
	sorts: readonly (readonly [string, string])[];
	label: string;
	className?: string;
	compact?: boolean;
	layout?: "default" | "panel";
}

const allValues = "__collection_all__";
const controlClass =
	"w-full min-w-0 bg-background shadow-none data-[size=default]:h-10";
const labelClass = "text-xs font-medium text-muted-foreground";

const CollectionFilters = <P extends PageParams>({
	params,
	update,
	fields,
	sorts,
	label,
	className,
	compact = false,
	layout = "default",
}: CollectionFiltersProps<P>) => {
	const panel = layout === "panel";
	const filterId = useId();
	const [resetCount, setResetCount] = useState(0);
	const values = params as Record<string, unknown>;
	const filterKey = JSON.stringify(fields.map(({ name }) => values[name]));

	const sortField = (
		<Field className="min-w-0 flex-[2_1_0%] gap-2">
			<FieldLabel htmlFor={`${filterId}-sort`} className={labelClass}>
				Sort
			</FieldLabel>
			<Select
				value={params.sort ?? "id,asc"}
				onValueChange={(sort) => update({ sort } as Partial<P>)}
			>
				<SelectTrigger
					id={`${filterId}-sort`}
					aria-label={`${label} sort`}
					className={controlClass}
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent align="start">
					<SelectGroup>
						{sorts.map(([value, text]) => (
							<SelectItem key={value} value={value}>
								{text}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</Field>
	);
	const paginationFields = (
		<FieldGroup
			className={cn(
				"min-w-0 gap-3",
				panel
					? "grid grid-cols-1 items-end @min-[22rem]/filters:grid-cols-2"
					: "flex-[1_1_16rem] flex-row items-end",
			)}
		>
			{sortField}
			<Field className="min-w-0 flex-1 gap-2">
				<FieldLabel htmlFor={`${filterId}-size`} className={labelClass}>
					Per page
				</FieldLabel>
				<Select
					value={String(params.size ?? 20)}
					onValueChange={(size) => update({ size: Number(size) } as Partial<P>)}
				>
					<SelectTrigger
						id={`${filterId}-size`}
						aria-label={`${label} page size`}
						className={controlClass}
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent align="start">
						<SelectGroup>
							{[10, 20, 50].map((size) => (
								<SelectItem key={size} value={String(size)}>
									{size}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</Field>
		</FieldGroup>
	);
	return (
		<div
			className={cn(
				"my-3 w-full min-w-0",
				panel
					? "@container/filters flex flex-col gap-3"
					: "flex flex-wrap items-end gap-4",
				className,
			)}
		>
			<form
				aria-label={`${label} filters`}
				className={cn(
					"min-w-0 gap-3",
					panel ? "grid w-full" : "flex flex-[3_1_32rem] flex-wrap items-end",
				)}
				onSubmit={(event) => {
					event.preventDefault();
					const data = new FormData(event.currentTarget);
					const patch: Record<string, string | boolean | undefined> = {};
					for (const field of fields) {
						const value = String(data.get(field.name) ?? "").trim();
						patch[field.name] =
							!value || (field.options && value === allValues)
								? undefined
								: field.name === "favorite"
									? value === "true"
									: value;
					}
					update(patch as Partial<P>);
				}}
			>
				<FieldGroup
					key={`${filterKey}:${resetCount}`}
					className={cn(
						"min-w-0 gap-3",
						panel
							? "grid grid-cols-1"
							: "flex-1 basis-80 flex-row flex-wrap items-end",
					)}
				>
					{fields.map((field) => (
						<Field key={field.name} className="min-w-0 flex-1 basis-36 gap-2">
							<FieldLabel
								htmlFor={`${filterId}-${field.name}`}
								className={labelClass}
							>
								{field.label}
							</FieldLabel>
							{field.options ? (
								<Select
									name={field.name}
									defaultValue={String(values[field.name] ?? "") || allValues}
								>
									<SelectTrigger
										id={`${filterId}-${field.name}`}
										className={controlClass}
									>
										<SelectValue />
									</SelectTrigger>
									<SelectContent align="start">
										<SelectGroup>
											<SelectItem value={allValues}>All</SelectItem>
											{field.options.map(([value, text]) => (
												<SelectItem key={value} value={value}>
													{text}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							) : (
								<Input
									id={`${filterId}-${field.name}`}
									name={field.name}
									type={field.type ?? "text"}
									defaultValue={String(values[field.name] ?? "")}
									maxLength={field.maxLength ?? 255}
									placeholder={field.label}
									className="h-10 bg-background shadow-none"
								/>
							)}
						</Field>
					))}
					{compact && sortField}
				</FieldGroup>
				{panel && !compact && paginationFields}
				<div
					className={cn(
						panel
							? "grid min-w-0 grid-cols-1 gap-2 @min-[22rem]/filters:grid-cols-2"
							: "ml-auto flex shrink-0 items-center gap-2",
					)}
				>
					<Button type="submit" className="h-10">
						<SlidersHorizontal aria-hidden="true" data-icon="inline-start" />
						Apply filters
					</Button>
					<Button
						type="button"
						variant="ghost"
						className="h-10"
						onClick={(event) => {
							event.currentTarget.form?.reset();
							// Remount the uncontrolled selects even when no filters were applied.
							setResetCount((count) => count + 1);
							update(
								Object.fromEntries(
									fields.map(({ name }) => [name, undefined]),
								) as Partial<P>,
							);
						}}
					>
						<RotateCcw aria-hidden="true" data-icon="inline-start" />
						Clear filters
					</Button>
				</div>
			</form>
			{!compact && !panel && paginationFields}
		</div>
	);
};

export default CollectionFilters;

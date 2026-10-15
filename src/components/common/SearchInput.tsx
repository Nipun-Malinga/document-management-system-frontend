import { Input } from "@/components/ui/input";

interface Props {
	output: (value: string) => void;
	value?: string;
}
const SearchInput = ({ output, value }: Props) => (
	<Input
		type="text"
		aria-label="Search documents by exact title"
		placeholder="Search by exact title"
		value={value}
		onChange={(event) => output(event.target.value)}
		className="max-w-xl"
	/>
);
export default SearchInput;

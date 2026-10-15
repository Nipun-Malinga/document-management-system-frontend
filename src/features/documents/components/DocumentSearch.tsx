import { useEffect, useRef, useState } from "react";
import SearchInput from "@/components/common/SearchInput";

const DocumentSearch = ({
	title = "",
	onSearch,
}: {
	title?: string;
	onSearch: (title: string | undefined) => void;
}) => {
	const [input, setInput] = useState(title);
	const current = useRef(onSearch);
	current.current = onSearch;
	useEffect(() => {
		setInput(title);
	}, [title]);
	useEffect(() => {
		if (input.trim() === title) return;
		const timer = setTimeout(
			() => current.current(input.trim() || undefined),
			300,
		);
		return () => clearTimeout(timer);
	}, [input, title]);
	return (
		<div className="flex flex-col gap-2">
			<SearchInput value={input} output={setInput} />
			<p className="text-sm text-muted-foreground">
				Matches the full document title.
			</p>
		</div>
	);
};
export default DocumentSearch;

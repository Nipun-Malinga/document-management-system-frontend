import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CollectionPagination from "@/features/documents/components/collections/CollectionPagination";
import { pageOf } from "../../pages";

const manyPages = pageOf([], 6, 2000, 20);

describe("collection pagination", () => {
	it("marks the current page and supports direct jumps using zero-based page indices", async () => {
		const onPage = vi.fn();
		render(
			<CollectionPagination
				data={manyPages}
				pending={false}
				onPage={onPage}
				label="documents"
			/>,
		);
		expect(screen.getByRole("button", { name: "Page 7" })).toHaveAttribute(
			"aria-current",
			"page",
		);
		expect(
			screen.getAllByRole("button", { name: /^Page / }).length,
		).toBeLessThanOrEqual(7);
		expect(screen.getByRole("button", { name: "Page 1" })).toBeEnabled();
		await userEvent.click(screen.getByRole("button", { name: "Page 7" }));
		expect(onPage).not.toHaveBeenCalled();
		await userEvent.click(screen.getByRole("button", { name: "Page 100" }));
		expect(onPage).toHaveBeenCalledExactlyOnceWith(99);
	});
	it.each([0, 99])(
		"keeps boundary controls disabled on page %i",
		async (page) => {
			const onPage = vi.fn();
			render(
				<CollectionPagination
					data={pageOf([], page, 2000, 20)}
					pending={false}
					onPage={onPage}
					label="documents"
				/>,
			);
			expect(
				screen.getByRole("button", { name: page === 0 ? "Previous" : "Next" }),
			).toBeDisabled();
			const available = screen.getByRole("button", {
				name: page === 0 ? "Next" : "Previous",
			});
			available.focus();
			await userEvent.keyboard("{Enter}");
			expect(onPage).toHaveBeenCalledExactlyOnceWith(page === 0 ? 1 : 98);
		},
	);
	it("disables every navigation control while a page is loading", async () => {
		const onPage = vi.fn();
		render(
			<CollectionPagination
				data={manyPages}
				pending
				onPage={onPage}
				label="documents"
			/>,
		);
		for (const button of screen.getAllByRole("button"))
			expect(button).toBeDisabled();
		await userEvent.click(screen.getByRole("button", { name: "Next" }));
		expect(onPage).not.toHaveBeenCalled();
		expect(
			screen.getByRole("navigation", { name: "documents pagination" }),
		).toHaveAttribute("aria-busy", "true");
	});
	it("handles unknown and empty results without creating an invalid page button", () => {
		const props = { pending: false, onPage: vi.fn(), label: "documents" };
		const view = render(<CollectionPagination {...props} />);
		expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
		view.rerender(<CollectionPagination {...props} data={pageOf([])} />);
		expect(screen.getByRole("status")).toHaveTextContent(
			"0 items · Page 0 of 0",
		);
		expect(
			screen.queryByRole("button", { name: /^Page / }),
		).not.toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
		expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
	});
	it("keeps Previous available when the current page becomes empty after deletion", async () => {
		const onPage = vi.fn();
		render(
			<CollectionPagination
				data={pageOf([], 1, 20, 20)}
				pending={false}
				onPage={onPage}
				label="documents"
			/>,
		);
		await userEvent.click(screen.getByRole("button", { name: "Previous" }));
		expect(onPage).toHaveBeenCalledExactlyOnceWith(0);
	});
});

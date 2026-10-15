import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import Trash from "@/features/documents/layouts/Trash";
import { axiosInstance } from "@/services/apiService";
import { replaceAccessToken } from "@/states/sessionStore";
import { document as fixture, tokenFor } from "../../fixtures";
import { pageOf } from "../../pages";

const original = axiosInstance.defaults.adapter;
let client: QueryClient;
let requests: InternalAxiosRequestConfig[];
let hasDocument: boolean;
let hasBranch: boolean;
let failMutation: boolean;
let failCounts: boolean;
const success = (config: InternalAxiosRequestConfig, data: unknown) => ({
	config,
	data,
	status: 200,
	statusText: "OK",
	headers: {},
});
const failure = (config: InternalAxiosRequestConfig) =>
	new AxiosError("Unavailable", undefined, config, undefined, {
		...success(config, { detail: "Service unavailable" }),
		status: 503,
	});
const mutations = () => requests.filter((config) => config.method !== "get");
const showTrash = () =>
	render(
		<QueryClientProvider client={client}>
			<MemoryRouter initialEntries={["/dashboard/trash"]}>
				<Trash />
			</MemoryRouter>
		</QueryClientProvider>,
	);

beforeEach(() => {
	replaceAccessToken(tokenFor());
	client = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	});
	requests = [];
	hasDocument = true;
	hasBranch = true;
	failMutation = false;
	failCounts = false;
	axiosInstance.defaults.adapter = async (config) => {
		requests.push(config);
		if (config.method !== "get") {
			if (failMutation) throw failure(config);
			if (config.url?.endsWith("/branches/draft")) hasBranch = false;
			else hasDocument = false;
			return success(config, {});
		}
		if (config.url?.endsWith("/count")) {
			if (failCounts) throw failure(config);
			return success(config, {
				count: (config.url.includes("branches") ? hasBranch : hasDocument)
					? 1
					: 0,
			});
		}
		if (config.url === "/documents/trash")
			return success(
				config,
				pageOf(
					hasDocument
						? [
								{
									id: 1,
									addedDate: "2026-10-10 12:34:56",
									document: { ...fixture, trashed: true },
								},
							]
						: [],
				),
			);
		if (config.url === "/documents/trash/branches")
			return success(
				config,
				pageOf(
					hasBranch
						? [
								{
									id: 2,
									added_date: "2026-10-09 10:00:00",
									branch: {
										id: "draft",
										documentId: "doc",
										branchName: "Draft",
										createdAt: "2026-10-08",
										updatedAt: "2026-10-09",
										trashed: true,
									},
								},
							]
						: [],
				),
			);
		throw new Error(`Unexpected request: ${config.url}`);
	};
});

afterEach(() => {
	client.clear();
	axiosInstance.defaults.adapter = original;
});

describe("trash collection actions", () => {
	it("waits for restore confirmation, supports cancellation and focus return, and refreshes the collection", async () => {
		const user = userEvent.setup();
		showTrash();
		const restore = await screen.findByRole("button", {
			name: "Restore document Document",
		});
		await user.click(restore);
		expect(mutations()).toHaveLength(0);
		await user.click(
			within(screen.getByRole("alertdialog")).getByRole("button", {
				name: "Cancel",
			}),
		);
		expect(restore).toHaveFocus();
		await user.click(restore);
		await user.click(
			within(screen.getByRole("alertdialog")).getByRole("button", {
				name: "Restore",
			}),
		);
		expect(
			await screen.findByRole("heading", { name: "No trashed documents" }),
		).toBeVisible();
		expect(mutations().map(({ method, url }) => [method, url])).toEqual([
			["post", "/documents/trash/restore/doc"],
		]);
		await waitFor(() =>
			expect(screen.getByRole("tab", { name: "Documents 0" })).toBeVisible(),
		);
	});

	it("switches trash collections with the keyboard and preserves branch-scoped delete retry", async () => {
		const user = userEvent.setup();
		failMutation = true;
		showTrash();
		await screen.findByRole("button", { name: "Restore document Document" });
		await user.click(screen.getByRole("tab", { name: "Documents 1" }));
		await user.keyboard("{ArrowRight}");
		const remove = await screen.findByRole("button", {
			name: "Permanently delete branch Draft",
		});
		expect(screen.getByRole("tab", { name: "Branches 1" })).toHaveAttribute(
			"aria-selected",
			"true",
		);
		expect(screen.getByText("2026-10-09 10:00:00")).toBeVisible();
		await user.click(remove);
		expect(mutations()).toHaveLength(0);
		const dialog = screen.getByRole("alertdialog");
		expect(dialog).toHaveTextContent(
			"Permanently delete “Draft”? This action cannot be undone.",
		);
		await user.click(
			within(dialog).getByRole("button", { name: "Delete Permanently" }),
		);
		expect(await within(dialog).findByRole("alert")).toHaveTextContent(
			"Service unavailable",
		);
		expect(mutations()).toHaveLength(1);
		failMutation = false;
		await user.click(
			within(dialog).getByRole("button", { name: "Delete Permanently" }),
		);
		expect(
			await screen.findByRole("heading", { name: "No trashed branches" }),
		).toBeVisible();
		expect(mutations().map(({ method, url }) => [method, url])).toEqual([
			["delete", "/documents/trash/delete/doc/branches/draft"],
			["delete", "/documents/trash/delete/doc/branches/draft"],
		]);
	});

	it("keeps unavailable counts distinct from zero while the list remains usable", async () => {
		failCounts = true;
		showTrash();
		expect(
			await screen.findByRole("tab", { name: "Documents count unavailable" }),
		).toBeVisible();
		expect(
			screen.queryByRole("tab", { name: "Documents 0" }),
		).not.toBeInTheDocument();
		expect(
			await screen.findByRole("button", { name: "Restore document Document" }),
		).toBeVisible();
		const tableRegion = screen.getByRole("region", {
			name: "Trashed documents table",
		});
		tableRegion.focus();
		expect(tableRegion).toHaveFocus();
	});
});

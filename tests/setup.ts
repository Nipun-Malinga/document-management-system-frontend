import { endSession } from "@/states/sessionStore";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";

beforeEach(() => {
	endSession();
});

afterEach(() => {
	cleanup();
	endSession();
	localStorage.clear();
});

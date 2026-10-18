import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
	},
	test: {
		environment: "jsdom",
		fileParallelism: !process.env.DMS_SELF_SERVICE_URL,
		setupFiles: ["./tests/setup.ts"],
		include: ["tests/**/*.test.{ts,tsx}"],
	},
});

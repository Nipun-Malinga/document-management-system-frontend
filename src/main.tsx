import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import { startSessionRuntime } from "@/services/sessionService";
import router from "./router/router";

const queryClient = new QueryClient();
const stopSessionRuntime = startSessionRuntime(queryClient);
if (import.meta.hot) import.meta.hot.dispose(stopSessionRuntime);

const root = document.getElementById("root");
if (!root) throw new Error("Application root element is missing.");

createRoot(root).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<ReactQueryDevtools />
		</QueryClientProvider>
	</StrictMode>,
);

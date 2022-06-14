import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./store/AppContext";
import { QueryClientProvider, QueryClient } from "react-query";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchInterval: Infinity,
			retry: false,
			notifyOnChangeProps: "tracked",
		},
	},
});

queryClient.setQueryDefaults(["articles"], { staleTime: 1000 * 60 });

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<AppProvider>
					<App />
					<div id="success-portal"></div>
				</AppProvider>
			</QueryClientProvider>
		</BrowserRouter>
	</React.StrictMode>
);

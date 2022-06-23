import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AppProvider } from "./store/AppContext";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

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
queryClient.setQueryDefaults(["comments"], { staleTime: 1000 * 10 });

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<AppProvider>
					<App />
				</AppProvider>
			</QueryClientProvider>
		</BrowserRouter>
	</React.StrictMode>
);

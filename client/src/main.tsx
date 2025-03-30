import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import { AppProvider } from "./store/AppContext";
import { serverUrl } from "./utils/data";

axios.defaults.baseURL = serverUrl;
axios.defaults.withCredentials = true;

const queryClient = new QueryClient();
queryClient.setQueryDefaults(["articles"], { staleTime: 5 * 60 * 1000 });
queryClient.setQueryDefaults(["comments"], { staleTime: 60 * 1000 });

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement,
);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <AppProvider>
                    <App />
                </AppProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>,
);

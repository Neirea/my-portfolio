import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AppProvider } from "./store/AppContext";
import { PostHogProvider } from "posthog-js/react";

const options = {
    api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
};

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
axios.defaults.withCredentials = true;

const queryClient = new QueryClient();
queryClient.setQueryDefaults(["articles"], { staleTime: 5 * 60 * 1000 });
queryClient.setQueryDefaults(["comments"], { staleTime: 60 * 1000 });

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <PostHogProvider
            apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
            options={options}
        >
            <BrowserRouter>
                <QueryClientProvider client={queryClient}>
                    <AppProvider>
                        <App />
                    </AppProvider>
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </BrowserRouter>
        </PostHogProvider>
    </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./store/AppContext";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<AppProvider>
				<App />
				<div id="success-portal"></div>
			</AppProvider>
		</BrowserRouter>
	</React.StrictMode>
);

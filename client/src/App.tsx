import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import RequirePublic from "./components/RequirePublic";
import LoadingSpinner from "./components/LoadingSpinner";
import Header from "./components/Header/Header";
import {
	Home,
	Contact,
	Login,
	Articles,
	SingleArticle,
	CreateArticle,
	EditArticle,
	Unauthorized,
	Error,
} from "./pages";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./styles/GlobalStyles";
import { lightTheme, darkTheme } from "./styles/theme";
import { useGlobalContext } from "./store/AppContext";
import { SingleArticleProvider } from "./store/SingleArticleContext";

import { userRoles } from "./store/AppContext";

function App() {
	const { isLoading, darkMode } = useGlobalContext();
	const selectedTheme = darkMode ? darkTheme : lightTheme;
	return isLoading ? (
		<LoadingSpinner />
	) : (
		<ThemeProvider theme={selectedTheme}>
			<GlobalStyles />
			<Header />
			<Routes>
				{/* public routes */}
				<Route path="/" element={<Home />} />
				<Route path="/contact" element={<Contact />} />
				<Route path="/blog" element={<Articles key="blog" type="blog" />} />
				<Route
					path="/project"
					element={<Articles key="project" type="project" />}
				/>
				<Route
					path="/read"
					element={
						<SingleArticleProvider>
							<SingleArticle />
						</SingleArticleProvider>
					}
				/>
				<Route path="/unauthorized" element={<Unauthorized />} />
				{/*public only routes */}
				<Route element={<RequirePublic />}>
					<Route path="/login" element={<Login />} />
				</Route>
				{/* admin routes */}
				<Route
					element={
						<RequireAuth key={"admin"} allowedRoles={[userRoles.admin]} />
					}
				>
					<Route
						path="/create-article"
						element={
							<Suspense fallback={<LoadingSpinner />}>
								<CreateArticle />
							</Suspense>
						}
					/>
					<Route
						path="/edit-article"
						element={
							<Suspense fallback={<LoadingSpinner />}>
								<EditArticle />
							</Suspense>
						}
					/>
				</Route>
				{/* Any other routes */}
				<Route path="*" element={<Error />} />
			</Routes>
		</ThemeProvider>
	);
}

export default App;

// async function githubAuth() {
// 	try {
// 		//can't do short urls
// 		window.open("http://localhost:5000/api/auth/login/github", "_self");
// 	} catch (error) {
// 		console.log(error);
// 	}
// }
// async function logout() {
// 	try {
// 		const { data } = await axios.delete("/api/auth/logout");
// 		console.log(data);
// 	} catch (error) {
// 		console.log(error);
// 	}
// }

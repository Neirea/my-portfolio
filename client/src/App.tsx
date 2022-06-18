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
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { recaptchaKey } from "./utils/data";
import { userRoles } from "./types/appTypes";
import { categoriesEnum } from "./types/articleTypes";

function App() {
	const { isLoading, darkMode } = useGlobalContext();
	const selectedTheme = darkMode ? darkTheme : lightTheme;

	if (isLoading) {
		return <LoadingSpinner />;
	}
	return (
		<ThemeProvider theme={selectedTheme}>
			<GlobalStyles />
			<Header />
			<Routes>
				{/* public routes */}
				<Route path="/" element={<Home />} />

				<Route
					path="/contact"
					element={
						<GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
							<Contact />
						</GoogleReCaptchaProvider>
					}
				/>
				<Route
					path="/blog"
					element={<Articles key="blog" type={categoriesEnum.blog} />}
				/>
				<Route
					path="/project"
					element={<Articles key="project" type={categoriesEnum.project} />}
				/>
				<Route
					path="/blog/:articleId"
					element={<SingleArticle type={categoriesEnum.blog} />}
				></Route>
				<Route
					path="/project/:articleId"
					element={<SingleArticle type={categoriesEnum.project} />}
				></Route>
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
						path="/edit-article/:articleId"
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

import { Suspense } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import Header from "./components/Header/Header";
import LoadingSpinner from "./components/LoadingSpinner";
import RequireAuth from "./components/RequireAuth";
import RequirePublic from "./components/RequirePublic";
import ScrollToTop from "./components/ScrollToTop";
import {
    Articles,
    Contact,
    CreateArticle,
    EditArticle,
    Error,
    Home,
    Login,
    SingleArticle,
    Unauthorized,
} from "./pages";
import AdminDashboard from "./pages/AdminDashboard";
import { useGlobalContext } from "./store/AppContext";
import { GlobalStyles } from "./styles/GlobalStyles";
import { darkTheme, lightTheme } from "./styles/theme";
import { userRoles } from "./types/appTypes";
import { categoriesEnum } from "./types/articleTypes";
import { recaptchaKey } from "./utils/data";

function App() {
    const { isLoading, darkMode } = useGlobalContext();
    const selectedTheme = darkMode ? darkTheme : lightTheme;

    if (isLoading) return null;

    return (
        <ThemeProvider theme={selectedTheme}>
            <ScrollToTop />
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
                    element={
                        <Articles key="project" type={categoriesEnum.project} />
                    }
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
                        <RequireAuth
                            key={"admin"}
                            allowedRoles={[userRoles.admin]}
                        />
                    }
                >
                    <Route
                        path="/admin-dashboard"
                        element={
                            <Suspense fallback={<LoadingSpinner />}>
                                <AdminDashboard />
                            </Suspense>
                        }
                    />
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

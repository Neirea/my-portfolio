import { Suspense } from "react";
import { Route, Routes } from "react-router";
import { ThemeProvider } from "styled-components";
import Header from "./components/Header/Header";
import RequireAuth from "./components/RequireAuth";
import RequirePermission from "./components/RequirePermission";
import RequirePublic from "./components/RequirePublic";
import ScrollToTop from "./components/ScrollToTop";
import { Error } from "./pages";
import { protectedRoutes, publicOnlyRoutes, publicRoutes } from "./routes";
import { useGlobalContext } from "./store/AppContext";
import { GlobalStyles } from "./styles/global.style";
import { darkTheme, lightTheme } from "./styles/theme";

const App = (): JSX.Element => {
    const { darkMode } = useGlobalContext();
    const selectedTheme = darkMode ? darkTheme : lightTheme;

    return (
        <ThemeProvider theme={selectedTheme}>
            <ScrollToTop />
            <GlobalStyles />
            <Header />
            <Routes>
                {publicRoutes.map(({ path, component }) => (
                    <Route key={path} path={path} element={component} />
                ))}
                <Route element={<RequirePublic />}>
                    {publicOnlyRoutes.map(({ path, component }) => (
                        <Route key={path} path={path} element={component} />
                    ))}
                </Route>
                <Route element={<RequireAuth key="auth" />}>
                    {protectedRoutes.map(
                        ({ path, resource, action, component }) => (
                            <Route
                                key={path}
                                element={
                                    <RequirePermission
                                        resource={resource}
                                        action={action}
                                    />
                                }
                            >
                                <Route
                                    path={path}
                                    element={
                                        <Suspense fallback={<div />}>
                                            {component}
                                        </Suspense>
                                    }
                                />
                            </Route>
                        ),
                    )}
                </Route>
                <Route path="*" element={<Error />} />
            </Routes>
        </ThemeProvider>
    );
};

export default App;

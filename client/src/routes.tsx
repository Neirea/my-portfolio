import {
    AdminDashboard,
    Article,
    Articles,
    Contact,
    CreateArticle,
    EditArticle,
    Home,
    Login,
    Unauthorized,
} from "./pages";
import type { ProtectedRoute } from "./types/abac.type";

export const publicRoutes = [
    { path: "/", component: <Home /> },
    { path: "/contact", component: <Contact /> },
    { path: "/blog", component: <Articles key="blog" type="blog" /> },
    {
        path: "/projects",
        component: <Articles key="projects" type="projects" />,
    },
    { path: "/blog/:slug", component: <Article type="blog" /> },
    { path: "/projects/:slug", component: <Article type="projects" /> },
    { path: "/unauthorized", component: <Unauthorized /> },
];

export const publicOnlyRoutes = [{ path: "/login", component: <Login /> }];

export const protectedRoutes: ProtectedRoute[] = [
    {
        path: "/admin-dashboard",
        resource: "users",
        action: "read",
        component: <AdminDashboard />,
    },
    {
        path: "/create-article",
        resource: "articles",
        action: "create",
        component: <CreateArticle />,
    },
    {
        path: "/edit-article/:articleId",
        resource: "articles",
        action: "update",
        component: <EditArticle />,
    },
];

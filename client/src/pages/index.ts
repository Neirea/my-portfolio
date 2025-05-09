import { lazy } from "react";
import Contact from "./Contact/Contact.page";
import Error from "./Error";
import Home from "./Home/Home.page";
import Login from "./Login/Login.page";
import Unauthorized from "./Unauthorized";
import Articles from "./Articles/Articles/Articles.page";
import Article from "./Articles/Article/Article.page";
const CreateArticle = lazy(
    () => import("./Articles/CreateArticle/CreateArticle.page"),
);
const EditArticle = lazy(
    () => import("./Articles/EditArticle/EditArticle.page"),
);
const AdminDashboard = lazy(() => import("./Admin/AdminDashboard.page"));

export {
    Home,
    Contact,
    Login,
    Articles,
    Article,
    Unauthorized,
    Error,
    CreateArticle,
    EditArticle,
    AdminDashboard,
};

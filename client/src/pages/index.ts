import { lazy } from "react";
import Home from "./Home";
import Contact from "./Contact";
import Error from "./Error";
/* auth */
import Login from "./Login";
import Unauthorized from "./Unauthorized";
/* articles */
import Articles from "./Articles/Articles";
import SingleArticle from "./Articles/SingleArticle";
const CreateArticle = lazy(() => import("./Articles/CreateArticle"));
const EditArticle = lazy(() => import("./Articles/EditArticle"));

export {
	Home,
	Contact,
	Login,
	Articles,
	SingleArticle,
	Unauthorized,
	Error,
	CreateArticle,
	EditArticle,
};

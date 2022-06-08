import {
	useContext,
	useState,
	useEffect,
	createContext,
	Dispatch,
	SetStateAction,
} from "react";
import { useQuery } from "../utils/useQuery";
import useLocalState from "../utils/useLocalState";
import axios from "axios";
import { handleHtmlString } from "../utils/handleHtmlString";

interface AppContextValues {
	alert: {
		show: boolean;
		text: string;
		type: string;
	};
	showAlert: ({
		text,
		type,
	}: {
		text: string;
		type?: string | undefined;
	}) => void;
	hideAlert: () => void;
	loading: boolean;
	setLoading: Dispatch<SetStateAction<boolean>>;
	articleId: string | null;
	article: any;
	comments: any;
	setComments: Dispatch<SetStateAction<any>>;
	commentState: any;
	setCommentState: Dispatch<SetStateAction<any>>;
	articlesData: any;
}

//export for testing purposes
export const SingleArticleContext = createContext({} as AppContextValues);

//list of actions for commentState
export enum ACTIONS {
	reply = "reply",
	edit = "edit",
	none = "none",
}

//fills array out of infinetely nested comment object(that has replies field) with depth values
export const parseComments = async (
	comments: any[],
	depth: number,
	array: any[]
) => {
	for (let i = 0; i < comments?.length; i++) {
		if (!i) depth++;
		const response = { level: depth, comment: comments[i] };
		array.push(response);
		parseComments(comments[i].replies, depth, array);
	}
};

const SingleArticleProvider = ({ children }: any) => {
	const query = useQuery();
	const articleId = query.get("a");

	const { alert, showAlert, hideAlert, loading, setLoading } = useLocalState();
	const [article, setArticle] = useState(null);
	const [articlesData, setArticlesData] = useState([]);
	const [comments, setComments] = useState<any>(null);
	//action types: reply,edit,none
	const [commentState, setCommentState] = useState({
		type: ACTIONS.none,
		id: null,
		message: "",
	});

	//get article and all its comments on load
	useEffect(() => {
		const getArticle = async () => {
			hideAlert();
			setLoading(true);
			try {
				const endpoints = [
					`/api/v1/article/${articleId}`,
					"/api/v1/article/getArticlesData",
				];
				const result = await Promise.all(
					endpoints.map((url) => axios.get(url))
				);

				const articleResult = {
					...result[0].data.article,
					content: handleHtmlString(
						result[0].data.article.content,
						result[0].data.article.code_languages
					),
				};
				//data for sidebar
				result[0].data.article.category === "project"
					? setArticlesData(result[1].data.articlesData.projects)
					: setArticlesData(result[1].data.articlesData.blogs);
				setArticle(articleResult);

				const { data } = await axios.get(`api/v1/comment/${articleId}`);
				const commentsArray: any[] = [];
				//make styled code in content
				parseComments(data.comments, -1, commentsArray);

				setComments(commentsArray);
			} catch (error) {
				const alertText = axios.isAxiosError(error)
					? (error?.response?.data as any).msg
					: "There was an error!";
				showAlert({ text: alertText });
			} finally {
				setLoading(false);
			}
		};
		getArticle();
	}, [articleId, hideAlert, showAlert, setLoading]);

	return (
		<SingleArticleContext.Provider
			value={{
				alert,
				showAlert,
				hideAlert,
				loading,
				setLoading,
				articleId,
				article,
				comments,
				setComments,
				commentState,
				setCommentState,
				articlesData,
			}}
		>
			{children}
		</SingleArticleContext.Provider>
	);
};

export const useArticleContext = () => {
	return useContext(SingleArticleContext);
};

export { SingleArticleProvider };

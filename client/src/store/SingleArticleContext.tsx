import { useContext, useState, useEffect, createContext } from "react";
import { useQuery } from "../utils/useQuery";
import useLocalState from "../utils/useLocalState";
import axios from "axios";
import { handleHtmlString } from "../utils/handleHtmlString";
import {
	IArticle,
	IArticleData,
	IComment,
	ArticleContextValues,
	IJsxComment,
	ICommentState,
	ACTIONS,
} from "../types/articleTypes";

//export for testing purposes
export const SingleArticleContext = createContext({} as ArticleContextValues);

//list of actions for commentState

//fills array out of infinetely nested comment object(that has replies field) with depth values
export const parseComments = async (
	comments: IComment[],
	depth: number,
	array: IJsxComment[]
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
	const [article, setArticle] = useState<IArticle>({} as IArticle);
	const [articlesData, setArticlesData] = useState<IArticleData[]>([]);
	const [comments, setComments] = useState<IJsxComment[]>([]);
	//action types: reply,edit,none
	const [commentState, setCommentState] = useState<ICommentState>({
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
					`/api/article/${articleId}`,
					"/api/article/getArticlesData",
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

				const { data } = await axios.get(`api/comment/${articleId}`);
				const commentsArray: IJsxComment[] = [];
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

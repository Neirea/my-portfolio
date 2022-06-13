import {
	useContext,
	useState,
	useEffect,
	createContext,
	ReactNode,
} from "react";
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
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";

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

const SingleArticleProvider = ({
	children,
	value,
}: {
	value: { type: string };
	children: ReactNode;
}) => {
	const { articleId } = useParams();
	const { alert, showAlert, hideAlert, loading, setLoading } = useLocalState();
	const [article, setArticle] = useState<IArticle | null>(null);
	const [articlesData, setArticlesData] = useState<IArticleData[]>([]);
	const [comments, setComments] = useState<IJsxComment[]>([]);
	//action types: reply,edit,none
	const [commentState, setCommentState] = useState<ICommentState>({
		type: ACTIONS.none,
		id: null,
		message: "",
	});

	const queryClient = useQueryClient();

	const getArticlesData = (articles: IArticle[]): IArticleData[] => {
		return articles.map((item) => {
			return { _id: item._id, category: item.category, title: item.title };
		});
	};
	const articleDataQuery = useQuery(
		[value.type],
		() =>
			axios
				.get<{ articles: IArticle[] }>("/api/article/project")
				.then((res) => res.data),
		{
			onSuccess(data) {
				const articleRaw = data.articles.find(
					(item) => item._id === articleId!
				)!;

				const articleResult = {
					...articleRaw,
					content: handleHtmlString(
						articleRaw.content,
						articleRaw.code_languages
					),
				};
				setArticle(articleResult);
				setArticlesData(getArticlesData(data.articles));
			},
			onError(error: any) {
				showAlert({
					text: error?.response?.data?.msg || "There was an error!",
				});
			},
		}
	);

	const commentsQuery = useQuery(
		["comments", articleId],
		() =>
			axios
				.get<{ comments: IComment[] }>(`/api/comment/${articleId}`)
				.then((res) => res.data),
		{
			initialData() {
				const commentsCache = queryClient.getQueryData<{
					comments: IComment[];
				}>(["comments", articleId]);
				return commentsCache;
			},
			onSuccess(data) {
				const commentsArray: IJsxComment[] = [];
				//make styled code in content
				parseComments(data.comments, -1, commentsArray);
				setComments(commentsArray);
			},
			onError(error: any) {
				showAlert({
					text: error?.response?.data?.msg || "There was an error!",
				});
			},
		}
	);

	useEffect(() => {
		if (!articleDataQuery.data) return;
	}, [articleDataQuery.data]);

	useEffect(() => {
		const articlesCache = queryClient.getQueryData<{ articles: IArticle[] }>([
			value.type,
		])?.articles;
		if (!articlesCache) return;
		const articleRaw = articlesCache.find((item) => item._id === articleId)!;

		const articleResult = {
			...articleRaw,
			content: handleHtmlString(articleRaw.content, articleRaw.code_languages),
		};
		setArticle(articleResult);
		setArticlesData(getArticlesData(articlesCache));

		// if (articlesCache?.articles) {
		// 	const articleTags = getArrayOfTags(articlesCache.articles);
		// 	setArticles(articlesCache.articles);
		// 	setTags(articleTags);
		// }
	}, [queryClient, value.type, articleId]);

	// const articleQuery = useQuery(
	// 	[value.type, articleId],
	// 	() =>
	// 		axios
	// 			.get<{ article: IArticle }>(`/api/article/${articleId}`)
	// 			.then((res) => res.data),
	// 	{
	// 		onSuccess: (data) => {
	// 			const articleResult = {
	// 				...data.article,
	// 				content: handleHtmlString(
	// 					data.article.content,
	// 					data.article.code_languages
	// 				),
	// 			};
	// 			setArticle(articleResult);
	// 		},
	// 		onError: (error: any) => {
	// 			showAlert({
	// 				text: error?.response?.data?.msg || "There was an error!",
	// 			});
	// 		},
	// 	}
	// );

	//get article and all its comments on load
	// useEffect(() => {
	// 	const getArticle = async () => {
	// 		hideAlert();
	// 		setLoading(true);
	// 		try {
	// 			const result = await Promise.all([
	// 				axios.get<{ article: IArticle }>(`/api/article/${articleId}`),
	// 				axios.get<{
	// 					articlesData: { projects: IArticleData[]; blogs: IArticleData[] };
	// 				}>("/api/article/getArticlesData"),
	// 			]);

	// 			const articleResult = {
	// 				...result[0].data.article,
	// 				content: handleHtmlString(
	// 					result[0].data.article.content,
	// 					result[0].data.article.code_languages
	// 				),
	// 			};
	// 			//data for sidebar
	// 			result[0].data.article.category === "project"
	// 				? setArticlesData(result[1].data.articlesData.projects)
	// 				: setArticlesData(result[1].data.articlesData.blogs);
	// 			setArticle(articleResult);

	// 			const { data } = await axios.get<{ comments: IComment[] }>(
	// 				`/api/comment/${articleId}`
	// 			);
	// 			const commentsArray: IJsxComment[] = [];
	// 			//make styled code in content
	// 			parseComments(data.comments, -1, commentsArray);

	// 			setComments(commentsArray);
	// 		} catch (error) {
	// 			showAlert({
	// 				text: error?.response?.data?.msg || "There was an error!",
	// 			});
	// 		} finally {
	// 			setLoading(false);
	// 		}
	// 	};
	// 	getArticle();
	// }, [articleId, hideAlert, showAlert, setLoading]);

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

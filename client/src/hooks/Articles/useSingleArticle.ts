import { useEffect, useState } from "react";
import useArticles from "./useArticles";
import { handleHtmlString } from "../../utils/handleHtmlString";
import { IArticle, IArticleData } from "../../types/articleTypes";

const useSingleArticle = (
	type: string,
	articleId: string | undefined
): [IArticle | null, IArticleData[], boolean, unknown] => {
	const { data: articles, isLoading, error } = useArticles(type);
	const [article, setArticle] = useState<IArticle | null>(null);
	const [articlesData, setArticlesData] = useState<IArticleData[]>([]);

	const getArticlesData = (articles: IArticle[]): IArticleData[] => {
		return articles.map((item) => {
			return { _id: item._id, category: item.category, title: item.title };
		});
	};

	useEffect(() => {
		if (!articles || !articleId) return;
		const articleRaw = articles.find((item) => item._id === articleId!)!;
		const articleResult = {
			...articleRaw,
			content: handleHtmlString(articleRaw.content, articleRaw.code_languages),
		};
		setArticle(articleResult);
		setArticlesData(getArticlesData(articles));
	}, [articles, articleId]);

	return [article, articlesData, isLoading, error];
};

export default useSingleArticle;

import { handleHtmlString } from "../../utils/handleHtmlString";
import { IArticle } from "../../types/articleTypes";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";

const useSingleArticle = (type: string, articleId: string | undefined) => {
	const queryClient = useQueryClient();

	return useQuery(
		["articles", type],
		() =>
			axios
				.get<{ articles: IArticle[] }>(`/api/article/${type}`)
				.then((res) => res.data.articles),
		{
			initialData: () => {
				const articlesCache = queryClient.getQueryData<IArticle[]>([
					"articles",
					type,
				]);
				if (articlesCache) return articlesCache;
			},
			select(articles) {
				const article = articles?.find((item) => item._id === articleId);
				if (article) {
					return {
						...article,
						content: handleHtmlString(article.content, article.code_languages),
					};
				}
			},
		}
	);
};

export default useSingleArticle;

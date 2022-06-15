import { handleHtmlString } from "../../utils/handleHtmlString";
import { IArticle } from "../../types/articleTypes";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";

const useSingleArticle = (type: string, articleId: string | undefined) => {
	const queryClient = useQueryClient();

	return useQuery(
		["articles", type, articleId],
		() =>
			axios
				.get<{ article: IArticle }>(`/api/article/${articleId}`)
				.then((res) => res.data.article)
				.then((article) => {
					return {
						...article,
						content: handleHtmlString(article.content, article.code_languages),
					};
				}),
		{
			initialData: () => {
				const articlesCache = queryClient.getQueryData<IArticle[]>([
					"articles",
					type,
				]);

				const articleRaw = articlesCache?.find(
					(item) => item._id === articleId!
				);
				if (articleRaw) {
					return {
						...articleRaw,
						content: handleHtmlString(
							articleRaw.content,
							articleRaw.code_languages
						),
					};
				}
			},
		}
	);
};

export default useSingleArticle;

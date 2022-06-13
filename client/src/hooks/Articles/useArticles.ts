import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { categoriesEnum, IArticle } from "../../types/articleTypes";

export default function useArticles(type: categoriesEnum | string) {
	const queryClient = useQueryClient();
	return useQuery([type], () => {
		const articlesCache = queryClient.getQueryData<IArticle[]>(type);
		if (articlesCache && articlesCache.length > 0) return articlesCache;
		return axios
			.get<{ articles: IArticle[] }>(`/api/article/${type}`)
			.then((res) => res.data.articles);
	});
}

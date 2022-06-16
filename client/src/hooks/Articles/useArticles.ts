import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { categoriesEnum, IArticle } from "../../types/articleTypes";

export default function useArticles(type: categoriesEnum | string) {
	const queryClient = useQueryClient();
	return useQuery(
		["articles", type],
		() =>
			axios
				.get<{ articles: IArticle[] }>(`/api/article/${type}`)
				.then((res) => res.data.articles),
		{
			initialData: () => {
				return queryClient.getQueryData<IArticle[]>(["articles", type]);
			},
		}
	);
}

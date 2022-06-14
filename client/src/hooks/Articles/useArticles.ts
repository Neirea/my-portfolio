import axios from "axios";
import { useQuery } from "react-query";
import { categoriesEnum, IArticle } from "../../types/articleTypes";

export default function useArticles(type: categoriesEnum | string) {
	return useQuery(["articles", type], () =>
		axios
			.get<{ articles: IArticle[] }>(`/api/article/${type}`)
			.then((res) => res.data.articles)
	);
}

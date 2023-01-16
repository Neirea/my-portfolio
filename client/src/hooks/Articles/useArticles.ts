import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { categoriesEnum, IArticle } from "../../types/articleTypes";

export const getArticles = (type: categoriesEnum) => {
    return axios
        .get<{ articles: IArticle[] }>(`/api/article/${type}`)
        .then((res) => res.data.articles);
};

export default function useArticles(type: categoriesEnum) {
    const queryClient = useQueryClient();
    return useQuery(["articles", type], () => getArticles(type), {
        initialData: () => {
            return queryClient.getQueryData<IArticle[]>(["articles", type]);
        },
    });
}

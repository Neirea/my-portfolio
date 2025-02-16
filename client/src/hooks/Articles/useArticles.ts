import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Article, Category } from "../../types/article.type";

export const getArticles = (type: Category) => {
    return axios
        .get<{ articles: Article[] }>(`/api/article/${type}`)
        .then((res) => res.data.articles);
};

export default function useArticles(type: Category) {
    const queryClient = useQueryClient();
    return useQuery(["articles", type], () => getArticles(type), {
        initialData: () => {
            return queryClient.getQueryData<Article[]>(["articles", type]);
        },
    });
}

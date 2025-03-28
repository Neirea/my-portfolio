import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Article, Category } from "../../types/article.type";

export const getArticles = (type: Category): Promise<Article[]> => {
    return axios
        .get<{ articles: Article[] }>(`/api/article/${type}`)
        .then((res) => res.data.articles);
};

const useArticles = (type: Category) => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ["articles", type],
        queryFn: () => getArticles(type),
        initialData: () => {
            return queryClient.getQueryData<Article[]>(["articles", type]);
        },
    });
};

export default useArticles;

import type { Article, ArticleData, Category } from "../../types/article.type";
import useArticles from "./useArticles";

const useSingleArticle = (type: Category, slug: string | undefined) => {
    const queryInfo = useArticles(type);

    const getArticlesData = (
        articles: Article[] | undefined,
    ): ArticleData[] | null => {
        if (!articles) return null;
        return articles?.map((item) => {
            return {
                _id: item._id,
                category: item.category,
                title: item.title,
                slug: item.slug,
            };
        });
    };

    const getArticle = (articles: Article[] | undefined): Article | null => {
        if (!articles) return null;
        const article = articles.find((item) => item.slug === slug);
        if (!article) return null;

        return article;
    };

    const data = getArticle(queryInfo.data);

    return {
        ...queryInfo,
        data: data,
        isError: queryInfo.isError,
        articlesData: getArticlesData(queryInfo.data),
    };
};

export default useSingleArticle;

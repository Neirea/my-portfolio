import type {
    categoriesEnum,
    IArticle,
    IArticleData,
} from "../../types/articleTypes";
import { handleHtmlString } from "../../utils/handleHtmlString";
import useArticles from "./useArticles";

const useSingleArticle = (
    type: categoriesEnum,
    articleId: string | undefined
) => {
    const queryInfo = useArticles(type);

    const getArticlesData = (
        articles: IArticle[] | undefined
    ): IArticleData[] | null => {
        if (!articles) return null;
        return articles?.map((item) => {
            return {
                _id: item._id,
                category: item.category,
                title: item.title,
            };
        });
    };

    const getArticle = (articles: IArticle[] | undefined): IArticle | null => {
        if (!articles) return null;
        const article = articles.find((item) => item._id === articleId);
        if (!article) return null;

        return {
            ...article,
            content: handleHtmlString(article.content, article.code_languages),
        };
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

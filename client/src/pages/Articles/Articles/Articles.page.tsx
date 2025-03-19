import { useEffect, useState, type JSX } from "react";
import { Link, NavLink, useLocation } from "react-router";
import LoadingSpinner from "../../../components/LoadingSpinner";
import useArticles from "../../../hooks/Articles/useArticles";
import { useGlobalContext } from "../../../store/AppContext";
import { AdminButton, AlertContainer } from "../../../styles/common.style";
import type { Article, Category } from "../../../types/article.type";
import { hasPermission } from "../../../utils/abac";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { useTitle } from "../../../utils/useTitle";
import {
    ArticleCardsWrapper,
    ArticlePageWrapper,
    ArticleSideMenuWrapper,
} from "../Articles.style";
import ArticleCards from "../components/ArticleCards";
import ArticleSideMenu from "./ArticleSideMenu";

const Articles = ({ type }: { type: Category }): JSX.Element => {
    const location = useLocation();
    const { user } = useGlobalContext();
    const [tags, setTags] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const {
        data: articles,
        isError: articlesIsError,
        error: articlesError,
    } = useArticles(type);

    const titleText = type.charAt(0).toUpperCase() + type.slice(1);
    useTitle(titleText);

    useEffect(() => {
        if (!articles) return;

        const articleTags: string[] = [];
        for (let i = 0; i < articles.length; i++) {
            articles[i].tags.forEach((elem) => {
                if (
                    articles[i].category === type &&
                    articleTags.indexOf(elem) === -1
                ) {
                    articleTags.push(elem);
                }
            });
        }
        setTags(articleTags);
    }, [type, articles]);

    const isArticleShow = (element: Article): boolean => {
        return (
            !selectedTags.length ||
            selectedTags.every((tag) => element.tags.indexOf(tag) > -1)
        );
    };
    const articleCards = articles?.filter((item) => isArticleShow(item));

    if (articlesIsError) {
        const errorMsg = getErrorMessage(articlesError, "There was some error");

        return (
            <>
                <AlertContainer>
                    <p>{errorMsg}</p>
                    <Link className="alert-link" to="/">
                        Go back to Home page
                    </Link>
                    {hasPermission(user, "articles", "create") && (
                        <>
                            <br />
                            <NavLink
                                to="/create-article"
                                state={{ from: type }}
                                replace
                            >
                                <AdminButton>Create Article</AdminButton>
                            </NavLink>
                        </>
                    )}
                </AlertContainer>
            </>
        );
    }

    if (!articles) {
        return <LoadingSpinner />;
    }

    return (
        <ArticlePageWrapper>
            {articleCards?.length ? (
                <ArticleCardsWrapper className="flex-item-1">
                    <ArticleCards type={type} articleCards={articleCards} />
                </ArticleCardsWrapper>
            ) : (
                <div className="article-alert-filter">
                    <AlertContainer>
                        <p>There are no articles with these filters</p>
                    </AlertContainer>
                </div>
            )}

            <ArticleSideMenuWrapper className="flex-item-2">
                {!!tags.length && (
                    <ArticleSideMenu
                        tags={tags}
                        selectedTags={selectedTags}
                        setSelectedTags={setSelectedTags}
                    />
                )}
            </ArticleSideMenuWrapper>
            {hasPermission(user, "articles", "create") && (
                <NavLink
                    className="create-article-button"
                    to="/create-article"
                    state={{ from: location }}
                    replace
                >
                    <AdminButton>Create Article</AdminButton>
                </NavLink>
            )}
        </ArticlePageWrapper>
    );
};

export default Articles;

import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import useArticles from "../../hooks/Articles/useArticles";
import { useGlobalContext } from "../../store/AppContext";
import { AdminButton, AlertContainer } from "../../styles/StyledComponents";
import { userRoles } from "../../types/appTypes";
import type { categoriesEnum, IArticle } from "../../types/articleTypes";
import ArticleCards from "./articleComponents/ArticleCards";
import ArticleSideMenu from "./articleComponents/ArticleSideMenu";
import {
    ArticleCardsWrapper,
    ArticlePageWrapper,
    ArticleSideMenuWrapper,
} from "./ArticleStyles";

const Articles = ({ type }: { type: categoriesEnum }) => {
    const { user } = useGlobalContext();
    const [tags, setTags] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const {
        data: articles,
        isError: articlesIsError,
        error: articlesError,
    } = useArticles(type);

    //set tags
    useEffect(() => {
        if (!articles) return;

        let articleTags: string[] = [];
        for (let i = 0; i < articles.length; i++) {
            articles[i].tags.forEach((elem) => {
                //check for correct type and if it already is in array
                articles[i].category === type &&
                    articleTags.indexOf(elem) === -1 &&
                    articleTags.push(elem);
            });
        }
        setTags(articleTags);
    }, [type, articles]);

    const isArticleShow = (element: IArticle) => {
        return (
            !selectedTags.length ||
            selectedTags.every((tag) => element.tags.indexOf(tag) > -1)
        );
    };
    const articleCards = articles?.filter((item) => isArticleShow(item));

    if (articlesIsError) {
        const errorObj: any = articlesError;
        const errorMsg =
            errorObj?.response?.data?.msg || "There was some error";

        return (
            <>
                <AlertContainer>
                    <p>{errorMsg}</p>
                    <Link className="alert-link" to="/">
                        Go back to Home page
                    </Link>
                    {user && user.roles.includes(userRoles.admin) && (
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
            {!!articleCards?.length ? (
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
            {user && user.roles.includes(userRoles.admin) && (
                <NavLink
                    className="create-article-button"
                    to="/create-article"
                    state={{ from: type }}
                    replace
                >
                    <AdminButton>Create Article</AdminButton>
                </NavLink>
            )}
        </ArticlePageWrapper>
    );
};

export default Articles;

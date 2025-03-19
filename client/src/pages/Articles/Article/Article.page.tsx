import { Link, useNavigate, useParams } from "react-router";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { CommentsProvider } from "../../../hooks/Articles/comments/useCommentsContext";
import useDeleteArticle from "../../../hooks/Articles/useDeleteArticle";
import useSingleArticle from "../../../hooks/Articles/useSingleArticle";
import { useGlobalContext } from "../../../store/AppContext";
import {
    AdminButton,
    AdminButtonLink,
    AlertContainer,
} from "../../../styles/common.style";
import type { Category } from "../../../types/article.type";
import { hasPermission } from "../../../utils/abac";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { useTitle } from "../../../utils/useTitle";
import {
    ArticleContentWrapper,
    ArticlePageWrapper,
    ArticleSideMenuWrapper,
} from "../Articles.style";
import ArticlePost from "./ArticlePost";
import Comments from "./Comments/Comments";

const Article = ({ type }: { type: Category }): JSX.Element => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useGlobalContext();
    const {
        data: article,
        isLoading: articleLoading,
        isError: articleIsError,
        error: articleError,
        articlesData,
    } = useSingleArticle(type, slug);

    const {
        mutate: deleteArticle,
        error: deleteError,
        isError: deleteIsError,
        isPending: deleteLoading,
    } = useDeleteArticle();

    const canUpdate = hasPermission(user, "articles", "update");
    const canDelete = hasPermission(user, "articles", "delete");

    const handleDelete = (articleId: string): void => {
        deleteArticle({ articleId, type });
        void navigate(`/${type}`);
    };

    useTitle(article?.title);

    if (articleIsError || deleteIsError) {
        const errorObj = articleError || deleteError;
        const errorMsg = getErrorMessage(errorObj, "There was some error");

        return (
            <AlertContainer>
                <p>{errorMsg}</p>
                <Link className="alert-link" to="/">
                    Go back to Home page
                </Link>
            </AlertContainer>
        );
    }

    if (!article) {
        return <LoadingSpinner />;
    }

    return (
        <ArticlePageWrapper id="articles-wrapper-id">
            <>
                <ArticleContentWrapper>
                    <ArticlePost article={article} />
                    {(canUpdate || canDelete) && (
                        <div className="admin-buttons">
                            {canUpdate && (
                                <AdminButtonLink
                                    to={`/edit-article/${article._id}`}
                                >
                                    Edit
                                </AdminButtonLink>
                            )}
                            {canDelete && (
                                <AdminButton
                                    disabled={deleteLoading || articleLoading}
                                    onClick={() => handleDelete(article._id)}
                                >
                                    Delete
                                </AdminButton>
                            )}
                        </div>
                    )}
                    <CommentsProvider value={{ articleId: article._id }}>
                        <Comments />
                    </CommentsProvider>
                </ArticleContentWrapper>
                {
                    <ArticleSideMenuWrapper className="sidebar-single">
                        <div className="article-aside-container">
                            <h4>{`Read also:`}</h4>
                            {!!articlesData?.length && (
                                <ul>
                                    {articlesData.map((item, index) => {
                                        return (
                                            article._id !== item._id && (
                                                <li key={`title-${index}`}>
                                                    <Link
                                                        className="article-aside-title"
                                                        to={`/${article?.category}/${item.slug}`}
                                                    >
                                                        {item.title}
                                                    </Link>
                                                </li>
                                            )
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </ArticleSideMenuWrapper>
                }
            </>
        </ArticlePageWrapper>
    );
};

export default Article;

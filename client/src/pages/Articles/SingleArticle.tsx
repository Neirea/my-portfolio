import { useNavigate, Link } from "react-router-dom";
import {
	ArticleContentWrapper,
	ArticlePageWrapper,
	ArticleSideMenuWrapper,
} from "./ArticleStyles";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
	AdminButton,
	AdminButtonLink,
	AlertContainer,
} from "../../styles/StyledComponents";
import { useParams } from "react-router-dom";

import { useGlobalContext } from "../../store/AppContext";
import ArticlePost from "./articleComponents/ArticlePost";
import Comments from "./articleComponents/Comments/Comments";
import { userRoles } from "../../types/appTypes";
import useSingleArticle from "../../hooks/Articles/useSingleArticle";
import { CommentsProvider } from "../../hooks/Articles/comments/useCommentsContext";
import useDeleteArticle from "../../hooks/Articles/useDeleteArticle";

const SingleArticle = ({ type }: { type: string }) => {
	const { articleId } = useParams();
	const navigate = useNavigate();
	const { user } = useGlobalContext();
	const {
		data: article,
		isLoading: articleLoading,
		isError: articleIsError,
		error: articleError,
		articlesData,
	} = useSingleArticle(type, articleId);

	const {
		mutate: deleteArticle,
		error: deleteError,
		isError: deleteIsError,
		isLoading: deleteLoading,
	} = useDeleteArticle();

	const handleDelete = async (articleId: string) => {
		deleteArticle({ articleId, type });
		navigate(`/${type}`);
	};

	if (articleIsError || deleteIsError) {
		const errorObj: any = articleError || deleteError;
		const errorMsg = errorObj?.response?.data?.msg || "There was some error";

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
					{user && user.roles.includes(userRoles.admin) && (
						<div className="admin-buttons">
							<AdminButtonLink to={`/edit-article/${article._id}`}>
								Edit
							</AdminButtonLink>

							<AdminButton
								disabled={deleteLoading || articleLoading}
								onClick={() => handleDelete(article._id)}
							>
								Delete
							</AdminButton>
						</div>
					)}
					<CommentsProvider value={{ articleId }}>
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
														to={`/${article?.category}/${item._id}`}
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

export default SingleArticle;

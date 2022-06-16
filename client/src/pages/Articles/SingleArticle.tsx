import { useNavigate, Link, NavLink } from "react-router-dom";
import {
	ArticleContentWrapper,
	ArticlePageWrapper,
	TagsGroup,
	ArticleSideMenuWrapper,
} from "./ArticleStyles";
import BigImg from "../../components/BigImg";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
	AdminButton,
	AdminButtonLink,
	AlertContainer,
	LinkButton,
} from "../../styles/StyledComponents";
import { useParams } from "react-router-dom";

import { useGlobalContext } from "../../store/AppContext";
import Comments from "./articleComponents/Comments/Comments";
import { handleDate } from "../../utils/handleDate";
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
					<section className="article-wrapper">
						<article className="article-post">
							<div className="article-header">
								<h3 className="article-title">{article.title}</h3>
								<p className="article-date">{handleDate(article.updatedAt)}</p>
								<TagsGroup>
									{article.tags.map((tag, i) => {
										return (
											<NavLink
												key={`sa-${i}`}
												to={`/${article.category}`}
												state={{ tag }}
											>
												{tag}
											</NavLink>
										);
									})}
								</TagsGroup>
								<BigImg
									className="article-image"
									src={article.image}
									alt={article.title}
								/>
							</div>
							<div
								className="article-text"
								dangerouslySetInnerHTML={{
									__html: article.content,
								}}
							/>
							<div className="article-links">
								{article.source_link && (
									<LinkButton as="a" href={article.source_link}>
										Source
									</LinkButton>
								)}
								{article.demo_link && (
									<LinkButton as="a" href={article.demo_link}>
										View Live
									</LinkButton>
								)}
							</div>
						</article>
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
					</section>
				</ArticleContentWrapper>
				{
					<ArticleSideMenuWrapper className="sidebar-single">
						<div className="article-aside-container">
							<h5>{`Read also:`}</h5>
							{articlesData?.length && (
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

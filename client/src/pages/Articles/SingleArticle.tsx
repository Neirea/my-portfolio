import { useEffect, useState } from "react";
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
	ReadButton,
} from "../../styles/StyledComponents";
import { useParams } from "react-router-dom";

import { useGlobalContext } from "../../store/AppContext";
import Comments from "./articleComponents/Comments/Comments";
import { handleDate } from "../../utils/handleDate";
import { userRoles } from "../../types/appTypes";
import { IArticle, IArticleData } from "../../types/articleTypes";
import useSingleArticle from "../../hooks/Articles/useSingleArticle";
import useArticles from "../../hooks/Articles/useArticles";
import { CommentsProvider } from "../../hooks/Articles/comments/useCommentsContext";
import useDeleteArticle from "../../hooks/Articles/useDeleteArticle";

const SingleArticle = ({ type }: { type: string }) => {
	const { articleId } = useParams();
	const navigate = useNavigate();
	const { user } = useGlobalContext();
	const [articlesData, setArticlesData] = useState<IArticleData[]>([]);
	const { data: articles } = useArticles(type);
	const {
		data: article,
		isLoading: articleLoading,
		isError: articleIsError,
		error: articleError,
	} = useSingleArticle(type, articleId);

	const {
		mutate: deleteArticle,
		error: deleteError,
		isError: deleteIsError,
		isLoading: deleteLoading,
	} = useDeleteArticle();

	useEffect(() => {
		if (!articles) return;
		const getArticlesData = (articles: IArticle[]): IArticleData[] => {
			return articles.map((item) => {
				return { _id: item._id, category: item.category, title: item.title };
			});
		};
		setArticlesData(getArticlesData(articles));
	}, [articles]);

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
									<ReadButton as="a" href={article.source_link}>
										Source
									</ReadButton>
								)}
								{article.demo_link && (
									<ReadButton as="a" href={article.demo_link}>
										View Live
									</ReadButton>
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
							{articlesData.length && (
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

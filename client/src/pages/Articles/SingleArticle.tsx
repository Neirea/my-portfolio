import { useNavigate, Link, NavLink } from "react-router-dom";
import {
	ArticleContentWrapper,
	ArticlePageWrapper,
	TagsGroup,
	ArticleSideMenuWrapper,
} from "./ArticleStyles";
import BigImg from "../../components/BigImg";
import {
	AdminButton,
	AdminButtonLink,
	AlertContainer,
	ReadButton,
	StyledLoading,
} from "../../styles/StyledComponents";
import axios from "axios";

import { handleError } from "../../utils/handleError";
import { useGlobalContext } from "../../store/AppContext";
import { useArticleContext } from "../../store/SingleArticleContext";
import Comments from "./articleComponents/Comments/Comments";
import { handleDate } from "../../utils/handleDate";
import { userRoles } from "../../types/appTypes";

const SingleArticle = () => {
	const navigate = useNavigate();
	const { user, darkMode } = useGlobalContext();
	const {
		alert,
		showAlert,
		hideAlert,
		loading,
		setLoading,
		article,
		articlesData,
	} = useArticleContext();

	const handleDelete = async (articleId: number) => {
		hideAlert();
		setLoading(true);
		try {
			const route = articleId ? `/${article?.category}` : "/";
			await axios.delete(`/api/article/${articleId}`);

			navigate(route);
		} catch (error) {
			setLoading(false);
			handleError(error, navigate);
			showAlert({
				text: error?.response?.data?.msg || "There was an error!",
			});
		}
	};

	return (
		<ArticlePageWrapper id="articles-wrapper-id">
			{alert.show ? (
				<AlertContainer>
					<p>{alert.text}</p>
					<Link className="alert-link" to="/">
						Go back to Home page
					</Link>
				</AlertContainer>
			) : !article ? (
				<StyledLoading as="div" darkMode={darkMode}>
					<div />
				</StyledLoading>
			) : (
				<>
					<ArticleContentWrapper>
						<section className="article-wrapper">
							<article className="article-post">
								<div className="article-header">
									<h3 className="article-title">{article.title}</h3>
									<p className="article-date">
										{handleDate(article.updatedAt)}
									</p>
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
									<AdminButtonLink to={`/edit-article?id=${article._id}`}>
										Edit
									</AdminButtonLink>

									<AdminButton
										disabled={loading}
										onClick={() => handleDelete(article._id)}
									>
										Delete
									</AdminButton>
								</div>
							)}
							<Comments />
						</section>
					</ArticleContentWrapper>

					{articlesData.length > 0 && (
						<ArticleSideMenuWrapper className="sidebar-single">
							<div className="article-aside-container">
								<h5>{`Read also:`}</h5>
								<ul>
									{articlesData.map((item, index) => {
										return (
											article._id !== item._id && (
												<li key={`title-${index}`}>
													<Link
														className="article-aside-title"
														to={`/read?a=${item._id}`}
													>
														{item.title}
													</Link>
												</li>
											)
										);
									})}
								</ul>
							</div>
						</ArticleSideMenuWrapper>
					)}
				</>
			)}
		</ArticlePageWrapper>
	);
};

export default SingleArticle;

import { Fragment, useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
	ArticleContentWrapper,
	TagsGroup,
	ArticlePageWrapper,
	ArticleSideMenuWrapper,
} from "./ArticleStyles";
import BigImg from "../../components/BigImg";
import ArticleSideMenu from "./articleComponents/ArticleSideMenu";
import LoadingSpinner from "../../components/LoadingSpinner";

import {
	AdminButton,
	AdminButtonLink,
	LinkButton,
	AlertContainer,
} from "../../styles/StyledComponents";

import useLocalState from "../../utils/useLocalState";
import { useGlobalContext } from "../../store/AppContext";
import { handleDate } from "../../utils/handleDate";
import { IArticle } from "../../types/articleTypes";
import { userRoles } from "../../types/appTypes";
import useArticles from "../../hooks/Articles/useArticles";
import useDeleteArticle from "../../hooks/Articles/useDeleteArticle";

const MAX_CHARS = 300;

const Articles = ({ type }: { type: string }) => {
	const { alert, showAlert, hideAlert, loading, setLoading } = useLocalState();
	const { user } = useGlobalContext();
	// const [articles, setArticles] = useState<IArticle[]>([]);
	const [tags, setTags] = useState<string[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	let isArticlesShow = false;
	const articles = useArticles(type);
	const deleteArticle = useDeleteArticle();

	useEffect(() => {
		window.history.pushState({}, "", `/${type}`);
	}, [type]);

	//set tags
	useEffect(() => {
		if (!articles.data) return;

		let articleTags: string[] = [];
		for (let i = 0; i < articles.data.length; i++) {
			articles.data[i].tags.forEach((elem) => {
				//check for correct type and if it already is in array
				articles.data[i].category === type &&
					articleTags.indexOf(elem) === -1 &&
					articleTags.push(elem);
			});
		}
		setTags(articleTags);
	}, [type, articles.data]);

	//combine errors
	useEffect(() => {
		const error: any = articles.error || deleteArticle.error;
		if (error) {
			showAlert({
				text: error.response?.data?.msg || "There was some error",
			});
		} else {
			hideAlert();
		}
	}, [articles.error, deleteArticle.error, showAlert, hideAlert]);

	//combine loadings
	useEffect(() => {
		const isLoading = articles.isLoading || deleteArticle.isLoading;
		setLoading(isLoading);
	}, [articles.isLoading, deleteArticle.isLoading, setLoading]);

	const filterTags = (elem: string) => {
		//copy values from old tags
		let newTags: string[] = [...selectedTags];

		const element = document.getElementById(elem);
		//remove active tag
		if (element?.classList.contains("activated")) {
			const index = selectedTags.indexOf(elem);
			newTags.splice(index, 1);
			setSelectedTags(newTags);
			element.classList.remove("activated");
		}
		//add active tag
		if (selectedTags.indexOf(elem) === -1) {
			newTags.push(elem);
			setSelectedTags(newTags);
			element?.classList.add("activated");
		}
		//scroll to top of screen on mobile
		window.innerWidth < 1000 && window.scrollTo(0, 0);
	};

	const isArticleHide = (element: IArticle) => {
		return (
			selectedTags.length > 0 &&
			selectedTags.some((tag) => element.tags.indexOf(tag) === -1)
		);
	};

	return (
		<ArticlePageWrapper>
			{alert.show ? (
				<AlertContainer>
					<p>{alert.text}</p>
					<Link className="alert-link" to="/">
						Go back to Home page
					</Link>
				</AlertContainer>
			) : !articles.data ? (
				<LoadingSpinner />
			) : (
				<>
					<ArticleContentWrapper className="flex-item-1">
						<div className="article-wrapper">
							{articles.data.map((element) => {
								if (isArticleHide(element)) {
									return <Fragment key={element._id} />;
								}
								isArticlesShow = true;

								//transform html to string stopping before img/code
								const tempDiv = document.createElement("div");
								tempDiv.innerHTML = element.content
									.split("<img")[0]
									.split("<pre")[0];
								const htmlContent =
									tempDiv?.textContent?.slice(0, MAX_CHARS) || "";
								tempDiv.remove();

								return (
									<div className="article-container" key={element._id}>
										<article className="article-post">
											<div className="article-header">
												<Link
													className="article-title"
													to={`/${type}/${element._id}`}
												>
													<h3>{element.title}</h3>
												</Link>
												<p className="article-date">
													{handleDate(element.createdAt.toString())}
												</p>
												{element.tags.length > 0 && (
													<TagsGroup>
														{element.tags.map((tag, i) => {
															return (
																<button
																	key={`article-tag-${i}`}
																	onClick={() => filterTags(tag)}
																>
																	{tag}
																</button>
															);
														})}
													</TagsGroup>
												)}
												<BigImg
													className="article-image"
													src={element.image}
													alt={element.title}
												/>
											</div>
											<p className="article-text">{htmlContent}</p>
											<div className="article-buttons-group">
												<LinkButton to={`/${type}/${element._id}`}>
													Read More
												</LinkButton>
												<div className="article-links">
													{element.source_link && (
														<LinkButton as="a" href={element.source_link}>
															Source
														</LinkButton>
													)}
													{element.demo_link && (
														<LinkButton as="a" href={element.demo_link}>
															View Live
														</LinkButton>
													)}
												</div>
											</div>
										</article>
										{user && user.roles.includes(userRoles.admin) && (
											<div className="admin-buttons">
												<AdminButtonLink to={`/edit-article/${element._id}`}>
													Edit
												</AdminButtonLink>

												<AdminButton
													disabled={loading}
													onClick={() => {
														deleteArticle.mutate({
															articleId: element._id,
															type: type,
														});
													}}
												>
													Delete
												</AdminButton>
											</div>
										)}
									</div>
								);
							})}

							{!isArticlesShow && (
								<AlertContainer>
									<p>There are no articles with these filters Lorem ipsum</p>
								</AlertContainer>
							)}
						</div>
					</ArticleContentWrapper>
					<ArticleSideMenuWrapper className="flex-item-2">
						<ArticleSideMenu
							tags={tags}
							setSelectedTags={setSelectedTags}
							filterTags={filterTags}
						/>
					</ArticleSideMenuWrapper>
				</>
			)}
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

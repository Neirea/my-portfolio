import { Fragment, useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
	ArticleContentWrapper,
	TagsGroup,
	ArticlePageWrapper,
	ArticleSideMenuWrapper,
} from "./ArticleStyles";
import ArticleSideMenu from "./articleComponents/ArticleSideMenu";
import LoadingSpinner from "../../components/LoadingSpinner";

import {
	AdminButtonLink,
	LinkButton,
	AlertContainer,
	AdminButton,
} from "../../styles/StyledComponents";

import { useGlobalContext } from "../../store/AppContext";
import { handleDate } from "../../utils/handleDate";
import { IArticle } from "../../types/articleTypes";
import { userRoles } from "../../types/appTypes";
import useArticles from "../../hooks/Articles/useArticles";
import useDeleteArticle from "../../hooks/Articles/useDeleteArticle";

const MAX_CHARS = 300;

const Articles = ({ type }: { type: string }) => {
	const { user } = useGlobalContext();
	const [tags, setTags] = useState<string[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const {
		data: articles,
		isError: articlesIsError,
		error: articlesError,
	} = useArticles(type);
	const {
		mutate: deleteArticle,
		isError: deleteIsError,
		error: deleteError,
		isLoading: deleteLoading,
	} = useDeleteArticle();

	let isArticlesShow = false;

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

	const filterTags = (elem: string) => {
		const index = selectedTags.indexOf(elem);
		if (index > -1) {
			setSelectedTags((old) => old.filter((tag) => tag !== elem));
		} else {
			setSelectedTags((old) => [...old, elem]);
		}
		//scroll to top of screen on mobile
		window.innerWidth < 1000 &&
			window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
	};

	const isArticleHide = (element: IArticle) => {
		return (
			!!selectedTags.length &&
			selectedTags.some((tag) => element.tags.indexOf(tag) === -1)
		);
	};

	if (articlesIsError || deleteIsError) {
		const errorObj: any = articlesError || deleteError;
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

	if (!articles) {
		//skeleton here
		return <LoadingSpinner />;
	}

	return (
		<ArticlePageWrapper>
			<ArticleContentWrapper className="flex-item-1">
				<div className="article-wrapper">
					{articles.map((element) => {
						if (isArticleHide(element)) {
							return <Fragment key={element._id} />;
						}
						isArticlesShow = true;

						//transform html to string stopping before img/code
						const tempDiv = document.createElement("div");
						tempDiv.innerHTML = element.content
							.split("<img")[0]
							.split("<pre")[0];
						const htmlContent = tempDiv?.textContent?.slice(0, MAX_CHARS) || "";
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
										{!!element.tags.length && (
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
										<img
											className="article-image"
											loading="lazy"
											src={element.image}
											alt={element.title}
										/>
									</div>
									<p className="article-text">{htmlContent}</p>
									<div className="article-buttons-group">
										<LinkButton to={`/${type}/${element._id}`}>
											Read this
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
											disabled={deleteLoading}
											onClick={() => {
												deleteArticle({
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
							<p>There are no articles with these filters</p>
						</AlertContainer>
					)}
				</div>
			</ArticleContentWrapper>
			<ArticleSideMenuWrapper className="flex-item-2">
				{!!tags.length && (
					<ArticleSideMenu
						tags={tags}
						selectedTags={selectedTags}
						setSelectedTags={setSelectedTags}
						filterTags={filterTags}
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

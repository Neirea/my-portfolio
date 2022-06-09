import { Fragment, useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
	ArticleContentWrapper,
	TagsGroup,
	ArticlePageWrapper,
	ArticleSideMenuWrapper,
} from "./ArticleStyles";
import BigImg from "../../components/BigImg";
import ArticleSideMenu from "./articleComponents/ArticleSideMenu";
import LoadingSpinner from "../../components/LoadingSpinner";

import { handleError } from "../../utils/handleError";
import {
	ReadButton,
	AdminButton,
	AlertContainer,
} from "../../styles/StyledComponents";
import axios from "axios";

import useLocalState from "../../utils/useLocalState";
import { useGlobalContext } from "../../store/AppContext";
import { handleDate } from "../../utils/handleDate";
import { IArticle } from "../../types/articleTypes";
import { userRoles } from "../../types/appTypes";

const MAX_CHARS = 300;

const ArticlePosts = ({ type }: { type: string }) => {
	const navigate = useNavigate();

	const { user } = useGlobalContext();
	const { alert, showAlert, loading, setLoading, hideAlert } = useLocalState();
	const [articles, setArticles] = useState<IArticle[]>([]);
	const [tags, setTags] = useState<string[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	let isArticlesShow = false;

	useEffect(() => {
		const getArrayOfTags = (dataArticles: IArticle[]) => {
			let articleTags: string[] = [];

			for (let i = 0; i < dataArticles.length; i++) {
				dataArticles[i].tags.forEach((elem) => {
					//check for correct type and if it already is in array
					dataArticles[i].category === type &&
						articleTags.indexOf(elem) === -1 &&
						articleTags.push(elem);
				});
			}
			return articleTags;
		};
		const getAllArticles = async () => {
			hideAlert();
			setLoading(true);
			try {
				const { data } = await axios.get(`/api/article/${type}`);
				setArticles(data.articles);
				//gettings array of tags
				if (data.articles) {
					const articleTags = getArrayOfTags(data.articles);
					setTags(articleTags);
				}
			} catch (error) {
				const alertText = axios.isAxiosError(error)
					? (error?.response?.data as any).msg
					: "There was an error!";
				showAlert({ text: alertText });
			} finally {
				setLoading(false);
			}
		};
		//remove location state link
		window.history.pushState({}, "", `/${type}`);
		getAllArticles();
	}, [type, showAlert, hideAlert, setLoading]);

	const localDeleteArticle = (articleId: number) => {
		let items = articles;
		//find index of deleted article in a list
		const articleIndex = items
			.map((elem) => {
				return elem._id;
			})
			.indexOf(articleId);
		items.splice(articleIndex, 1);
		return items;
	};

	const handleDelete = async (articleId: number) => {
		hideAlert();
		setLoading(true);

		try {
			await axios.delete(`/api/article/${articleId}`);
			//1st way: update without additional http request
			let items = localDeleteArticle(articleId);

			//if no articles left refresh page
			if (!items.length) navigate(0);
		} catch (error) {
			handleError(error, navigate);
			showAlert({
				text: error?.response?.data?.msg || "there was an error",
			});
		} finally {
			setLoading(false);
		}
	};

	const filterTags = (elem: string) => {
		//assign values from old tags
		let newTags: string[] = [];
		selectedTags.forEach((item) => newTags.push(item));

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
					<Link to="/">Go back to Home page</Link>
				</AlertContainer>
			) : !articles.length ? (
				<LoadingSpinner />
			) : (
				<>
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
								const htmlContent =
									tempDiv?.textContent?.slice(0, MAX_CHARS) || "";
								tempDiv.remove();

								return (
									<div className="article-container" key={element._id}>
										<article className="article-post">
											<div className="article-header">
												<Link
													className="article-title"
													to={`/read?a=${element._id}`}
												>
													<h3>{element.title}</h3>
												</Link>
												<p className="article-date">
													{handleDate(element.createdAt.toString())}
												</p>
												{element.tags && (
													<TagsGroup>
														{element.tags.map((tag, i) => {
															return (
																<li
																	key={`article-tag-${i}`}
																	onClick={() => filterTags(tag)}
																>
																	{tag}
																</li>
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
												<Link to={`/read?a=${element._id}`}>
													<ReadButton>Read More</ReadButton>
												</Link>
												<div className="article-links">
													{element.source_link && (
														<a href={element.source_link}>
															<ReadButton>Source</ReadButton>
														</a>
													)}
													{element.demo_link && (
														<a href={element.demo_link}>
															<ReadButton>View Live</ReadButton>
														</a>
													)}
												</div>
											</div>
										</article>
										{user && user.roles.includes(userRoles.admin) && (
											<div className="admin-buttons">
												<Link to={`/edit-article?id=${element._id}`}>
													<AdminButton>Edit</AdminButton>
												</Link>

												<AdminButton
													disabled={loading}
													onClick={() => {
														handleDelete(element._id);
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
									<p>There is no articles with these filters</p>
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

export default ArticlePosts;

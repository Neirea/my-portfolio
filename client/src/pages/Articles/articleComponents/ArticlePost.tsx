import { FaEye } from "@react-icons/all-files/fa/FaEye";
import { FaGithub } from "@react-icons/all-files/fa/FaGithub";
import { NavLink } from "react-router-dom";
import { LinkButton } from "../../../styles/StyledComponents";
import type { IArticle } from "../../../types/articleTypes";
import { handleDate } from "../../../utils/handleDate";
import { TagsGroup } from "../ArticleStyles";

const ArticlePost = ({ article }: { article: IArticle }) => {
	return (
		<article className="article-post">
			<div className="article-header">
				<h3 className="article-title">{article.title}</h3>
				<div className="article-info">
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
					<p className="article-date">{handleDate(article.createdAt)}</p>
				</div>
				<img
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
						<FaGithub />
						Source
					</LinkButton>
				)}
				{article.demo_link && (
					<LinkButton as="a" href={article.demo_link}>
						<FaEye />
						View Live
					</LinkButton>
				)}
			</div>
		</article>
	);
};

export default ArticlePost;

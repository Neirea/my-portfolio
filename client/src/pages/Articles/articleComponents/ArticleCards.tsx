import { ArticleCardsWrapper, ArticleCardsContainer } from "../ArticleStyles";
import { LinkButton } from "../../../styles/StyledComponents";
import { Link } from "react-router-dom";
import { FaGithub } from "@react-icons/all-files/fa/FaGithub";
import { FaEye } from "@react-icons/all-files/fa/FaEye";
import type { IArticle } from "../../../types/articleTypes";
import { handleDate } from "../../../utils/handleDate";

const MAX_CHARS = 200;

const ArticleCards = ({
	articleCards,
	type,
}: {
	articleCards: IArticle[];
	type: string;
}) => {
	return (
		<ArticleCardsWrapper className="flex-item-1">
			{articleCards.map((element, idx) => {
				//transform html to string stopping before img/code
				const tempDiv = document.createElement("div");
				tempDiv.innerHTML = element.content.split("<img")[0].split("<pre")[0];
				const htmlContent = tempDiv?.textContent?.slice(0, MAX_CHARS) || "";
				tempDiv.remove();

				return (
					<ArticleCardsContainer key={element._id}>
						<Link to={`/${type}/${element._id}`}>
							<img
								className="acard-image"
								loading={idx > 3 ? "lazy" : "eager"}
								src={element.image}
								alt={element.title}
							/>
						</Link>
						<div className="acard-content">
							<Link className="acard-title" to={`/${type}/${element._id}`}>
								<h4>{element.title}</h4>
							</Link>
							<div className="acard-info">
								{!!element.tags.length && (
									<div className="acard-tags-group">
										{element.tags.map((tag, i) => {
											const comma = i !== element.tags.length - 1 ? "," : "";
											return (
												<span key={`acard-tag-${i}`} className="acard-tag">
													{tag + comma}
												</span>
											);
										})}
									</div>
								)}
								<p className="acard-date">
									{handleDate(element.createdAt.toString())}
								</p>
							</div>
							<p className="acard-text">{htmlContent}</p>
							<div className="acard-buttons">
								{element.source_link && (
									<LinkButton as="a" href={element.source_link}>
										<FaGithub />
										Source
									</LinkButton>
								)}
								{element.demo_link && (
									<LinkButton as="a" href={element.demo_link}>
										<FaEye />
										View Live
									</LinkButton>
								)}
							</div>
						</div>
					</ArticleCardsContainer>
				);
			})}
		</ArticleCardsWrapper>
	);
};

export default ArticleCards;

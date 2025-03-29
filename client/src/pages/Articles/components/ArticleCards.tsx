import { FaEye } from "@react-icons/all-files/fa/FaEye";
import { FaGithub } from "@react-icons/all-files/fa/FaGithub";
import type { JSX } from "react";
import { Link } from "react-router";
import { LinkButton } from "../../../styles/common.style";
import type { Article, Category } from "../../../types/article.type";
import { handleDate } from "../../../utils/handleDate";
import { ArticleCardContainer } from "../Articles.style";

const MAX_CHARS = 200;

const ArticleCards = ({
    articleCards,
    type,
}: {
    articleCards: Article[];
    type: Category;
}): JSX.Element => {
    return (
        <>
            {articleCards.map((element, idx) => {
                const tempDiv = document.createElement("div");
                const contentBeforeImg = element.html?.split("<img")[0] || "";
                tempDiv.innerHTML = contentBeforeImg.split("<pre")[0] || "";
                const htmlContent =
                    tempDiv.textContent?.slice(0, MAX_CHARS) || "";
                tempDiv.remove();

                return (
                    <ArticleCardContainer key={element.slug}>
                        <Link to={`/${type}/${element.slug}`}>
                            <img
                                className="acard-image"
                                loading={idx > 3 ? "lazy" : "eager"}
                                src={element.image}
                                alt={element.title}
                            />
                        </Link>
                        <div className="acard-content">
                            <Link
                                className="acard-title"
                                to={`/${type}/${element.slug}`}
                            >
                                <h4>{element.title}</h4>
                            </Link>
                            <div className="acard-info">
                                {!!element.tags.length && (
                                    <div className="acard-tags-group">
                                        {element.tags.map((tag, i) => {
                                            const comma =
                                                i !== element.tags.length - 1
                                                    ? ","
                                                    : "";
                                            return (
                                                <span
                                                    key={`acard-tag-${i}`}
                                                    className="acard-tag"
                                                >
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
                                {element.source_link ? (
                                    <LinkButton to={element.source_link}>
                                        <FaGithub />
                                        Source
                                    </LinkButton>
                                ) : (
                                    <div></div>
                                )}
                                {element.demo_link && (
                                    <LinkButton to={element.demo_link}>
                                        <FaEye />
                                        View Live
                                    </LinkButton>
                                )}
                            </div>
                        </div>
                    </ArticleCardContainer>
                );
            })}
        </>
    );
};

export default ArticleCards;

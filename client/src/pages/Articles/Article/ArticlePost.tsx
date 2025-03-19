import { FaEye } from "@react-icons/all-files/fa/FaEye";
import { FaGithub } from "@react-icons/all-files/fa/FaGithub";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router";
import ImageModal from "../../../components/ImageModal";
import { LinkButton } from "../../../styles/common.style";
import type { Article } from "../../../types/article.type";
import { handleDate } from "../../../utils/handleDate";
import { TagsGroup } from "../Articles.style";

const ArticlePost = ({ article }: { article: Article }): JSX.Element => {
    const articleRef = useRef<HTMLElement>(null);
    const [imagePortal, setImagePortal] = useState<HTMLImageElement | null>(
        null,
    );

    const handleClose = (): void => {
        setImagePortal(null);
    };

    useEffect(() => {
        if (!articleRef.current) return;
        const controller = new AbortController();
        articleRef.current.addEventListener(
            "click",
            (e) => {
                if (e.target instanceof HTMLImageElement) {
                    setImagePortal(e.target);
                }
            },
            {
                signal: controller.signal,
            },
        );

        return (): void => {
            if (!articleRef.current) return;
            controller.abort();
        };
    }, []);

    return (
        <article className="article-post" ref={articleRef}>
            {imagePortal != null && (
                <ImageModal image={imagePortal} closeModal={handleClose} />
            )}
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
                    <p className="article-date">
                        {handleDate(article.createdAt)}
                    </p>
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
                    <LinkButton to={article.source_link}>
                        <FaGithub />
                        Source
                    </LinkButton>
                )}
                {article.demo_link && (
                    <LinkButton to={article.demo_link}>
                        <FaEye />
                        View Live
                    </LinkButton>
                )}
            </div>
        </article>
    );
};

export default ArticlePost;

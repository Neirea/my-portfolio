import { type Dispatch, type SetStateAction, useEffect } from "react";
import { useLocation } from "react-router";
import type { LocationState } from "../../../types/app.type";
import { TagsGroup } from "../Articles.style";

type ArticlePostsSideMenuProps = {
    tags: string[];
    selectedTags: string[];
    setSelectedTags: Dispatch<SetStateAction<string[]>>;
};

const ArticlePostsSideMenu = ({
    tags,
    selectedTags,
    setSelectedTags,
}: ArticlePostsSideMenuProps): JSX.Element => {
    const location = useLocation<LocationState>();

    useEffect(() => {
        const prevTag = location.state?.tag || null;
        if (!prevTag) return;
        setSelectedTags([prevTag]);
        window.history.replaceState({}, "");
    }, [location.state, setSelectedTags]);

    const filterTags = (elem: string): void => {
        const index = selectedTags.indexOf(elem);
        if (index > -1) {
            setSelectedTags((old) => old.filter((tag) => tag !== elem));
        } else {
            setSelectedTags((old) => [...old, elem]);
        }
        if (window.innerWidth < 1000) {
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
    };

    return (
        <section className="article-aside-container">
            {!!tags.length && (
                <>
                    <h4>{`Filter:`}</h4>
                    <TagsGroup>
                        {tags.map((elem, i) => {
                            const isActive = selectedTags.some(
                                (tag) => tag === elem,
                            );
                            return (
                                <button
                                    id={elem}
                                    className={isActive ? "activated" : ""}
                                    onClick={() => filterTags(elem)}
                                    key={`tag-${i}`}
                                >
                                    {elem}
                                </button>
                            );
                        })}
                    </TagsGroup>
                </>
            )}
        </section>
    );
};

export default ArticlePostsSideMenu;

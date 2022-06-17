import { useEffect, Dispatch, SetStateAction } from "react";
import { useLocation } from "react-router-dom";
import { TagsGroup } from "../ArticleStyles";
import { LocationState } from "../../../types/appTypes";

interface ArticlePostsSideMenuProps {
	tags: string[];
	selectedTags: string[];
	setSelectedTags: Dispatch<SetStateAction<string[]>>;
	filterTags: (tag: string) => void;
}

const ArticlePostsSideMenu = ({
	tags,
	selectedTags,
	setSelectedTags,
	filterTags,
}: ArticlePostsSideMenuProps) => {
	const location = useLocation<LocationState>();

	//check if it comes from another page
	useEffect(() => {
		const prevTag = location.state?.tag || null;
		if (!prevTag) return;
		setSelectedTags([prevTag]);
		window.history.replaceState({}, "");
	}, [location.state, setSelectedTags]);

	return (
		<section className="article-aside-container">
			{!!tags.length && (
				<>
					<h4>{`Filter:`}</h4>
					<TagsGroup>
						{tags.map((elem, i) => {
							const isActive = selectedTags.some((tag) => tag === elem);
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

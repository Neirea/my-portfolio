import { useEffect, Dispatch, SetStateAction } from "react";
import { useLocation } from "react-router-dom";
import { TagsGroup } from "../ArticleStyles";

interface ArticlePostsSideMenuProps {
	tags: string[];
	setSelectedTags: Dispatch<SetStateAction<string[]>>;
	filterTags: (tag: string) => void;
}

const ArticlePostsSideMenu = ({
	tags,
	setSelectedTags,
	filterTags,
}: ArticlePostsSideMenuProps) => {
	const location = useLocation();
	const prevTag = (location.state as any)?.tag || null;

	//check if it comes from another page
	useEffect(() => {
		if (!prevTag) return;

		const element = document.getElementById(prevTag);
		element?.classList.add("activated");
		setSelectedTags([prevTag]);
	}, [prevTag, setSelectedTags]);

	return (
		<div className="article-aside-container">
			{tags && tags.length > 0 && (
				<>
					<h5>{`Filter:`}</h5>
					<TagsGroup>
						{tags.map((elem, i) => {
							return (
								<li
									id={elem}
									className="article-aside-list-item"
									onClick={() => filterTags(elem)}
									key={`tag-${i}`}
								>
									{elem}
								</li>
							);
						})}
					</TagsGroup>
				</>
			)}
		</div>
	);
};

export default ArticlePostsSideMenu;

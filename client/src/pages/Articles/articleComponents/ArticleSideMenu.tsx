import { useEffect, Dispatch, SetStateAction } from "react";
import { useLocation } from "react-router-dom";
import { TagsGroup } from "../ArticleStyles";
import { LocationState } from "../../../types/appTypes";

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
	const location = useLocation<LocationState>();
	const prevTag = location.state?.tag || null;

	//check if it comes from another page
	useEffect(() => {
		if (!prevTag) return;

		const element = document.getElementById(prevTag);
		element?.classList.add("activated");
		setSelectedTags([prevTag]);
	}, [prevTag, setSelectedTags]);

	return (
		<section className="article-aside-container">
			{!!tags.length && (
				<>
					<h4>{`Filter:`}</h4>
					<TagsGroup>
						{tags.map((elem, i) => {
							return (
								<button
									id={elem}
									className="article-aside-list-item"
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

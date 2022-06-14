import { useState } from "react";
import { useLocation } from "react-router-dom";

import { EditorState } from "draft-js";

import { useGlobalContext } from "../../store/AppContext";
import EditorLayout from "./articleComponents/EditorLayout";
import { languageDetector } from "../../utils/handleHtmlString";
import { categoriesEnum, IArticleValues } from "../../types/articleTypes";
import { LocationState } from "../../types/appTypes";
import useCreateArticle from "../../hooks/Articles/useCreateArticle";

const CreateArticle = () => {
	const createArticle = useCreateArticle();
	const location = useLocation<LocationState>();
	const { user } = useGlobalContext();

	const [articleValues, setArticleValues] = useState<IArticleValues>({
		title: "",
		category:
			(location.state?.from?.toString() as categoriesEnum) ||
			categoriesEnum.blog,
		demo_link: "",
		source_link: "",
	});
	const [tags, setTags] = useState("");
	const [selectedImage, setSelectedImage] = useState<File | undefined>(
		undefined
	);
	const [preview, setPreview] = useState<string | undefined>(undefined);
	const [editorState, setEditorState] = useState<EditorState>(
		EditorState.createEmpty()
	);

	const onSubmit = async (editorHTML: string) => {
		const articleTags = tags.split(" ");

		const createdArticle = {
			...articleValues,
			tags: articleTags,
			content: editorHTML,
			image: "",
			img_id: "",
			userId: user!._id,
			code_languages: languageDetector(editorHTML),
		};

		createArticle.mutate({ selectedImage, newArticle: createdArticle });
	};

	return (
		<EditorLayout
			articleValues={articleValues}
			setArticleValues={setArticleValues}
			categories={Object.values(categoriesEnum)}
			onSubmit={onSubmit}
			editorState={editorState}
			setEditorState={setEditorState}
			preview={preview}
			setPreview={setPreview}
			selectedImage={selectedImage}
			setSelectedImage={setSelectedImage}
			tags={tags}
			setTags={setTags}
			success={createArticle.isSuccess}
			loading={createArticle.isLoading}
			alert={createArticle.error}
		/>
	);
};

export default CreateArticle;

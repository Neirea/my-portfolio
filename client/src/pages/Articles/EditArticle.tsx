import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { EditorState, ContentState } from "draft-js";
import htmlToDraft from "html-to-draftjs";

import useLocalState from "../../utils/useLocalState";
import { useCurrentLocation } from "../../utils/useCurrentLocation";
import { handleError } from "../../utils/handleError";
import EditorLayout from "./articleComponents/EditorLayout";
import { languageDetector } from "../../utils/handleHtmlString";
import {
	IArticleValues,
	categoriesEnum,
	IArticle,
	IUploadedImageResponse,
} from "../../types/articleTypes";

const EditArticle = () => {
	const navigate = useNavigate();
	const queries = useCurrentLocation();
	const articleId = queries.get("id");

	const {
		alert,
		showAlert,
		loading,
		setLoading,
		success,
		setSuccess,
		hideAlert,
	} = useLocalState();

	const [categories, setCategories] = useState<string[]>([]);
	const [articleValues, setArticleValues] = useState<IArticleValues>({
		title: "",
		category: categoriesEnum.blog,
		demo_link: "",
		source_link: "",
	});
	const [tags, setTags] = useState<string>("");
	const [selectedImage, setSelectedImage] = useState<File | undefined>(
		undefined
	);
	const [preview, setPreview] = useState<string | undefined>(undefined);
	const [editorState, setEditorState] = useState(EditorState.createEmpty());

	//get html from article id and put it into editor
	useEffect(() => {
		const getContent = async () => {
			const { data } = await axios.get<{ article: IArticle }>(
				`/api/article/${articleId}`
			);
			const contentState = ContentState.createFromBlockArray(
				htmlToDraft(data.article.content).contentBlocks
			);

			setEditorState(EditorState.createWithContent(contentState));
			setPreview(data.article.image);
			setArticleValues({
				userId: data.article.userId,
				title: data.article.title,
				content: data.article.content,
				category: data.article.category,
				image: data.article.image,
				img_id: data.article.img_id,
				demo_link: data.article.demo_link,
				source_link: data.article.source_link,
			});
			setTags(data.article.tags.join(" "));

			//get list of categories
			const response = await axios.get<{ categories: categoriesEnum[] }>(
				"/api/article/articleCategories"
			);
			setCategories(response.data.categories);
		};
		getContent();
	}, [articleId]);

	const onSubmit = async (editorHTML: string) => {
		try {
			hideAlert();
			setLoading(true);

			const articleTags = tags.split(" ");

			const updatedArticle = {
				...articleValues,
				tags: articleTags,
				content: editorHTML,
				code_languages: languageDetector(editorHTML),
			};

			if (selectedImage) {
				const data = new FormData();
				data.append("image", selectedImage);
				const response = await axios.post<IUploadedImageResponse>(
					"/api/article/upload",
					data
				);
				updatedArticle.image = response.data.image.src;
				updatedArticle.img_id = response.data.image.img_id;
			}
			await axios.patch(`/api/article/${articleId}`, updatedArticle);
			setSuccess(true);
			showAlert({
				text: "article was successfuly saved!",
				type: "success",
			});
		} catch (error) {
			handleError(error, navigate);
			showAlert({ text: error?.response?.data?.msg || "there was an error" });
		} finally {
			setLoading(false);
		}
	};

	return (
		<EditorLayout
			articleValues={articleValues}
			setArticleValues={setArticleValues}
			categories={categories}
			onSubmit={onSubmit}
			editorState={editorState}
			setEditorState={setEditorState}
			preview={preview}
			setPreview={setPreview}
			selectedImage={selectedImage}
			setSelectedImage={setSelectedImage}
			tags={tags}
			setTags={setTags}
			success={success}
			loading={loading}
			alert={alert}
		/>
	);
};

export default EditArticle;

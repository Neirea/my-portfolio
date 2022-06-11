import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { EditorState } from "draft-js";

import { useGlobalContext } from "../../store/AppContext";
import useLocalState from "../../utils/useLocalState";
import { handleError } from "../../utils/handleError";
import EditorLayout from "./articleComponents/EditorLayout";
import { languageDetector } from "../../utils/handleHtmlString";
import { categoriesEnum } from "../../types/articleTypes";
import { LocationState } from "../../types/appTypes";

const CreateArticle = () => {
	const navigate = useNavigate();
	const location = useLocation<LocationState>();
	const {
		alert,
		showAlert,
		loading,
		setLoading,
		success,
		setSuccess,
		hideAlert,
	} = useLocalState();
	const { user } = useGlobalContext();

	const [categories, setCategories] = useState<string[]>([]);
	const [articleValues, setArticleValues] = useState({
		title: "",
		category: categoriesEnum.blog,
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

	//get article categories from server
	useEffect(() => {
		const getCategoryValues = async () => {
			try {
				const response = await axios.get("/api/article/articleCategories");
				setCategories(response.data.categories);
				setArticleValues((prevValue) => {
					return {
						...prevValue,
						category:
							location.state?.from?.toString() || response.data.categories[0],
					};
				});
			} catch (error) {
				handleError(error, navigate);
			}
		};
		getCategoryValues();
	}, [navigate, location.state]);

	const onSubmit = async (editorHTML: string) => {
		if (!selectedImage) return;
		try {
			hideAlert();
			setLoading(true);

			const articleTags = tags.split(" ");

			const data = new FormData();
			data.append("image", selectedImage.name);
			//upload  image to server
			const response = await axios.post("/api/article/upload", data);

			//to avoid setArticleValues between 2 depending await's
			const createdArticle = {
				...articleValues,
				tags: articleTags,
				content: editorHTML,
				image: response.data.image.src,
				img_id: response.data.image.img_id,
				userId: user!._id,
				code_languages: languageDetector(editorHTML),
			};
			await axios.post("/api/article/", createdArticle);

			setSuccess(true);
			showAlert({
				text: `article successfuly created!`,
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

export default CreateArticle;

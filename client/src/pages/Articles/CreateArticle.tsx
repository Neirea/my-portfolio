import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { EditorState } from "draft-js";

import { useGlobalContext } from "../../store/AppContext";
import useLocalState from "../../utils/useLocalState";
import { handleError } from "../../utils/handleError";
import EditorLayout from "./articleComponents/EditorLayout";
import { languageDetector } from "../../utils/handleHtmlString";
import {
	categoriesEnum,
	IArticleValues,
	IUploadedImageResponse,
} from "../../types/articleTypes";
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

	const [articleValues, setArticleValues] = useState<IArticleValues>({
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
		setArticleValues((prevValue) => {
			return {
				...prevValue,
				category:
					(location.state?.from?.toString() as categoriesEnum) ||
					categoriesEnum.blog,
			};
		});
	}, [navigate, location.state]);

	const onSubmit = async (editorHTML: string) => {
		try {
			hideAlert();
			if (!selectedImage) {
				showAlert({ text: "Please provide image" });
				return;
			}
			setLoading(true);

			const articleTags = tags.split(" ");

			const data = new FormData();
			data.append("image", selectedImage);

			//do mutate operation here

			//upload  image to server
			const response = await axios.post<IUploadedImageResponse>(
				"/api/article/upload",
				data
			);

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
			success={success}
			loading={loading}
			alert={alert}
		/>
	);
};

export default CreateArticle;

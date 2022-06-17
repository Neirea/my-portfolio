import {
	ChangeEvent,
	Dispatch,
	FormEvent,
	SetStateAction,
	useEffect,
} from "react";
import { Link } from "react-router-dom";
import {
	CUArticleWrapper,
	CUArticleForm,
	ArticleContentWrapper,
	TagsGroup,
} from "../ArticleStyles";
import {
	AdminButton,
	AlertMsg,
	AlertContainer,
} from "../../../styles/StyledComponents";
/* editor imports */
import { Editor } from "react-draft-wysiwyg";
import "../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
/* -------------- */
import FormRow from "../../../components/FormRow";
import { useDebounce } from "../../../utils/debounce";
import { handleHtmlString } from "../../../utils/handleHtmlString";
import { IArticleValues } from "../../../types/articleTypes";

interface EditorLayoutProps {
	articleValues: IArticleValues;
	setArticleValues: Dispatch<SetStateAction<IArticleValues>>;
	categories: string[];
	onSubmit: (value: string) => void;
	editorState: EditorState;
	setEditorState: Dispatch<SetStateAction<EditorState>>;
	preview: string | undefined;
	setPreview: Dispatch<SetStateAction<string | undefined>>;
	selectedImage: File | undefined;
	setSelectedImage: Dispatch<SetStateAction<File | undefined>>;
	tags: string;
	setTags: Dispatch<SetStateAction<string>>;
	success: boolean;
	loading: boolean;
	alert: any;
}

const EditorLayout = ({
	articleValues,
	setArticleValues,
	categories,
	onSubmit,
	editorState,
	setEditorState,
	preview,
	setPreview,
	selectedImage,
	setSelectedImage,
	tags,
	setTags,
	success,
	loading,
	alert,
}: EditorLayoutProps) => {
	const editorHTML = draftToHtml(convertToRaw(editorState.getCurrentContent()));
	const debouncedPreview = useDebounce(handleHtmlString(editorHTML, []), 500);

	//gets url for img preview
	useEffect(() => {
		if (!selectedImage) {
			setPreview(undefined);
			return;
		}
		const objectUrl = URL.createObjectURL(selectedImage);
		setPreview(objectUrl);
		// free memory when ever this component is unmounted
		return () => URL.revokeObjectURL(objectUrl);
	}, [selectedImage, setPreview]);

	//update state of Editor
	const onEditorStateChange = (state: EditorState) => {
		setEditorState(state);
	};

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		if (e.target.name === "tags") {
			setTags(e.target.value);
			return;
		}
		setArticleValues({ ...articleValues, [e.target.name]: e.target.value });
	};
	const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || !e.target.files.length) {
			setSelectedImage(undefined);
			return;
		}
		// using the first image instead of multiple
		setSelectedImage(e.target.files[0]);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		onSubmit(editorHTML);
	};

	if (success) {
		return (
			<AlertContainer>
				<p>Article was successfuly saved!</p>
				<Link to={`/${articleValues.category}`} className="alert-link">
					{`Go back to ${articleValues.category} page`}
				</Link>
			</AlertContainer>
		);
	}

	return (
		<CUArticleWrapper>
			<CUArticleForm onSubmit={handleSubmit}>
				<div className="article-form-inputs">
					<FormRow
						type="title"
						name="title"
						label="article title"
						value={articleValues.title}
						handleChange={handleChange}
					/>
					<FormRow
						type="tags"
						name="tags"
						label="article tags"
						value={tags}
						handleChange={handleChange}
					/>
					<FormRow
						type="url"
						name="demo_link"
						label="Demo link"
						placeholder="https://example.com"
						pattern="https://.*"
						isRequired={false}
						value={articleValues.demo_link}
						handleChange={handleChange}
					/>
					<FormRow
						type="url"
						name="source_link"
						label="Github link"
						placeholder="https://example.com"
						pattern="https://.*"
						isRequired={false}
						value={articleValues.source_link}
						handleChange={handleChange}
					/>
					<div className="form-row">
						<label htmlFor="category" className="form-label">
							category
						</label>
						<select
							id="category"
							className="form-input"
							name="category"
							value={articleValues.category}
							onChange={handleChange}
						>
							{categories &&
								categories.map((element, index) => {
									return <option key={index}>{element}</option>;
								})}
						</select>
					</div>
					<div className="form-row">
						<label htmlFor="file" className="form-label">
							upload image
						</label>
						<input
							id="file"
							type="file"
							name="image"
							onChange={handleUpload}
							className="form-input"
							accept="image/*"
						/>
					</div>
				</div>
				{alert && <AlertMsg>{alert.message}</AlertMsg>}
				{/* validator for input */}
				<input
					type="html-validator"
					className="html-validator"
					pattern=".{10,}"
					title="Must have equal or more than 10 characters"
					required
					value={editorHTML}
					onChange={() => {}}
				/>
				<Editor
					editorState={editorState}
					toolbarClassName="editor-toolbar"
					wrapperClassName="editor-wrapper"
					editorClassName="editor-body"
					toolbar={{
						blockType: {
							options: ["Normal", "H3", "H4", "Code", "Blockquote"],
						},
						fontSize: {
							options: [],
						},
						list: {
							options: ["unordered", "ordered"],
						},
					}}
					onEditorStateChange={onEditorStateChange}
				/>

				<br />
				<AdminButton type="submit" disabled={loading}>
					{loading ? "Loading..." : "Save"}
				</AdminButton>
			</CUArticleForm>
			<ArticleContentWrapper>
				<div className="article-post">
					<div className="article-header">
						<h3>{articleValues.title}</h3>
						<TagsGroup>
							{tags.split(" ").map((elem, i) => {
								return <button key={`a-${i}`}>{elem}</button>;
							})}
						</TagsGroup>
						{preview && (
							<img className="article-image" src={preview} alt="preview" />
						)}
					</div>
					<div
						className="article-text"
						dangerouslySetInnerHTML={{
							__html: debouncedPreview,
						}}
					/>
				</div>
			</ArticleContentWrapper>
		</CUArticleWrapper>
	);
};

export default EditorLayout;

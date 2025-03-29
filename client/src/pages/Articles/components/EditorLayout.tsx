import { marked } from "marked";
import {
    useCallback,
    useEffect,
    type ChangeEvent,
    type Dispatch,
    type FormEvent,
    type JSX,
    type SetStateAction,
} from "react";
import { Link } from "react-router";
import DOMPurify from "dompurify";
import FormRow from "../../../components/FormRow";
import {
    AdminButton,
    AlertContainer,
    AlertMsg,
} from "../../../styles/common.style";
import { CATEGORIES, type ArticleEditor } from "../../../types/article.type";
import { handleHtmlString } from "../../../utils/handleHtmlString";
import { useDebounce } from "../../../utils/useDebounce";
import {
    ArticleContentWrapper,
    CUArticleForm,
    CUArticleWrapper,
    TagsGroup,
} from "../Articles.style";

type EditorLayoutProps = {
    articleValues: ArticleEditor;
    setArticleValues: Dispatch<SetStateAction<ArticleEditor>>;
    onSubmit: (html: string) => Promise<void>;
    preview: string | undefined;
    setPreview: Dispatch<SetStateAction<string | undefined>>;
    selectedImage: File | undefined;
    setSelectedImage: Dispatch<SetStateAction<File | undefined>>;
    tags: string;
    setTags: Dispatch<SetStateAction<string>>;
    success: boolean;
    loading: boolean;
    alert: unknown;
};

const EditorLayout = ({
    articleValues,
    setArticleValues,
    onSubmit,
    preview,
    setPreview,
    selectedImage,
    setSelectedImage,
    tags,
    setTags,
    success,
    loading,
    alert,
}: EditorLayoutProps): JSX.Element => {
    const computeHtml = useCallback(() => {
        const html = handleHtmlString(
            marked.parse(articleValues.content) as string,
        );
        return DOMPurify.sanitize(html);
    }, [articleValues.content]);

    const debouncedPreview = useDebounce(computeHtml, 500);

    useEffect(() => {
        if (!selectedImage) {
            setPreview(undefined);
            return;
        }
        const objectUrl = URL.createObjectURL(selectedImage);
        setPreview(objectUrl);

        return (): void => URL.revokeObjectURL(objectUrl);
    }, [selectedImage, setPreview]);

    const handleChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ): void => {
        if (e.target.name === "tags") {
            setTags(e.target.value);
            return;
        }
        setArticleValues({ ...articleValues, [e.target.name]: e.target.value });
    };
    const handleUpload = (e: ChangeEvent<HTMLInputElement>): void => {
        if (!e.target.files || !e.target.files.length) {
            setSelectedImage(undefined);
            return;
        }
        setSelectedImage(e.target.files[0]);
    };

    const handleSubmit = (e: FormEvent): void => {
        e.preventDefault();
        void onSubmit(debouncedPreview);
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
                            {CATEGORIES &&
                                CATEGORIES.map((element, index) => {
                                    return (
                                        <option key={index}>{element}</option>
                                    );
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
                {alert instanceof Error && <AlertMsg>{alert.message}</AlertMsg>}
                <input
                    type="editor-body-validator"
                    className="editor-body-validator"
                    pattern=".{10,}"
                    title="Must have equal or more than 10 characters"
                    required
                    value={articleValues.content}
                    onChange={() => undefined}
                />
                <textarea
                    className="editor-body"
                    value={articleValues.content}
                    onChange={(e) =>
                        setArticleValues({
                            ...articleValues,
                            content: e.target.value,
                        })
                    }
                />
                <AdminButton type="submit" disabled={loading}>
                    {loading ? "Loading..." : "Save"}
                </AdminButton>
            </CUArticleForm>
            <ArticleContentWrapper>
                <div className="article-post">
                    <div className="article-header">
                        <h3>{articleValues.title}</h3>
                        <div className="article-info">
                            <TagsGroup>
                                {tags.split(" ").map((elem, i) => {
                                    return (
                                        <button key={`a-${i}`}>{elem}</button>
                                    );
                                })}
                            </TagsGroup>
                            <p className="article-date">
                                {new Date().toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "short",
                                    year: "2-digit",
                                })}
                            </p>
                        </div>
                        {preview && (
                            <img
                                className="article-image"
                                src={preview}
                                alt="preview"
                            />
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

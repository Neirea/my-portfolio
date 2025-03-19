import { EditorState } from "draft-js";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import useCreateArticle from "../../../hooks/Articles/useCreateArticle";
import type { LocationState } from "../../../types/app.type";
import type { ArticleEditor, Category } from "../../../types/article.type";
import { generateSlug } from "../../../utils/generateSlug";
import { languageDetector } from "../../../utils/handleHtmlString";
import EditorLayout from "../components/EditorLayout";

const CreateArticle = (): JSX.Element => {
    const createArticle = useCreateArticle();
    const location = useLocation<LocationState>();

    const [articleValues, setArticleValues] = useState<ArticleEditor>({
        title: "",
        slug: "",
        category:
            (location.state?.from?.pathname.slice(1) as Category) || "blog",
        demo_link: "",
        source_link: "",
        img_id: "",
        image: "",
        content: "",
    });
    const [tags, setTags] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | undefined>(
        undefined,
    );
    const [preview, setPreview] = useState<string | undefined>(undefined);
    const [editorState, setEditorState] = useState<EditorState>(
        EditorState.createEmpty(),
    );

    const handleSubmit = (editorHTML: string): void => {
        const articleTags = tags.split(" ");

        const createdArticle = {
            ...articleValues,
            slug: generateSlug(articleValues.title),
            tags: articleTags,
            content: editorHTML,
            image: "",
            img_id: "",
            code_languages: languageDetector(editorHTML),
        };

        createArticle.mutate({ selectedImage, newArticle: createdArticle });
    };

    return (
        <EditorLayout
            articleValues={articleValues}
            setArticleValues={setArticleValues}
            onSubmit={handleSubmit}
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

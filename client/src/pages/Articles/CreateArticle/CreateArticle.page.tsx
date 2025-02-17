import { EditorState } from "draft-js";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import useCreateArticle from "../../../hooks/Articles/useCreateArticle";
import { useGlobalContext } from "../../../store/AppContext";
import type { LocationState } from "../../../types/app.type";
import type { ArticleEditor } from "../../../types/article.type";
import { generateSlug } from "../../../utils/generateSlug";
import { languageDetector } from "../../../utils/handleHtmlString";
import EditorLayout from "../components/EditorLayout";

const CreateArticle = () => {
    const createArticle = useCreateArticle();
    const location = useLocation<LocationState>();
    const { user } = useGlobalContext();

    const [articleValues, setArticleValues] = useState<ArticleEditor>({
        title: "",
        slug: "",
        category: location.state?.from?.toString() || "blog",
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

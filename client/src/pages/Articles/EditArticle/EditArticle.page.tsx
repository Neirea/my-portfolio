import axios from "axios";
import { ContentState, EditorState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useEditArticle from "../../../hooks/Articles/useEditArticle";
import type { Article, ArticleEditor } from "../../../types/article.type";
import { languageDetector } from "../../../utils/handleHtmlString";
import EditorLayout from "../components/EditorLayout";
import { generateSlug } from "../../../utils/generateSlug";

const EditArticle = () => {
    const { articleId } = useParams();

    const [articleValues, setArticleValues] = useState<ArticleEditor>({
        title: "",
        slug: "",
        category: "blog",
        demo_link: "",
        source_link: "",
    });
    const [tags, setTags] = useState<string>("");
    const [selectedImage, setSelectedImage] = useState<File | undefined>(
        undefined
    );
    const [preview, setPreview] = useState<string | undefined>(undefined);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const editArticle = useEditArticle();

    const {
        data: article,
        isLoading: articleLoading,
        error: articleError,
    } = useQuery(["article", articleId], () =>
        axios
            .get<{ article: Article }>(`/api/article/${articleId}`)
            .then((res) => res.data.article)
    );

    useEffect(() => {
        if (!article) return;
        const contentState = ContentState.createFromBlockArray(
            htmlToDraft(article.content).contentBlocks
        );

        setEditorState(EditorState.createWithContent(contentState));
        setPreview(article.image);
        setArticleValues({
            title: article.title,
            slug: generateSlug(article.title),
            content: article.content,
            category: article.category,
            image: article.image,
            img_id: article.img_id,
            demo_link: article.demo_link,
            source_link: article.source_link,
        });
        setTags(article.tags.join(" "));
    }, [article, articleId]);

    const onSubmit = async (editorHTML: string) => {
        if (!article) return;
        const articleTags = tags.split(" ");

        const newArticle = {
            ...articleValues,
            userId: article.userId,
            tags: articleTags,
            content: editorHTML,
            code_languages: languageDetector(editorHTML),
        };

        editArticle.mutate({ articleId, selectedImage, newArticle });
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
            success={editArticle.isSuccess}
            loading={articleLoading || editArticle.isLoading}
            alert={articleError || editArticle.error}
        />
    );
};

export default EditArticle;

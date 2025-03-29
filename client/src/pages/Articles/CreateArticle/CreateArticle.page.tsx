import { useState, type JSX } from "react";
import { useLocation } from "react-router";
import useCreateArticle from "../../../hooks/Articles/useCreateArticle";
import type { LocationState } from "../../../types/app.type";
import type {
    ArticleCreated,
    ArticleEditor,
    Category,
} from "../../../types/article.type";
import { generateSlug } from "../../../utils/generateSlug";
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
        html: "",
    });
    const [tags, setTags] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | undefined>(
        undefined,
    );
    const [preview, setPreview] = useState<string | undefined>(undefined);

    const handleSubmit = async (html: string): Promise<void> => {
        const articleTags = tags.split(" ");

        const createdArticle: ArticleCreated = {
            ...articleValues,
            html,
            slug: generateSlug(articleValues.title),
            tags: articleTags,
            image: "",
            img_id: "",
        };

        await createArticle.mutateAsync({
            selectedImage,
            newArticle: createdArticle,
        });
    };

    return (
        <EditorLayout
            articleValues={articleValues}
            setArticleValues={setArticleValues}
            onSubmit={handleSubmit}
            preview={preview}
            setPreview={setPreview}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            tags={tags}
            setTags={setTags}
            success={createArticle.isSuccess}
            loading={createArticle.isPending}
            alert={createArticle.error}
        />
    );
};

export default CreateArticle;

import {
    createContext,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
    useCallback,
    useContext,
    useState,
} from "react";
import type { CommentError, CommentState } from "../../../types/article.type";

type CommentsContext = {
    articleId: string | undefined;
    commentState: CommentState;
    setCommentState: Dispatch<SetStateAction<CommentState>>;
    commentError: CommentError;
    setCommentError: Dispatch<SetStateAction<CommentError>>;
    resetCommentState: () => void;
};

export const CommentsContext = createContext({} as CommentsContext);

const initialCommentState: CommentState = {
    type: "none",
    id: null,
};
const initialCommentError = {
    index: undefined,
    msg: "",
};

export const CommentsProvider = ({
    children,
    value,
}: {
    value: { articleId: string | undefined };
    children: ReactNode;
}): JSX.Element => {
    const articleId = value.articleId;
    const [commentState, setCommentState] =
        useState<CommentState>(initialCommentState);
    const [commentError, setCommentError] =
        useState<CommentError>(initialCommentError);

    const resetCommentState = useCallback(() => {
        setCommentState(initialCommentState);
        setCommentError(initialCommentError);
    }, [setCommentState, setCommentError]);

    return (
        <CommentsContext.Provider
            value={{
                articleId,
                commentState,
                setCommentState,
                commentError,
                setCommentError,
                resetCommentState,
            }}
        >
            {children}
        </CommentsContext.Provider>
    );
};

const useCommentsContext = (): CommentsContext => {
    return useContext(CommentsContext);
};

export default useCommentsContext;

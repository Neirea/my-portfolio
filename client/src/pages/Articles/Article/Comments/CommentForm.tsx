import {
    type ChangeEvent,
    type FormEvent,
    type JSX,
    useEffect,
    useState,
} from "react";
import useCommentsContext from "../../../../hooks/Articles/comments/useCommentsContext";
import useCreateComment from "../../../../hooks/Articles/comments/useCreateComment";
import { ReadButton } from "../../../../styles/common.style";
import type { Comment } from "../../../../types/article.type";
import { CommentFormWrapper } from "./Comments.style";

type ReplyFormProps = {
    comment?: Comment;
    index?: number;
    margin?: number;
    depth?: number;
};

const ReplyForm = ({
    comment,
    index,
    margin,
    depth,
}: ReplyFormProps): JSX.Element => {
    const { commentState } = useCommentsContext();
    const { mutate: createComment, isPending, isSuccess } = useCreateComment();
    const [message, setMessage] = useState("");

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
        setMessage(e.target.value);
    };

    const handleSubmit = (e: FormEvent, index?: number): void => {
        e.preventDefault();

        const submitData = {
            message: message,
            parentId: commentState.id,
        };

        createComment({ submitData, index });
    };

    useEffect(() => {
        if (isSuccess) setMessage("");
    }, [isSuccess]);

    return (
        <CommentFormWrapper
            $depth={depth}
            $margin={margin}
            onSubmit={(e) => handleSubmit(e, index)}
        >
            {comment && (
                <label htmlFor={`reply-${index}`} className="reply-to">
                    <span>{"reply to: "}</span>
                    <span className="comment-author">{`${comment.user.name}`}</span>
                </label>
            )}
            <textarea
                id={comment ? `reply-${index}` : "new-comment"}
                maxLength={280}
                className="create-comment"
                placeholder={comment ? "" : "Post New Comment"}
                autoFocus={comment ? true : false}
                value={message}
                required={true}
                onChange={handleChange}
            ></textarea>
            <ReadButton type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Submit"}
            </ReadButton>
        </CommentFormWrapper>
    );
};

export default ReplyForm;

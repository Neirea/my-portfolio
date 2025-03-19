import { type ChangeEvent, type JSX, useState } from "react";
import useCommentsContext from "../../../../hooks/Articles/comments/useCommentsContext";
import useUpdateComment from "../../../../hooks/Articles/comments/useUpdateComment";
import { ReadButton } from "../../../../styles/common.style";
import type { Comment } from "../../../../types/article.type";

type EditCommentProps = {
    index: number;
    comment: Comment;
};

const EditComment = ({ index, comment }: EditCommentProps): JSX.Element => {
    const [message, setMessage] = useState(comment.message);
    const { resetCommentState } = useCommentsContext();
    const { mutate: updateComment, isPending } = useUpdateComment();

    const handleSaveUpdate = (): void => {
        updateComment({
            commentId: comment._id,
            msg: message,
            authorId: comment.user.id,
            index,
        });
    };

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
        setMessage(e.target.value);
    };

    return (
        <>
            <textarea
                id={index.toString()}
                placeholder="Edit Message"
                maxLength={280}
                autoFocus
                onFocus={(e) => {
                    e.target.setSelectionRange(message.length, message.length);
                }}
                minLength={10}
                className="create-comment"
                value={message}
                required={true}
                onChange={handleChange}
            ></textarea>
            <div className="edit-comment-buttons">
                <ReadButton onClick={handleSaveUpdate} disabled={isPending}>
                    {isPending ? "Saving..." : "Submit"}
                </ReadButton>
                <ReadButton onClick={resetCommentState}>Cancel</ReadButton>
            </div>
        </>
    );
};

export default EditComment;

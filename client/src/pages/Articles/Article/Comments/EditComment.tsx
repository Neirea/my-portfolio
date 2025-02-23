import { type ChangeEvent, useState } from "react";
import useCommentsContext from "../../../../hooks/Articles/comments/useCommentsContext";
import useUpdateComment from "../../../../hooks/Articles/comments/useUpdateComment";
import { ReadButton } from "../../../../styles/styled-components";
import type { Comment } from "../../../../types/article.type";

type EditCommentProps = {
    index: number;
    comment: Comment;
};

const EditComment = ({ index, comment }: EditCommentProps) => {
    const [message, setMessage] = useState(comment.message);
    const { resetCommentState } = useCommentsContext();
    const { mutate: updateComment, isLoading } = useUpdateComment();

    const handleSaveUpdate = async () => {
        updateComment({
            commentId: comment._id,
            msg: message,
            authorId: comment.user.id,
            index,
        });
    };

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
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
                <ReadButton onClick={handleSaveUpdate} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Submit"}
                </ReadButton>
                <ReadButton onClick={resetCommentState}>Cancel</ReadButton>
            </div>
        </>
    );
};

export default EditComment;

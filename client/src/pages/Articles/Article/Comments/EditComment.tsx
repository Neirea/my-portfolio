import { type ChangeEvent, useState } from "react";
import useCommentsContext from "../../../../hooks/Articles/comments/useCommentsContext";
import useUpdateComment from "../../../../hooks/Articles/comments/useUpdateComment";
import { ReadButton } from "../../../../styles/styled-components";
import type { IComment } from "../../../../types/article.type";

interface EditCommentProps {
    index: number;
    comment: IComment;
}

const EditComment = ({ index, comment }: EditCommentProps) => {
    const [message, setMessage] = useState(comment.message);
    const { resetCommentState } = useCommentsContext();
    const { mutate: updateComment, isLoading } = useUpdateComment();

    const handleSaveUpdate = async () => {
        updateComment({ commentId: comment._id, msg: message, index });
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
                    //sets cursor at the end of input
                    e.target.setSelectionRange(message.length, message.length);
                }}
                minLength={10}
                className="create-comment"
                value={message}
                required={true}
                onChange={handleChange}
            ></textarea>
            {/* buttons in the bottom */}
            <div className="edit-comment-buttons">
                {/* Save Edited Content */}
                <ReadButton onClick={handleSaveUpdate} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Submit"}
                </ReadButton>
                {/* Cancel Editing */}
                <ReadButton onClick={resetCommentState}>Cancel</ReadButton>
            </div>
        </>
    );
};

export default EditComment;
